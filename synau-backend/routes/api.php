<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\GuruController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\FavoritController;

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
    Route::get('/profile',           [ProfileController::class, 'show']);
    Route::put('/profile',           [ProfileController::class, 'update']);
    Route::put('/profile/password',  [ProfileController::class, 'updatePassword']);
    Route::post('/profile/foto',     [ProfileController::class, 'uploadFoto']);
    Route::get('/favorit',           [FavoritController::class, 'index']);
    Route::post('/favorit/{guruId}', [FavoritController::class, 'store']);
    Route::delete('/favorit/{guruId}', [FavoritController::class, 'destroy']);
});
