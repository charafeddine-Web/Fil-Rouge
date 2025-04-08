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
        $user = auth()->user();
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
            'photo_identite' => 'nullable|required_if:role,conducteur|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $updatedUser = $this->AuthService->updateProfile($user, $request);

        return response()->json([
            'message' => 'Profil mis à jour avec succès',
            'user' => $updatedUser,
        ]);
    }
}
