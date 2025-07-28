<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

// Game channels
Broadcast::channel('game-world', function ($user) {
    // Allow all authenticated users to join the game world channel
    return $user ? ['id' => $user->id, 'name' => $user->name] : false;
});

Broadcast::channel('player.{playerId}', function ($user, $playerId) {
    // Allow users to join their own player channel
    return $user && (int) $user->id === (int) $playerId;
});

Broadcast::channel('game-chat', function ($user) {
    // Allow all authenticated users to join game chat
    return $user ? ['id' => $user->id, 'name' => $user->name] : false;
});

// Public game channels that don't require authentication
Broadcast::channel('game-public', function () {
    return true; // Allow anyone to join public game events
});
