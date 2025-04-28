<?php

use App\Http\Controllers\AvisController;
use App\Http\Controllers\ConducteurController;
use App\Http\Controllers\TrajetController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ChatController;


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/verify-email', [AuthController::class, 'verifyEmail']);


Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::put('/user/profile', [UserController::class, 'updateProfile']);

    // Routes pour les passagers
    Route::middleware('role:passager')->group(function () {
        Route::apiResource('reservations', ReservationController::class);
        Route::get('/Myreservations', [ReservationController::class, 'myReservations']);
        // Routes publiques (sans authentification)
        Route::get('/trajets', [TrajetController::class, 'index']);
        Route::get('/trajets/recherche', [TrajetController::class, 'search']);
        Route::get('/trajets/{id}', [TrajetController::class, 'show']);

    });

    // Routes pour les conducteurs
    Route::middleware('role:conducteur')->group(function () {
        Route::apiResource('trajets', TrajetController::class)->except(['index', 'show']);
        Route::get('/conducteur/trajets/{conducteurId}', [TrajetController::class, 'getTrajetsByConducteur']);
        Route::patch('/trajets/{id}/cancel', [TrajetController::class, 'cancel']);
        Route::patch('/trajets/{id}/en_cours', [TrajetController::class, 'en_cours']);
        Route::patch('/trajets/{id}/termine', [TrajetController::class, 'termine']);
    });

    // Routes pour les administrateurs
    Route::middleware('role:admin')->group(function () {
        Route::get('/admin/dashboard', [DashboardController::class, 'index']);
        Route::get('/admin/users', [UserController::class, 'index']);
        Route::get('/admin/trajets', [TrajetController::class, 'index']);
        Route::get('/admin/reservations', [ReservationController::class, 'index']);
    });

    // Routes communes
    Route::post('/messages', [MessageController::class, 'send']);
    Route::apiResource('avis', AvisController::class);

    // Chat routes
    Route::post('/chat/send', [ChatController::class, 'sendMessage']);
    Route::get('/chat/messages/{userId}', [ChatController::class, 'getMessages']);
    Route::patch('/chat/messages/{messageId}/read', [ChatController::class, 'markAsRead']);

    Route::get('/conducteur/user/{id}', [ConducteurController::class, 'getByUserId']);
});
