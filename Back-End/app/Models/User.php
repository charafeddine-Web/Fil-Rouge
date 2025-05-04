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

    protected $primaryKey = 'id';

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
        return $this->role === 'conducteur';
    }

    public function isPassager()
    {
        return $this->role === 'passager';
    }

    public function isAdmin()
    {
        return $this->role === 'admin';
    }


//    /**
//     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
//     * relation entre passager et condicteur avec table pivot messages
//     */
    public function conducteursMessages()
    {
        return $this->belongsToMany(Conducteur::class, 'messages', 'passager_id', 'conducteur_id')
            ->withPivot('contenu', 'lu', 'created_at')
            ->withTimestamps();
    }

    public function messagesEnvoyes()
    {
        return $this->hasMany(Message::class, 'sender_id');
    }

    public function messagesRecus()
    {
        return $this->hasMany(Message::class, 'receiver_id');
    }

    public function conducteur()
    {
        return $this->hasOne(Conducteur::class);
    }

    public function passager()
    {
        return $this->hasOne(Passager::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     * relation avec trajet avec table pivot reservations
     */
//    public function trajets()
//    {
//        return $this->belongsToMany(Trajet::class, 'reservations', 'passager_id', 'trajet_id')
//            ->withPivot('status', 'places_reservees', 'created_at')
//            ->withTimestamps();
//    }

//    public function reservations()
//    {
//        return $this->hasMany(Reservation::class);
//    }





}
