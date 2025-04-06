<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Passager;
use App\Models\Conducteur;
use App\Models\Vehicule;
use App\Services\AuthService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    protected  $AuthService;
    public function __construct( AuthService $AuthService)
    {
        $this->AuthService=$AuthService;
    }

    public function register(Request $request)
    {
        $validated= $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
            'telephone' => 'nullable|string|max:20',
            'role' => 'required|in:passager,conducteur,admin',

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
        $result = $this->AuthService->register($validated);
        return response()->json([
            'message' => 'Utilisateur créé avec succès',
            'user' => $result['user'],
            'token' => $result['token']
        ], 201);
    }

    public function login(Request $request)
    {
        $validated=$request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        $result=$this->AuthService->login($validated);

        return response()->json([
            'message' => 'Connexion réussie',
            'user' => $result['user'],
            'token' => $result['token']
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

