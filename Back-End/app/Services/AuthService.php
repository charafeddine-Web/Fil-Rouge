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
    public function verifyEmail($email, $code)
    {
        $user = $this->userRepo->findByEmail($email);
        if (!$user) {
            return ['success' => false, 'message' => 'User not found.'];
        }
        $verified = $this->userRepo->verifyEmail($user->id, $code);
        if (!$verified) {
            return ['success' => false, 'message' => 'Invalid code'];
        }
        return ['success' => true, 'message' => 'Email verified successfully'];

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
                'unverified' => ['Please verify your email address.'],
            ]);
        }


        if ($user->role === 'conducteur' && $user->status !== 'active') {
            throw ValidationException::withMessages([
                'message' => ['Driver account not activated.']
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return ['user' => $user, 'token' => $token];
    }

    public function updateProfile($user, $request)
    {
        try {
            \Log::info('AuthService: Starting profile update', ['user_id' => $user->id]);
            
            $result = $this->userRepo->updateProfile($user, $request);
            
            \Log::info('AuthService: Profile update completed', ['user_id' => $user->id]);
            
            return $result;
        } catch (\Exception $e) {
            \Log::error('AuthService: Error updating profile', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'user_id' => $user->id
            ]);
            throw $e;
        }
    }
}
