<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Passager extends User
{
    use HasFactory;
    protected $table = 'users';

    public function conducteurs()
    {
        return $this->belongsToMany(Conducteur::class, 'messageries', 'passager_id', 'conducteur_id')
            ->withPivot('message')
            ->withTimestamps();
    }
}
