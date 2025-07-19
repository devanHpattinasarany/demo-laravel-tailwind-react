<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\RegistrationController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [HomeController::class, 'index'])->name('home');

// Event routes
Route::get('/events/{event}', [EventController::class, 'show'])->name('events.show');

// Registration routes
Route::post('/events/{event}/register', [RegistrationController::class, 'store'])->name('events.register');
Route::get('/registrations/{registration}', [RegistrationController::class, 'show'])->name('registrations.show');
Route::get('/registrations/{registration}/pdf', [RegistrationController::class, 'downloadPdf'])->name('registrations.pdf');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
