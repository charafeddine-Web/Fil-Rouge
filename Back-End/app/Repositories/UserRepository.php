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
    public function updateProfile($user, $data)
    {
        try {
            \Log::info('UserRepository: Starting profile update', ['user_id' => $user->id]);
            
            // Handle profile photo if it exists
            if (isset($data['photoDeProfil']) && $data['photoDeProfil'] instanceof \Illuminate\Http\UploadedFile) {
                $photoPath = $data['photoDeProfil']->store('profile_photos', 'public');
                $user->photoDeProfil = $photoPath;
            }

            // Handle password if it exists
            if (isset($data['password'])) {
                $user->password = Hash::make($data['password']);
            }

            // Update basic user information
            $user->update([
                'nom' => $data['nom'] ?? $user->nom,
                'prenom' => $data['prenom'] ?? $user->prenom,
                'email' => $data['email'] ?? $user->email,
                'telephone' => $data['telephone'] ?? $user->telephone,
            ]);

            // Handle driver-specific information
            if ($user->role === 'conducteur') {
                $conducteur = Conducteur::firstOrCreate(['user_id' => $user->id]);
                
                // Update driver information
                $conducteur->update([
                    'num_permis' => $data['num_permis'] ?? $conducteur->num_permis,
                    'adresse' => $data['adresse'] ?? $conducteur->adresse,
                    'ville' => $data['ville'] ?? $conducteur->ville,
                    'date_naissance' => $data['date_naissance'] ?? $conducteur->date_naissance,
                    'sexe' => $data['sexe'] ?? $conducteur->sexe,
                ]);

                // Handle driver's license photo
                if (isset($data['photo_permis']) && $data['photo_permis'] instanceof \Illuminate\Http\UploadedFile) {
                    $conducteur->photo_permis = $data['photo_permis']->store('permis', 'public');
                }

                // Handle ID photo
                if (isset($data['photo_identite']) && $data['photo_identite'] instanceof \Illuminate\Http\UploadedFile) {
                    $conducteur->photo_identite = $data['photo_identite']->store('identites', 'public');
                }

                $conducteur->save();
            }

            \Log::info('UserRepository: Profile update completed', ['user_id' => $user->id]);
            
            return $user->fresh();
        } catch (\Exception $e) {
            \Log::error('UserRepository: Error updating profile', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'user_id' => $user->id
            ]);
            throw $e;
        }
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
        if (!$user || $user->verification_code !== $code) {
            return false;
        }
        $user->email_verified = true;
        $user->verification_code = null;
        $user->save();

        return true;
    }

}
