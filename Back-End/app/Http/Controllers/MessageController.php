<?php

namespace App\Http\Controllers;

use App\Events\MessageSent;
use App\Models\Message;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function send(Request $request)
    {
        $validated = $request->validate([
            'passager_id' => 'required|exists:users,id',
            'conducteur_id' => 'required|exists:conducteurs,id',
            'contenu' => 'required|string'
        ]);

        $message = Message::create([
            'passager_id' => $validated['passager_id'],
            'conducteur_id' => $validated['conducteur_id'],
            'contenu' => $validated['contenu'],
            'lu' => false
        ]);

        broadcast(new MessageSent($message))->toOthers();

        return response()->json([
            'status' => 'Message envoyé',
            'data' => $message
        ], 201);
    }
}
