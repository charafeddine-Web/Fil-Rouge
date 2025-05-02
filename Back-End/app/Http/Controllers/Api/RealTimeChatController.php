<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Exception;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

class RealTimeChatController extends Controller
{
    /**
     * Get the authenticated user
     */
    public function getCurrentUser()
    {
        $user = Auth::user();
        
        if (!$user) {
            return response()->json([
                'status' => false,
                'message' => 'User not authenticated'
            ], 401);
        }

        return response()->json([
            'status' => true,
            'user' => $user
        ]);
    }

    /**
     * Get all users that the current user can chat with
     */
    public function getContacts()
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return response()->json([
                    'status' => false,
                    'message' => 'User not authenticated'
                ], 401);
            }

            // Simple approach - just get all users except the current one
            $contacts = User::where('id', '!=', $user->id)
                ->select('id', 'name', 'email')
                ->when(Schema::hasColumn('users', 'role'), function($q) {
                    return $q->addSelect('role');
                })
                ->get();
            
            Log::info("RealTimeChat: Found " . count($contacts) . " contacts");
            
            return response()->json([
                'status' => true,
                'contacts' => $contacts
            ]);
            
        } catch (Exception $e) {
            Log::error("RealTimeChat error in getContacts: " . $e->getMessage());
            Log::error("Stack trace: " . $e->getTraceAsString());
            
            return response()->json([
                'status' => false,
                'message' => 'Error retrieving contacts',
                'debug_message' => $e->getMessage(),
                'contacts' => [] // Send empty array for frontend to handle
            ], 500);
        }
    }

    /**
     * Get the chat messages between the current user and another user
     */
    public function getMessages($userId)
    {
        try {
            $currentUser = Auth::user();
            
            if (!$currentUser) {
                return response()->json([
                    'status' => false,
                    'message' => 'User not authenticated'
                ], 401);
            }
            
            Log::info("Fetching messages between {$currentUser->id} and {$userId}");
            
            // We'll use a direct DB query approach instead of using models
            // This makes it simpler and more direct
            $messages = $this->getMessagesBetweenUsers($currentUser->id, $userId);
            
            return response()->json([
                'status' => true,
                'messages' => $messages
            ]);
            
        } catch (Exception $e) {
            Log::error("Error fetching messages: " . $e->getMessage());
            Log::error("Stack trace: " . $e->getTraceAsString());
            
            return response()->json([
                'status' => false,
                'message' => 'Error fetching messages',
                'debug_message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Send a message to another user
     */
    public function sendMessage(Request $request)
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return response()->json([
                    'status' => false,
                    'message' => 'User not authenticated'
                ], 401);
            }
            
            $validated = $request->validate([
                'to_id' => 'required|numeric|exists:users,id',
                'message' => 'required|string',
            ]);
            
            // Create a direct message in the database
            $messageData = [
                'from_id' => $user->id,
                'to_id' => $request->to_id,
                'body' => $request->message,
                'seen' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ];
            
            // Store the message
            $this->storeMessage($messageData);
            
            // Prepare response format - consistent with what frontend expects
            $responseMessage = [
                'id' => $messageData['from_id'] . '-' . now()->timestamp,
                'from_id' => $messageData['from_id'],
                'to_id' => $messageData['to_id'],
                'sender' => [
                    'id' => $user->id,
                    'name' => $user->nom && $user->prenom 
                        ? $user->nom . ' ' . $user->prenom 
                        : $user->email
                ],
                'body' => $messageData['body'],
                'created_at' => $messageData['created_at'],
                'seen' => false
            ];
            
            return response()->json([
                'status' => true,
                'message' => $responseMessage
            ]);
            
        } catch (Exception $e) {
            Log::error("Error sending message: " . $e->getMessage());
            Log::error("Stack trace: " . $e->getTraceAsString());
            
            return response()->json([
                'status' => false,
                'message' => 'Error sending message',
                'debug_message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mark messages as seen
     */
    public function markAsSeen(Request $request)
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return response()->json([
                    'status' => false,
                    'message' => 'User not authenticated'
                ], 401);
            }
            
            $validated = $request->validate([
                'from_id' => 'required|numeric',
            ]);
            
            // Update messages to mark them as seen
            $this->markMessagesAsSeen($request->from_id, $user->id);
            
            return response()->json([
                'status' => true,
                'message' => 'Messages marked as seen'
            ]);
            
        } catch (Exception $e) {
            Log::error("Error marking messages as seen: " . $e->getMessage());
            Log::error("Stack trace: " . $e->getTraceAsString());
            
            return response()->json([
                'status' => false,
                'message' => 'Error marking messages as seen',
                'debug_message' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Get unread message count for the current user
     */
    public function getUnreadCount()
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return response()->json([
                    'status' => false,
                    'message' => 'User not authenticated'
                ], 401);
            }
            
            // Count unread messages
            $count = $this->countUnreadMessages($user->id);
            
            return response()->json([
                'status' => true,
                'count' => $count
            ]);
            
        } catch (Exception $e) {
            Log::error("Error getting unread count: " . $e->getMessage());
            Log::error("Stack trace: " . $e->getTraceAsString());
            
            return response()->json([
                'status' => false,
                'message' => 'Error getting unread count',
                'debug_message' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Add a user as a contact (create an initial message if none exists)
     */
    public function addContact(Request $request)
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return response()->json([
                    'status' => false,
                    'message' => 'User not authenticated'
                ], 401);
            }
            
            $validated = $request->validate([
                'user_id' => 'required|numeric|exists:users,id',
            ]);
            
            // Check if there are existing messages between these users
            $existingMessages = DB::table('messages')
                ->where(function($query) use ($user, $request) {
                    $query->where('from_id', $user->id)
                          ->where('to_id', $request->user_id);
                })
                ->orWhere(function($query) use ($user, $request) {
                    $query->where('from_id', $request->user_id)
                          ->where('to_id', $user->id);
                })
                ->exists();
                
            // If no messages exist, create an initial one
            if (!$existingMessages) {
                $messageData = [
                    'id' => (string) Str::uuid(),
                    'from_id' => $user->id,
                    'to_id' => $request->user_id,
                    'body' => 'Bonjour, je souhaiterais discuter avec vous.',
                    'seen' => 0,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
                
                $this->storeMessage($messageData);
            }
            
            return response()->json([
                'status' => true,
                'message' => 'Contact added successfully'
            ]);
            
        } catch (Exception $e) {
            Log::error("Error adding contact: " . $e->getMessage());
            Log::error("Stack trace: " . $e->getTraceAsString());
            
            return response()->json([
                'status' => false,
                'message' => 'Error adding contact',
                'debug_message' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Helper functions for database operations
     */
    
    private function getMessagesBetweenUsers($user1Id, $user2Id)
    {
        // If the messages table doesn't exist, return an empty array
        if (!$this->checkMessagesTable()) {
            return [];
        }
        
        if (Schema::hasColumn('messages', 'from_id')) {
            // New table schema
            return DB::table('messages')
                ->where(function($query) use ($user1Id, $user2Id) {
                    $query->where('from_id', $user1Id)
                          ->where('to_id', $user2Id);
                })
                ->orWhere(function($query) use ($user1Id, $user2Id) {
                    $query->where('from_id', $user2Id)
                          ->where('to_id', $user1Id);
                })
                ->orderBy('created_at', 'asc')
                ->get();
        } else {
            // Standard message model schema
            return DB::table('messages')
                ->where(function($query) use ($user1Id, $user2Id) {
                    $query->where('sender_id', $user1Id)
                          ->where('receiver_id', $user2Id);
                })
                ->orWhere(function($query) use ($user1Id, $user2Id) {
                    $query->where('sender_id', $user2Id)
                          ->where('receiver_id', $user1Id);
                })
                ->orderBy('created_at', 'asc')
                ->get();
        }
    }
    
    private function storeMessage($messageData)
    {
        // Create messages table if it doesn't exist
        $this->createMessagesTableIfNotExists();
        
        // Prepare data for insertion, supporting both field naming conventions
        $insertData = [
            'created_at' => $messageData['created_at'],
            'updated_at' => $messageData['updated_at'],
        ];
        
        // Add fields based on what's available in the table
        if (Schema::hasColumn('messages', 'from_id')) {
            $insertData['from_id'] = $messageData['from_id'];
        }
        
        if (Schema::hasColumn('messages', 'to_id')) {
            $insertData['to_id'] = $messageData['to_id'];
        }
        
        if (Schema::hasColumn('messages', 'sender_id')) {
            $insertData['sender_id'] = $messageData['from_id'];
        }
        
        if (Schema::hasColumn('messages', 'receiver_id')) {
            $insertData['receiver_id'] = $messageData['to_id'];
        }
        
        if (Schema::hasColumn('messages', 'body')) {
            $insertData['body'] = $messageData['body'];
        }
        
        if (Schema::hasColumn('messages', 'content')) {
            $insertData['content'] = $messageData['body'];
        }
        
        if (Schema::hasColumn('messages', 'seen')) {
            $insertData['seen'] = $messageData['seen'] ?? 0;
        }
        
        if (Schema::hasColumn('messages', 'is_read')) {
            $insertData['is_read'] = $messageData['seen'] ?? 0;
        }
        
        // Insert the message
        DB::table('messages')->insert($insertData);
        
        return $messageData;
    }
    
    private function markMessagesAsSeen($fromId, $toId)
    {
        // If the messages table doesn't exist, do nothing
        if (!$this->checkMessagesTable()) {
            return;
        }
        
        if (Schema::hasColumn('messages', 'from_id')) {
            // New schema
            DB::table('messages')
                ->where('from_id', $fromId)
                ->where('to_id', $toId)
                ->where('seen', 0)
                ->update(['seen' => 1]);
        } else {
            // Standard schema
            DB::table('messages')
                ->where('sender_id', $fromId)
                ->where('receiver_id', $toId)
                ->where('is_read', 0)
                ->update(['is_read' => 1]);
        }
    }
    
    private function countUnreadMessages($userId)
    {
        // If the messages table doesn't exist, return 0
        if (!$this->checkMessagesTable()) {
            return 0;
        }
        
        if (Schema::hasColumn('messages', 'to_id')) {
            // New schema
            return DB::table('messages')
                ->where('to_id', $userId)
                ->where('seen', 0)
                ->count();
        } else {
            // Standard schema
            return DB::table('messages')
                ->where('receiver_id', $userId)
                ->where('is_read', 0)
                ->count();
        }
    }
    
    private function checkMessagesTable()
    {
        return Schema::hasTable('messages');
    }
    
    private function createMessagesTableIfNotExists()
    {
        if (!Schema::hasTable('messages')) {
            Schema::create('messages', function ($table) {
                $table->id();
                $table->bigInteger('from_id');
                $table->bigInteger('to_id');
                $table->text('body')->nullable();
                $table->boolean('seen')->default(false);
                $table->timestamps();
                
                // Add indexes for performance
                $table->index('from_id');
                $table->index('to_id');
                $table->index(['from_id', 'to_id']);
                $table->index(['to_id', 'from_id']);
            });
            
            Log::info("Created 'messages' table on-the-fly");
        }
    }
} 