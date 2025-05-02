<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Conducteur extends Model
{
    use HasFactory;
    
    protected $table = 'conducteurs';

    protected $fillable = [
        'user_id',
        'num_permis',
        'disponibilite',
        'note_moyenne',
        'adresse',
        'ville',
        'date_naissance',
        'sexe',
        'photo_permis',
        'photo_identite',
    ];

    /**
     * Get the associated user
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\belongsToMany
     */
    public function passagersMessages()
    {
        return $this->belongsToMany(User::class, 'messages', 'conducteur_id', 'passager_id')
            ->withPivot('contenu', 'lu', 'created_at')
            ->withTimestamps();
    }
    
    /**
     * Get messages received by this driver
     */
    public function messagesRecus()
    {
        return $this->hasMany(Message::class, 'conducteur_id');
    }

    /**
     * Get messages sent by this driver
     */
    public function messagesEnvoyes()
    {
        return $this->hasMany(Message::class, 'envoyeur_id')->where('type_envoyeur', 'conducteur');
    }

    /**
     * Get the associated vehicle
     */
    public function vehicule()
    {
        return $this->hasOne(Vehicule::class, 'conducteur_id');
    }

    /**
     * Get all trips created by this driver
     */
    public function trajets()
    {
        return $this->hasMany(Trajet::class);
    }
}
