<?php

namespace App\Services;

use App\Mail\VerificationCodeMail;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Storage;
use App\Interfaces\UserRepositoryInterface;
use App\Interfaces\ConducteurRepositoryInterface;
use App\Interfaces\VehiculeRepositoryInterface;

class AuthService
{
    protected $userRepo, $conducteurRepo, $vehiculeRepo;

    public function __construct(
        UserRepositoryInterface $userRepo,
        ConducteurRepositoryInterface $conducteurRepo,
        VehiculeRepositoryInterface $vehiculeRepo
    ) {
        $this->userRepo = $userRepo;
        $this->conducteurRepo = $conducteurRepo;
        $this->vehiculeRepo = $vehiculeRepo;
    }

    public function register($data)
    {
        $photoPermisPath = isset($data['photo_permis']) ? $data['photo_permis']->store('permis', 'public') : null;
        $photoIdentitePath = isset($data['photo_identite']) ? $data['photo_identite']->store('identites', 'public') : null;

        $user = $this->userRepo->create([
            'nom' => $data['nom'],
            'prenom' => $data['prenom'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'telephone' => $data['telephone'] ?? null,
            'status' => $data['role'] === 'conducteur' ? 'en_attente' : 'active',
            'role' => $data['role']
        ]);

        if ($data['role'] === 'conducteur') {
            $conducteur = $this->conducteurRepo->create([
                'user_id' => $user->id,
                'num_permis' => $data['num_permis'],
                'adresse' => $data['adresse'],
                'ville' => $data['ville'],
                'date_naissance' => $data['date_naissance'],
                'sexe' => $data['sexe'],
                'photo_permis' => $photoPermisPath,
                'photo_identite' => $photoIdentitePath,
                'note_moyenne' => 0,
                'disponibilite' => true,
            ]);

            $this->vehiculeRepo->create([
                'conducteur_id' => $conducteur->id,
                'marque' => $data['marque'],
                'modele' => $data['modele'],
                'immatriculation' => $data['immatriculation'],
                'couleur' => $data['couleur'],
                'nombre_places' => $data['nombre_places'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        $verificationCode = rand(100000, 999999);
        $this->userRepo->updateVerificationCode($user->id, $verificationCode);

        Mail::to($user->email)->send(new VerificationCodeMail($verificationCode));

        return ['user' => $user, 'token' => $token];
    }
    public function verifyEmail($userId, $code)
    {
        return $this->userRepo->verifyEmail($userId, $code);
    }

    public function login($data)
    {
        $user = $this->userRepo->findByEmail($data['email']);

        if (!$user || !Hash::check($data['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Invalid credentials.']
            ]);
        }
        if (!$user->email_verified) {
            throw ValidationException::withMessages([
                'email' => ['message'=>'Veuillez vérifier votre adresse e-mail.']
            ]);
        }


        if ($user->role === 'conducteur' && $user->status !== 'active') {
            throw ValidationException::withMessages([
                'message' => ['Compte conducteur non activé.']
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return ['user' => $user, 'token' => $token];
    }

    public function updateProfile( $user,  $request)
    {
        return $this->userRepo->updateProfile($user, $request);
    }
}
