<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\GuruController;
use App\Http\Controllers\BookingController;

// Public routes
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login',    [AuthController::class, 'login']);

// Guru public
Route::get('/guru',           [GuruController::class, 'index']);
Route::get('/guru/{id}',      [GuruController::class, 'show']);
Route::get('/guru/{id}/booked-slots', [GuruController::class, 'bookedSlots']);
Route::post('/guru/{id}/dokumen', [GuruController::class, 'uploadDokumen']);

// Protected routes (butuh login)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me',      [AuthController::class, 'me']);
    Route::post('/booking',     [BookingController::class, 'store']);
    Route::get('/booking',      [BookingController::class, 'index']);
});
