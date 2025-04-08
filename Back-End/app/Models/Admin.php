<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Admin extends User
{
    use HasFactory;
    protected static function boot()
    {
        parent::boot();
        static::creating(function ($admin) {
            $admin->role = 'admin';
        });
    }
}
