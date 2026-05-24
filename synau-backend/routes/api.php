<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\GuruController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\FavoritController;
use App\Http\Controllers\RegisterGuruController;
use App\Http\Controllers\GajiController;
use App\Http\Controllers\PembayaranController;
use App\Http\Controllers\SiswaController;
use App\Http\Controllers\VerifikasiGuruController;
use App\Http\Controllers\GuruAdminController;
use App\Http\Controllers\KelasJadwalController;
use App\Http\Controllers\LaporanController;
use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\AdminOverviewController;


// Public routes
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login',    [AuthController::class, 'login']);

// Guru public
Route::get('/guru',           [GuruController::class, 'index']);
Route::get('/guru/{id}',      [GuruController::class, 'show']);
Route::get('/guru/{id}/booked-slots', [GuruController::class, 'bookedSlots']);
Route::post('/guru/{id}/dokumen', [GuruController::class, 'uploadDokumen']);

Route::post('/auth/register-guru', [RegisterGuruController::class, 'register']);

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

Route::middleware(['auth:sanctum'])->prefix('admin')->group(function () {
    Route::get('/gaji', [GajiController::class, 'index']);
    Route::post('/gaji/bayar', [GajiController::class, 'bayar']);
    Route::get('/pembayaran', [PembayaranController::class, 'index']);
    Route::get('/siswa', [SiswaController::class, 'index']);
    Route::put('/siswa/{id}/toggle-status', [SiswaController::class, 'toggleStatus']);
    Route::get('/verifikasi-guru', [VerifikasiGuruController::class, 'index']);
    Route::post('/verifikasi-guru/{id}/approve', [VerifikasiGuruController::class, 'approve']);
    Route::post('/verifikasi-guru/{id}/reject', [VerifikasiGuruController::class, 'reject']);
    Route::get('/guru', [GuruAdminController::class, 'index']);
    Route::put('/guru/{id}/toggle-status', [GuruAdminController::class, 'toggleStatus']);
    Route::get('/kelas-jadwal', [KelasJadwalController::class, 'index']);
    Route::get('/laporan', [LaporanController::class, 'index']);
    Route::get('/dashboard', [AdminDashboardController::class, 'index']);
    Route::get('/overview', [AdminOverviewController::class, 'index']);
});
