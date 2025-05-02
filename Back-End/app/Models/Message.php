<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    use HasFactory;

    protected $table = 'messages';
    
    // Set incrementing to true for auto-incrementing ID
    public $incrementing = true;
    
    // Set ID type to bigInteger
    protected $keyType = 'int';

    protected $fillable = [
        'sender_id',
        'receiver_id',
        'from_id',
        'to_id',
        'content',
        'body',
        'is_read',
        'seen'
    ];

    protected $casts = [
        'is_read' => 'boolean',
        'seen' => 'boolean',
    ];

    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    public function receiver()
    {
        return $this->belongsTo(User::class, 'receiver_id');
    }
}
