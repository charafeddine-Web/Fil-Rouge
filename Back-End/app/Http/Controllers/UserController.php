<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Conducteur;
use App\Services\AuthService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    protected  $AuthService;
    public function __construct( AuthService $AuthService)
    {
        $this->AuthService=$AuthService;
    }
    /**
     * Update user profile based on their role.
     */
    public function updateProfile(Request $request)
    {
        try {
            $user = auth()->user();

            // Log the incoming request data
            \Log::info('Profile update request data:', [
                'user_id' => $user->id,
                'request_data' => $request->all(),
                'files' => $request->allFiles()
            ]);

            $validatedData = $request->validate([
                'nom' => 'nullable|string|max:255',
                'prenom' => 'nullable|string|max:255',
                'email' => 'nullable|string|email|max:255|unique:users,email,' . $user->id,
                'telephone' => 'nullable|string|max:20',
                'password' => 'nullable|string|min:6|confirmed',
                'photoDeProfil' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',

                'num_permis' => 'nullable|string|required_if:role,conducteur|unique:conducteurs,num_permis,' . $user->id,
                'adresse' => 'nullable|required_if:role,conducteur|string|max:255',
                'ville' => 'nullable|required_if:role,conducteur|string|max:255',
                'date_naissance' => 'nullable|required_if:role,conducteur|date',
                'sexe' => 'nullable|required_if:role,conducteur|in:homme,femme',
                'photo_permis' => 'nullable|required_if:role,conducteur|image|mimes:jpg,jpeg,png|max:2048',
                'photo_identite' => 'nullable|required_if:role,conducteur|image|jpg,jpeg,png|max:2048',
            ]);

            \Log::info('Validated data:', $validatedData);

            // Merge validated data with files
            $dataToUpdate = array_merge(
                $validatedData,
                $request->allFiles()
            );

            $updatedUser = $this->AuthService->updateProfile($user, $dataToUpdate);

            \Log::info('Profile updated successfully:', ['user_id' => $user->id]);

            return response()->json([
                'message' => 'Profil mis à jour avec succès',
                'user' => $updatedUser,
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('Validation error in profile update:', [
                'errors' => $e->errors(),
                'user_id' => auth()->id()
            ]);
            return response()->json([
                'message' => 'Validation error',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Error updating profile:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'user_id' => auth()->id()
            ]);
            return response()->json([
                'message' => 'An error occurred while updating the profile',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $user = User::with(['conducteur', 'passager'])->findOrFail($id);

            // Only return necessary user information
            return response()->json([
                'id' => $user->id,
                'nom' => $user->nom,
                'prenom' => $user->prenom,
                'email' => $user->email,
                'telephone' => $user->telephone,
                'role' => $user->role,
                'photoDeProfil' => $user->photoDeProfil,
                'conducteur' => $user->conducteur,
                'passager' => $user->passager
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'User not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }
}
