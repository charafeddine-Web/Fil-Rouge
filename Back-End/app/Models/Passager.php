<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Passager extends Model
{
    use HasFactory;
    protected $table = 'passagers';

    protected $fillable = [
        'user_id',
    ];

    /**
     * Get the associated user
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    
    /**
     * Get all reservations made by this passenger
     */
    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }

    /**
     * Get all drivers this passenger has messaged
     */
    public function conducteurs()
    {
        return $this->belongsToMany(Conducteur::class, 'messageries', 'passager_id', 'conducteur_id')
            ->withPivot('message')
            ->withTimestamps();
    }
}
