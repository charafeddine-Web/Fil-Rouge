<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Trajet extends Model
{
    use HasFactory;

    protected $fillable = [
        'conducteur_id',
        'lieu_depart',
        'lieu_arrivee',
        'date_depart',
        'nombre_places',
        'prix',
    ];

    public function conducteur()
    {
        return $this->belongsTo(Conducteur::class);
    }
}

