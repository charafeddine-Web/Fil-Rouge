<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\User;
use App\Events\ChatMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class ChatController extends Controller
{
    public function sendMessage(Request $request)
    {
        try {
            $request->validate([
                'receiver_id' => 'required|exists:users,id',
                'message' => 'required|string'
            ]);

            $message = Message::create([
                'sender_id' => Auth::id(),
                'receiver_id' => $request->receiver_id,
                'message' => $request->message,
                'is_read' => false
            ]);

            // Broadcast the message
            broadcast(new ChatMessage($message))->toOthers();

            return response()->json($message->load(['sender', 'receiver']));
        } catch (\Exception $e) {
            Log::error('Error sending message: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to send message'], 500);
        }
    }

    public function getMessages($userId)
    {
        try {
            $messages = Message::where(function($query) use ($userId) {
                $query->where('sender_id', Auth::id())
                      ->where('receiver_id', $userId);
            })->orWhere(function($query) use ($userId) {
                $query->where('sender_id', $userId)
                      ->where('receiver_id', Auth::id());
            })
            ->with(['sender', 'receiver'])
            ->orderBy('created_at', 'asc')
            ->get();

            return response()->json($messages);
        } catch (\Exception $e) {
            Log::error('Error getting messages: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch messages'], 500);
        }
    }

    public function getAllMessages()
    {
        try {
            if (!Auth::check()) {
                Log::error('User not authenticated in getAllMessages');
                return response()->json(['error' => 'User not authenticated'], 401);
            }

            $userId = Auth::id();
            Log::info('Fetching messages for user: ' . $userId);
            
            $messages = Message::where(function($query) use ($userId) {
                $query->where('sender_id', $userId)
                    ->orWhere('receiver_id', $userId);
            })
            ->with(['sender', 'receiver'])
            ->orderBy('created_at', 'desc')
            ->get();

            Log::info('Successfully fetched ' . $messages->count() . ' messages');
            
            return response()->json($messages);
        } catch (\Exception $e) {
            Log::error('Error in getAllMessages: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            return response()->json(['error' => 'Failed to fetch messages: ' . $e->getMessage()], 500);
        }
    }

    public function markAsRead($messageId)
    {
        try {
            $message = Message::findOrFail($messageId);
            $message->update(['is_read' => true]);
            return response()->json($message);
        } catch (\Exception $e) {
            Log::error('Error marking message as read: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to mark message as read'], 500);
        }
    }
} 