<?php

use App\Http\Controllers\AvisController;
use App\Http\Controllers\TrajetController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ReservationController;


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::put('/user/profile', [UserController::class, 'updateProfile']);
    Route::post('/verify-email', [AuthController::class, 'verifyEmail']);

    Route::apiResource('reservations', ReservationController::class);
    Route::apiResource('trajets', TrajetController::class);
    Route::apiResource('avis', AvisController::class);


});
