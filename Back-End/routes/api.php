<?php

use App\Http\Controllers\AvisController;
use App\Http\Controllers\ConducteurController;
use App\Http\Controllers\TrajetController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ReservationController;
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
        Route::post('/reservations', [ReservationController::class, 'store']);
        Route::get('/reservations/{id}', [ReservationController::class, 'getPassageReservations']);
        Route::apiResource('avis', AvisController::class);

//        Route::apiResource('reservations', ReservationController::class);
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
    Route::patch('/reservations/{id}', [ReservationController::class, 'update']);
    Route::patch('/reservations/{id}/cancel', [ReservationController::class, 'cancel']);

    Route::get('/users', [UserController::class, 'index']);



    // User routes
    Route::get('/users/{id}', [UserController::class, 'show']);

    Route::get('/conducteur/user/{id}', [ConducteurController::class, 'getByUserId']);

    // Routes for reviews
//    Route::get('/avis/reservation/{reservationId}', [AvisController::class, 'getReviewByReservation']);

    // Chat and messaging routes
    Route::get('/chatify/getUnreadMessagesCount', 'App\Http\Controllers\Api\ChatController@getUnreadMessagesCount');
    Route::get('/chatify/contacts', 'App\Http\Controllers\Api\ChatController@getContacts');
    Route::get('/chatify/relevant-contacts', 'App\Http\Controllers\Api\ChatController@getRelevantContacts');
    Route::post('/chatify/fetchMessages', 'App\Http\Controllers\Api\ChatController@fetchMessages');
    Route::post('/chatify/sendMessage', 'App\Http\Controllers\Api\ChatController@sendMessage');
    Route::post('/chatify/makeSeen', 'App\Http\Controllers\Api\ChatController@makeSeen');
    Route::get('/chatify/authUser', 'App\Http\Controllers\Api\ChatController@getAuthUser');

    // Direct message fallback routes
    Route::post('/api/chatify/sendMessage', 'App\Http\Controllers\Api\ChatController@sendMessageDirect');
    Route::get('/api/chatify/directMessages/{userId}', 'App\Http\Controllers\Api\ChatController@getDirectMessages');

    // Driver-specific message routes
    Route::get('/api/chatify/driverMessages/{passengerId}', 'App\Http\Controllers\Api\ChatController@getDriverMessages');
    Route::post('/api/chatify/sendDriverMessage', 'App\Http\Controllers\Api\ChatController@sendDriverMessage');

    // Chat user routes
    Route::get('/users/chat/{id}', 'App\Http\Controllers\Api\ChatController@getUserById');
    Route::get('/users/{id}', [UserController::class, 'show']);
});

// Add a ping endpoint to check if the backend is accessible
Route::get('/ping', function () {
    return response()->json(['status' => 'ok']);
});



