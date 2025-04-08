<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Avis extends Model
{
    use HasFactory;

    protected $fillable = [
        'contenu',
        'note',
        'user_id',
        'reservation_id',
    ];

    public function passager()
    {
        return $this->belongsTo(Passager::class);
    }

    public function conducteur()
    {
        return $this->belongsTo(Conducteur::class);
    }


    public function reservation()
    {
        return $this->belongsTo(Reservation::class);
    }
}
