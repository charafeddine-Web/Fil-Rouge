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



    public function vehicule()
    {
        return $this->hasOne(Vehicule::class, 'conducteur_id');
    }


    public function passagers()
    {
        return $this->belongsToMany(Passager::class, 'messageries', 'conducteur_id', 'passager_id')
            ->withPivot('message')
            ->withTimestamps();
    }

    public function trajets()
    {
        return $this->hasMany(Trajet::class);
    }

}
