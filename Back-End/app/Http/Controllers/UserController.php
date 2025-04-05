<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Conducteur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
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

        $user->update($request->only([
            'nom', 'prenom', 'email', 'telephone', 'password',
        ]));
        if ($request->has('photoDeProfil')) {
            $photoPath = $request->file('photoDeProfil')->store('profile_photos', 'public');
            $user->photoDeProfil = $photoPath;
        }
        if ($request->has('password')) {
            $user->password = Hash::make($request->password);
        }

        if ($user->role == 'conducteur') {
            $conducteur = Conducteur::firstOrCreate(['user_id' => $user->id]);

            $conducteur->update($request->only([
                'num_permis', 'adresse', 'ville', 'date_naissance', 'sexe',
            ]));

            if ($request->hasFile('photo_permis')) {
                $conducteur->photo_permis = $request->file('photo_permis')->store('permis', 'public');
            }

            if ($request->hasFile('photo_identite')) {
                $conducteur->photo_identite = $request->file('photo_identite')->store('identites', 'public');
            }

            $conducteur->save();
        }

        $user->save();

        return response()->json([
            'message' => 'Profil mis à jour avec succès',
            'user' => $user
        ], 200);
    }



}
