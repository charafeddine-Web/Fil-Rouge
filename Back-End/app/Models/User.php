<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;
    protected $fillable = [
        'nom',
        'prenom',
        'email',
        'password',
        'telephone',
        'status',
        'role',
        'photoDeProfil',
    ];
    protected $hidden = ['password'];
    protected $casts = ['password' => 'hashed'];

    public function isConducteur()
    {
        return $this->type === 'conducteur';
    }

    public function isPassager()
    {
        return $this->type === 'passager';
    }

    public function isAdmin()
    {
        return $this->type === 'admin';
    }
}
