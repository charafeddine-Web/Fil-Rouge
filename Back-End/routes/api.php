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


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/verify-email', [AuthController::class, 'verifyEmail']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::put('/user/profile', [UserController::class, 'updateProfile']);

    Route::get('/trajets/recherche', [TrajetController::class, 'search']);

    Route::apiResource('reservations', ReservationController::class);
    Route::apiResource('trajets', TrajetController::class);
    Route::apiResource('avis', AvisController::class);

    Route::post('/messages', [MessageController::class, 'send']);

    Route::get('/conducteur/trajets/{conducteurId}', [TrajetController::class, 'getTrajetsByConducteur']);
    Route::get('/conducteur/user/{id}', [ConducteurController::class, 'getByUserId']);

});
