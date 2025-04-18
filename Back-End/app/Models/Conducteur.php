<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Conducteur extends User
{
    use HasFactory;

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
    public function passagers()
    {
        return $this->belongsToMany(Passager::class, 'avis', 'conducteur_id', 'passager_id')
            ->withPivot('note', 'commentaire', 'created_at')
            ->withTimestamps();
    }
    public function avis()
    {
        return $this->hasMany(Avis::class);
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
    public function messagesRecus()
    {
        return $this->hasMany(Message::class);
    }


    public function vehicule()
    {
        return $this->hasOne(Vehicule::class, 'conducteur_id');
    }

    public function trajets()
    {
        return $this->hasMany(Trajet::class);
    }

}
