<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    use HasFactory;
    protected  $fillable = [
        'passager_id',
        'conducteur_id',
        'contenu',
        'lu'
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
