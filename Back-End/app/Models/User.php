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

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     * relation entre pasqager et condicteur avec table pivot Avis
     */
    public function conducteurs()
    {
        return $this->belongsToMany(Conducteur::class, 'avis', 'passager_id', 'conducteur_id')
            ->withPivot('note', 'commentaire', 'created_at')
            ->withTimestamps();
    }



    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     * relation entre passager et condicteur avec table pivot messages
     */
    public function conducteursMessages()
    {
        return $this->belongsToMany(Conducteur::class, 'messages', 'passager_id', 'conducteur_id')
            ->withPivot('contenu', 'lu', 'created_at')
            ->withTimestamps();
    }

    public function messagesEnvoyes()
    {
        return $this->hasMany(Message::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     * relation avec trajet avec table pivot reservations
     */
    public function trajets()
    {
        return $this->belongsToMany(Trajet::class, 'reservations', 'passager_id', 'trajet_id')
            ->withPivot('status', 'places_reservees', 'created_at')
            ->withTimestamps();
    }

    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }



}
