<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\KunjunganController;
use App\Http\Controllers\TipsKesehatanController;
use App\Http\Controllers\ObatController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\InventarisController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


// AUTH

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/email/verification-notification-public', [AuthController::class, 'resendVerificationPublic']);


// DATA PENGGUNA

Route::get('/tips', [TipsKesehatanController::class, 'index']);

Route::get('/events', [EventController::class, 'index']);

Route::get('/obat', [ObatController::class, 'index']);

Route::get('/inventaris', [InventarisController::class, 'index']);


// VERIFIKASI EMAIL

Route::get('/email/verify/{id}/{hash}', function (
    Request $request,
    $id,
    $hash
) {
    $user = \App\Models\User::findOrFail($id);

    // Cek hash email
    if (!hash_equals(
        (string) $hash,
        sha1($user->getEmailForVerification())
    )) {
        return response()->json([
            'message' => 'Link verifikasi email tidak valid.',
        ], 403);
    }

    // Kalau email sudah diverifikasi
    if ($user->hasVerifiedEmail()) {
        return response()->json([
            'message' => 'Email sudah diverifikasi sebelumnya.',
            'user' => $user->fresh()->load('role'),
        ]);
    }

    // Tandai email sebagai terverifikasi
    $user->markEmailAsVerified();

    return response()->json([
        'message' => 'Email berhasil diverifikasi.',
        'user' => $user->fresh()->load('role'),
    ]);

})->middleware('signed')->name('verification.verify');


// ROUTE YANG MEMBUTUHKAN LOGIN

Route::middleware('auth:sanctum')->group(function () {

    // AUTH

    Route::post('/logout', [AuthController::class, 'logout']);


    // USER

    Route::get('/user', function (Request $request) {
        return response()->json([
            'user' => $request->user()->fresh()->load('role'),
        ]);
    });


    // RESEND EMAIL VERIFIKASI

    Route::post(
        '/email/verification-notification',
        [AuthController::class, 'resendVerification']
    );


    // KUNJUNGAN UKS

    Route::post('/kunjungan', [KunjunganController::class, 'store']);

    Route::get('/kunjungan', [KunjunganController::class, 'index']);


    // KUNJUNGAN ADMIN

    Route::get(
        '/admin/kunjungan',
        [KunjunganController::class, 'adminIndex']
    );

    Route::put(
        '/admin/kunjungan/{id}',
        [KunjunganController::class, 'update']
    );


    // TIPS KESEHATAN ADMIN

    Route::post(
        '/admin/tips',
        [TipsKesehatanController::class, 'store']
    );

    Route::put(
        '/admin/tips/{id}',
        [TipsKesehatanController::class, 'update']
    );

    Route::delete(
        '/admin/tips/{id}',
        [TipsKesehatanController::class, 'destroy']
    );


    // EVENT ADMIN

    Route::post(
        '/admin/events',
        [EventController::class, 'store']
    );

    Route::put(
        '/admin/events/{id}',
        [EventController::class, 'update']
    );

    Route::delete(
        '/admin/events/{id}',
        [EventController::class, 'destroy']
    );


    // OBAT ADMIN

    Route::post(
        '/admin/obat',
        [ObatController::class, 'store']
    );

    Route::put(
        '/admin/obat/{id}',
        [ObatController::class, 'update']
    );

    Route::delete(
        '/admin/obat/{id}',
        [ObatController::class, 'destroy']
    );


    // INVENTARIS ADMIN

    Route::post(
        '/admin/inventaris',
        [InventarisController::class, 'store']
    );

    Route::put(
        '/admin/inventaris/{id}',
        [InventarisController::class, 'update']
    );

    Route::delete(
        '/admin/inventaris/{id}',
        [InventarisController::class, 'destroy']
    );


    // DASHBOARD ADMIN

    Route::get(
        '/admin/dashboard',
        [DashboardController::class, 'index']
    );


    // MANAJEMEN USER ADMIN

    Route::get(
        '/admin/users',
        [UserController::class, 'index']
    );

    Route::get(
        '/admin/users/{id}',
        [UserController::class, 'show']
    );

    Route::put(
        '/admin/users/{id}/role',
        [UserController::class, 'updateRole']
    );


    // PROFIL PENGGUNA

    Route::put(
        '/user/profile',
        [AuthController::class, 'updateProfile']
    );

    Route::post(
        '/user/foto',
        [AuthController::class, 'uploadFoto']
    );

    Route::delete(
        '/user/foto',
        [AuthController::class, 'deleteFoto']
    );

});
