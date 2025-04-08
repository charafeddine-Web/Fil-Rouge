<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Avis extends Model
{
    use HasFactory;

    protected $fillable = [
        'commentaire',
        'note',
        'passager_id',
        'conducteur_id',
    ];

    public function passager()
    {
        return $this->belongsTo(Passager::class);
    }

    public function conducteur()
    {
        return $this->belongsTo(Conducteur::class);
    }



}
