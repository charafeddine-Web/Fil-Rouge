<?php

namespace App\Events;

use App\Models\Message;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use stdClass;

class NewMessage implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $message;

    /**
     * Create a new event instance.
     */
    public function __construct($message)
    {
        // Convert arrays to objects for consistent access
        if (is_array($message)) {
            $this->message = (object) $message;
        } else {
            $this->message = $message;
        }
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        // Safely get sender and receiver IDs regardless of naming convention
        $senderId = $this->getSenderId();
        $receiverId = $this->getReceiverId();
        
        return [
            new PrivateChannel('chat.' . $senderId . '.' . $receiverId),
            new PrivateChannel('chat.' . $receiverId . '.' . $senderId),
            new PrivateChannel('user.' . $receiverId),
        ];
    }

    /**
     * The event's broadcast name.
     */
    public function broadcastAs(): string
    {
        return 'message.sent';
    }

    /**
     * Get the data to broadcast.
     *
     * @return array<string, mixed>
     */
    public function broadcastWith(): array
    {
        // For model objects, try to load relationships
        if ($this->message instanceof Message) {
            return [
                'message' => $this->message->load(['sender', 'receiver'])
            ];
        }
        
        // For stdClass objects or arrays, return as is
        return [
            'message' => $this->message
        ];
    }
    
    /**
     * Safely get the sender ID regardless of format
     */
    private function getSenderId()
    {
        if (is_object($this->message)) {
            return $this->message->sender_id ?? $this->message->from_id ?? null;
        }
        
        if (is_array($this->message)) {
            return $this->message['sender_id'] ?? $this->message['from_id'] ?? null;
        }
        
        return null;
    }
    
    /**
     * Safely get the receiver ID regardless of format
     */
    private function getReceiverId()
    {
        if (is_object($this->message)) {
            return $this->message->receiver_id ?? $this->message->to_id ?? null;
        }
        
        if (is_array($this->message)) {
            return $this->message['receiver_id'] ?? $this->message['to_id'] ?? null;
        }
        
        return null;
    }
} 