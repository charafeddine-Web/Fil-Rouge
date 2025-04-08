<?php
namespace App\Repositories;

use App\Models\Conducteur;
use App\Models\User;
use App\Interfaces\UserRepositoryInterface;
use Illuminate\Support\Facades\Hash;

class UserRepository implements UserRepositoryInterface
{
    protected $model;

    public function __construct(User $user)
    {
        $this->model = $user;
    }
    public function create(array $data)
    {
        return User::create($data);
    }

    public function findByEmail(string $email)
    {
        return User::where('email', $email)->first();
    }
    public function updateProfile($user,$request)
    {
        if ($request->hasFile('photoDeProfil')) {
            $photoPath = $request->file('photoDeProfil')->store('profile_photos', 'public');
            $user->photoDeProfil = $photoPath;
        }

        if ($request->has('password')) {
            $user->password = Hash::make($request->password);
        }

        $user->update($request->only(['nom', 'prenom', 'email', 'telephone']));

        if ($user->role === 'conducteur') {
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

        return $user->fresh();
    }
    public function updateVerificationCode($userId, $code)
    {
        return $this->model->where('id', $userId)->update([
            'verification_code' => $code,
            'email_verified' => false,
        ]);
    }
    public function verifyEmail($userId, $code)
    {
        $user = $this->model->find($userId);
        if (!$user) {
            return response()->json([
                'message' => 'Utilisateur non trouvé.'
            ], 404);
        }
        if ($user && $user->verification_code == $code) {
            $user->email_verified = true;
            $user->verification_code = null;
            $user->save();
            return true;
        }

        return false;
    }

}
