<?php

use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

// Chat channel authorization
// Format: chat.1.2 (where 1 and 2 are the user IDs, sorted numerically)
Broadcast::channel('chat.{user1}.{user2}', function ($user, $user1, $user2) {
    // Check if the authenticated user is one of the participants
    $userId = (int) $user->id;
    return ($userId === (int) $user1 || $userId === (int) $user2);
});

// User channel for message notifications
Broadcast::channel('user.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});
