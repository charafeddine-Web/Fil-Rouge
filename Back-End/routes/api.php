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
use App\Http\Controllers\ChatController;
use App\Http\Controllers\AdminController;


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
        Route::get('/conducteur/reservations', [ReservationController::class, 'getConducteurReservations']);
    });

    // Routes pour les administrateurs
    Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
        // Dashboard
        Route::get('/admin/dashboard', [AdminController::class, 'getDashboardStats']);
        Route::get('/admin/analytics', [AdminController::class, 'getAnalytics']);
        Route::get('/admin/dashboard/activities', [AdminController::class, 'getRecentActivities']);
        Route::get('/admin/dashboard/revenue', [AdminController::class, 'getRevenueStats']);

        // User Management
        Route::get('/admin/users', [AdminController::class, 'getUsers']);
        Route::patch('/admin/users/{id}/status', [AdminController::class, 'updateUserStatus']);

        // Driver Management
        Route::get('/admin/drivers', [AdminController::class, 'getDrivers']);
//        Route::patch('/admin/drivers/{id}/status', [AdminController::class, 'updateDriverStatus']);

        // Ride Management
        Route::get('/admin/rides', [AdminController::class, 'getRides']);
        Route::patch('/admin/rides/{id}/status', [AdminController::class, 'updateRideStatus']);

        // Reservation Management
        Route::get('/admin/reservations', [AdminController::class, 'getReservations']);

        // Complaints Management
        Route::get('/admin/complaints', [AdminController::class, 'getComplaints']);
        Route::patch('/admin/complaints/{id}/status', [AdminController::class, 'updateComplaintStatus']);

        // Payment Management
        Route::get('/admin/payments', [AdminController::class, 'getPayments']);
        Route::get('/admin/payments/stats', [AdminController::class, 'getPaymentStats']);
    });

    // Routes communes
    Route::post('/messages', [MessageController::class, 'send']);
    Route::apiResource('avis', AvisController::class);
    Route::get('/users', [UserController::class, 'index']);

    // Chat routes
    Route::post('/chat/send', [ChatController::class, 'sendMessage']);
    Route::get('/chat/messages/{userId}', [ChatController::class, 'getMessages']);
    Route::get('/chat/messages/all', [ChatController::class, 'getAllMessages']);
    Route::patch('/chat/messages/{messageId}/read', [ChatController::class, 'markAsRead']);

    // User routes
    Route::get('/users/{id}', [UserController::class, 'show']);

    Route::get('/conducteur/user/{id}', [ConducteurController::class, 'getByUserId']);
});
