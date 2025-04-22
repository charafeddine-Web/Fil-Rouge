<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    use HasFactory;
    protected $fillable = [
        'status',
        'date_reservation',
        'passager_id',
        'trajet_id',
        'places_reservees',
        'prix_total',
    ];
    public function avis()
    {
        return $this->hasOne(Avis::class);
    }

    public function passager()
    {
        return $this->belongsTo(User::class);
    }

    public function trajet()
    {
        return $this->belongsTo(Trajet::class);
    }


    public function paiement()
    {
        return $this->hasOne(Paiement::class);
    }
}
