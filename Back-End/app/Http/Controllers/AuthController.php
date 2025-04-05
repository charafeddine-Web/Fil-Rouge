<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Passager;
use App\Models\Conducteur;
use App\Models\Vehicule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
            'telephone' => 'nullable|string|max:20',
            'role' => 'required|in:passager,conducteur,admin',

            // Champs spécifiques au conducteur
            'num_permis' => 'nullable|required_if:role,conducteur|string|unique:conducteurs,num_permis',
            'adresse' => 'nullable|required_if:role,conducteur|string|max:255',
            'ville' => 'nullable|required_if:role,conducteur|string|max:255',
            'date_naissance' => 'nullable|required_if:role,conducteur|date',
            'sexe' => 'nullable|required_if:role,conducteur|in:homme,femme',
            'photo_permis' => 'nullable|required_if:role,conducteur|image|mimes:jpg,jpeg,png|max:2048',
            'photo_identite' => 'nullable|required_if:role,conducteur|image|mimes:jpg,jpeg,png|max:2048',

            'marque' => 'nullable|required_if:role,conducteur|string|max:255',
            'modele' => 'nullable|required_if:role,conducteur|string|max:255',
            'immatriculation' => 'nullable|required_if:role,conducteur|string|unique:vehicules,immatriculation',
            'couleur' => 'nullable|required_if:role,conducteur|string|max:255',
            'nombre_places' => 'nullable|required_if:role,conducteur|integer|min:1',
        ]);

        $photoPermisPath = $request->hasFile('photo_permis') ? $request->file('photo_permis')->store('permis', 'public') : null;
        $photoIdentitePath = $request->hasFile('photo_identite') ? $request->file('photo_identite')->store('identites', 'public') : null;

        $user = User::create([
            'nom' => $request->nom,
            'prenom' => $request->prenom,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'telephone' => $request->telephone,
            'status' => $request->role === 'conducteur' ? 'en_attente' : 'active',
            'role' => $request->role,
        ]);



        if ($request->role === 'conducteur') {
            $conducteur = Conducteur::create([
                'user_id' => $user->id,
                'num_permis' => $request->num_permis,
                'disponibilite' => true,
                'note_moyenne' => 0,
                'adresse' => $request->adresse,
                'ville' => $request->ville,
                'date_naissance' => $request->date_naissance,
                'sexe' => $request->sexe,
                'photo_permis' => $photoPermisPath,
                'photo_identite' => $photoIdentitePath,
            ]);

            Vehicule::create([
                'conducteur_id' => $conducteur->id,
                'marque' => $request->marque,
                'modele' => $request->modele,
                'immatriculation' => $request->immatriculation,
                'couleur' => $request->couleur,
                'nombre_places' => $request->nombre_places,
            ]);
        }


        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Utilisateur créé avec succès',
            'user' => $user,
            'token' => $token
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Les informations de connexion sont incorrectes.']
            ]);
        }
        if ($user->role === 'conducteur' && $user->status !== 'active') {
            return response()->json([
                'message' => 'Votre compte est en attente de validation par l\'administrateur.'
            ], 403);
        }


        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Connexion réussie',
            'token' => $token,
            'user' => $user
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json(['message' => 'Déconnexion réussie']);
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }
}

