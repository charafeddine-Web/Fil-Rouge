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
        'nombre_places'
    ];

    public function conducteur()
    {
        return $this->belongsTo(Conducteur::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     * relation avec passager avec table pivot reservations
     */
    public function passagers()
    {
        return $this->belongsToMany(User::class, 'reservations', 'trajet_id', 'passager_id')
            ->withPivot('status', 'places_reservees', 'created_at')
            ->withTimestamps();
    }

    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }

}

