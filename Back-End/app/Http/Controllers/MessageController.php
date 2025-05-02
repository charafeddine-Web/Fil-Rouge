<?php

namespace App\Http\Controllers;

use App\Events\NewMessage;
use App\Models\Message;
use App\Models\User;
use App\Models\Trajet;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class MessageController extends Controller
{
    /**
     * Get all contacts for the authenticated user
     * based on message history and trip reservations
     */
    public function getContacts(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        try {
            // Get users this user has messaged or received messages from
            $messageContactIds = DB::table('messages')
                ->where('from_id', $user->id)
                ->orWhere('to_id', $user->id)
                ->get(['from_id', 'to_id'])
                ->map(function ($message) use ($user) {
                    return $message->from_id == $user->id ? $message->to_id : $message->from_id;
                })
                ->unique()
                ->values();

            // For drivers: Get passengers who booked their trips
            $reservationContacts = collect();
            if ($user->role === 'conducteur') {
                $driverTrips = DB::table('trajets')->where('conducteur_id', $user->id)->pluck('id');

                $reservationContacts = DB::table('reservations')
                    ->whereIn('trajet_id', $driverTrips)
                    ->pluck('passager_id')
                    ->unique();
            }

            // For passengers: Get drivers of trips they've booked
            if ($user->role === 'passager') {
                $reservationContacts = DB::table('reservations')
                    ->where('passager_id', $user->id)
                    ->join('trajets', 'reservations.trajet_id', '=', 'trajets.id')
                    ->pluck('trajets.conducteur_id')
                    ->unique();
            }

            // Combine both sets of IDs
            $contactIds = $messageContactIds->merge($reservationContacts)->unique()->values();

            // Get user details for all contacts
            $contacts = User::whereIn('id', $contactIds)
                ->get(['id', 'nom', 'prenom', 'email', 'photoDeProfil', 'role'])
                ->map(function ($contact) use ($user) {
                    // Count unread messages
                    $unreadCount = DB::table('messages')
                        ->where('from_id', $contact->id)
                        ->where('to_id', $user->id)
                        ->where('seen', false)
                        ->count();

                    return [
                        'id' => $contact->id,
                        'name' => $contact->nom && $contact->prenom
                            ? $contact->nom . ' ' . $contact->prenom
                            : $contact->email,
                        'email' => $contact->email,
                        'avatar' => $contact->photoDeProfil,
                        'role' => $contact->role,
                        'unread' => $unreadCount
                    ];
                });

            return response()->json([
                'status' => true,
                'contacts' => $contacts
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Error getting contacts',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get messages between the authenticated user and another user
     */
    public function getMessages($userId)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        // Validate user exists
        $otherUser = User::find($userId);
        if (!$otherUser) {
            return response()->json(['error' => 'User not found'], 404);
        }

        try {
            // Get messages using direct SQL
            $messagesRaw = DB::select("
                SELECT id, from_id, to_id, body AS content, seen, created_at, updated_at
                FROM messages
                WHERE (from_id = ? AND to_id = ?) OR (from_id = ? AND to_id = ?)
                ORDER BY created_at ASC
            ", [$user->id, $userId, $userId, $user->id]);
            
            // Format messages with user data
            $messages = collect($messagesRaw)->map(function($message) use ($user) {
                $isSender = $message->from_id == $user->id;
                $otherUserId = $isSender ? $message->to_id : $message->from_id;
                $otherUser = User::select('id', 'nom', 'prenom', 'email', 'photoDeProfil', 'role')
                    ->find($otherUserId);
                
                return [
                    'id' => $message->id,
                    'from_id' => $message->from_id,
                    'to_id' => $message->to_id,
                    'sender_id' => $message->from_id,  // Add both naming conventions
                    'receiver_id' => $message->to_id,
                    'content' => $message->content,
                    'seen' => (bool)$message->seen,
                    'created_at' => $message->created_at,
                    'updated_at' => $message->updated_at,
                    'sender' => $isSender ? [
                        'id' => $user->id,
                        'nom' => $user->nom,
                        'prenom' => $user->prenom,
                        'email' => $user->email,
                        'photoDeProfil' => $user->photoDeProfil,
                        'role' => $user->role
                    ] : [
                        'id' => $otherUser->id,
                        'nom' => $otherUser->nom,
                        'prenom' => $otherUser->prenom,
                        'email' => $otherUser->email,
                        'photoDeProfil' => $otherUser->photoDeProfil,
                        'role' => $otherUser->role
                    ],
                    'receiver' => $isSender ? [
                        'id' => $otherUser->id,
                        'nom' => $otherUser->nom,
                        'prenom' => $otherUser->prenom,
                        'email' => $otherUser->email,
                        'photoDeProfil' => $otherUser->photoDeProfil,
                        'role' => $otherUser->role
                    ] : [
                        'id' => $user->id,
                        'nom' => $user->nom,
                        'prenom' => $user->prenom,
                        'email' => $user->email,
                        'photoDeProfil' => $user->photoDeProfil,
                        'role' => $user->role
                    ]
                ];
            });

            // Mark messages as read
            DB::update("
                UPDATE messages 
                SET seen = true, is_read = true 
                WHERE from_id = ? AND to_id = ? AND seen = false
            ", [$userId, $user->id]);

            return response()->json([
                'status' => true,
                'messages' => $messages
            ]);
            
        } catch (\Exception $e) {
            \Log::error('Error getting messages: ' . $e->getMessage());
            \Log::error('Stack trace: ' . $e->getTraceAsString());
            
            return response()->json([
                'status' => false,
                'message' => 'Error getting messages',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Send a message to another user
     */
    public function sendMessage(Request $request)
    {
        $request->validate([
            'to_id' => 'required|exists:users,id',
            'content' => 'required|string'
        ]);

        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        try {
            // Use our already confirmed working UUID approach
            $stmt = DB::select("SELECT uuid_generate_v4() AS uuid");
            $uuid = $stmt[0]->uuid;
            
            if (empty($uuid)) {
                throw new \Exception("Failed to generate UUID");
            }
            
            // Use parameterized query for safety
            $success = DB::insert("
                INSERT INTO messages (id, from_id, to_id, body, seen, created_at, updated_at) 
                VALUES (?, ?, ?, ?, false, NOW(), NOW())
            ", [$uuid, $user->id, $request->to_id, $request->content]);
            
            if (!$success) {
                throw new \Exception("Failed to insert message");
            }
            
            // Get user information
            $senderUser = User::find($user->id);
            $receiverUser = User::find($request->to_id);
            
            // Format response object
            $formattedMessage = [
                'id' => $uuid,
                'from_id' => $user->id, 
                'to_id' => $request->to_id,
                'sender_id' => $user->id,      // Include both naming conventions
                'receiver_id' => $request->to_id,
                'content' => $request->content,
                'seen' => false,
                'created_at' => now()->toDateTimeString(),
                'updated_at' => now()->toDateTimeString(),
                'sender' => [
                    'id' => $senderUser->id,
                    'nom' => $senderUser->nom,
                    'prenom' => $senderUser->prenom,
                    'email' => $senderUser->email,
                    'photoDeProfil' => $senderUser->photoDeProfil,
                    'role' => $senderUser->role
                ],
                'receiver' => [
                    'id' => $receiverUser->id,
                    'nom' => $receiverUser->nom,
                    'prenom' => $receiverUser->prenom,
                    'email' => $receiverUser->email,
                    'photoDeProfil' => $receiverUser->photoDeProfil,
                    'role' => $receiverUser->role
                ]
            ];
            
            // Broadcast message if needed
            $messageForBroadcast = (object) $formattedMessage;
            broadcast(new NewMessage($messageForBroadcast))->toOthers();
            
            return response()->json([
                'status' => true,
                'message' => $formattedMessage
            ]);
            
        } catch (\Exception $e) {
            \Log::error('Error sending message: ' . $e->getMessage());
            \Log::error('Stack trace: ' . $e->getTraceAsString());
            
            return response()->json([
                'status' => false,
                'message' => 'Error sending message',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get the count of unread messages for the authenticated user
     */
    public function getUnreadCount()
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $count = Message::where('to_id', $user->id)
            ->where('seen', false)
            ->count();

        return response()->json([
            'status' => true,
            'count' => $count
        ]);
    }

    /**
     * Mark messages as read
     */
    public function markAsRead(Request $request)
    {
        $request->validate([
            'from_id' => 'required|exists:users,id'
        ]);

        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        try {
            // Use direct SQL update to avoid issues
            $updated = DB::update("
                UPDATE messages 
                SET seen = true, is_read = true 
                WHERE from_id = ? AND to_id = ? AND seen = false
            ", [$request->from_id, $user->id]);

            return response()->json([
                'status' => true,
                'updated' => $updated
            ]);
        } catch (\Exception $e) {
            \Log::error('Error marking messages as read: ' . $e->getMessage());
            \Log::error('Stack trace: ' . $e->getTraceAsString());
            
            return response()->json([
                'status' => false,
                'message' => 'Error marking messages as read',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Add a user as a contact
     */
    public function addContact(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id'
        ]);

        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        try {
            // Since we're not using a separate contacts table,
            // we'll just create an empty message to establish the connection
            // if they haven't messaged each other yet

            $existingMessages = DB::table('messages')
                ->where(function ($query) use ($user, $request) {
                    $query->where('from_id', $user->id)
                        ->where('to_id', $request->user_id);
                })
                ->orWhere(function ($query) use ($user, $request) {
                    $query->where('from_id', $request->user_id)
                        ->where('to_id', $user->id);
                })
                ->exists();

            if (!$existingMessages) {
                // Generate UUID for the message using the same approach
                $stmt = DB::select("SELECT uuid_generate_v4() AS uuid");
                $uuid = $stmt[0]->uuid;
                
                if (empty($uuid)) {
                    throw new \Exception("Failed to generate UUID");
                }
                
                // Create a system message to establish the contact
                DB::insert("
                    INSERT INTO messages (id, from_id, to_id, body, seen, created_at, updated_at) 
                    VALUES (?, ?, ?, ?, false, NOW(), NOW())
                ", [$uuid, $user->id, $request->user_id, 'Bonjour, je souhaiterais discuter avec vous.']);

                // Get the inserted message
                $message = DB::table('messages')->where('id', $uuid)->first();

                // Format message for broadcast
                $formattedMessage = [
                    'id' => $message->id,
                    'from_id' => $message->from_id,
                    'to_id' => $message->to_id,
                    'sender_id' => $message->from_id,  // Include both naming conventions
                    'receiver_id' => $message->to_id,
                    'content' => $message->body,
                    'seen' => (bool)$message->seen,
                    'created_at' => $message->created_at,
                    'updated_at' => $message->updated_at,
                    'sender' => [
                        'id' => $user->id,
                        'nom' => $user->nom,
                        'prenom' => $user->prenom,
                        'email' => $user->email,
                        'photoDeProfil' => $user->photoDeProfil,
                        'role' => $user->role
                    ]
                ];

                // Broadcast the message
                $messageForBroadcast = (object) $formattedMessage;
                broadcast(new NewMessage($messageForBroadcast))->toOthers();
            }

            return response()->json([
                'status' => true,
                'message' => 'Contact added successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Error adding contact',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
