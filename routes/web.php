<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\SeminarController;
use App\Http\Controllers\RegistrationController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Admin\SeminarController as AdminSeminarController;
use App\Http\Controllers\Admin\CheckInController;
use App\Http\Controllers\Admin\RegistrationController as AdminRegistrationController;
use App\Http\Controllers\Admin\AnalyticsController;
use App\Http\Controllers\Admin\ReportsController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [HomeController::class, 'index'])->name('home');

// Seminar routes
Route::get('/seminars/{seminar}', [SeminarController::class, 'show'])->name('seminars.show');

// Registration routes
Route::post('/seminars/{seminar}/register', [RegistrationController::class, 'store'])->name('seminars.register');
Route::get('/registrations/{registration}', [RegistrationController::class, 'show'])->name('registrations.show');
Route::get('/registrations/{registration}/pdf', [RegistrationController::class, 'downloadPdf'])->name('registrations.pdf');

Route::middleware(['auth', 'verified', 'admin'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Admin Seminar Management
    Route::prefix('admin')->name('admin.')->group(function () {
        Route::resource('seminars', AdminSeminarController::class);
        Route::get('/seminars/{seminar}/registrations', [AdminSeminarController::class, 'registrations'])->name('seminars.registrations');
        
        // Registration Management
        Route::prefix('registrations')->name('registrations.')->group(function () {
            Route::get('/', [AdminRegistrationController::class, 'index'])->name('index');
            Route::get('/{registration}', [AdminRegistrationController::class, 'show'])->name('show');
            Route::delete('/{registration}', [AdminRegistrationController::class, 'destroy'])->name('destroy');
            Route::post('/bulk-action', [AdminRegistrationController::class, 'bulkAction'])->name('bulk-action');
        });
        
        // Check-in System
        Route::prefix('checkin')->name('checkin.')->group(function () {
            Route::get('/', [CheckInController::class, 'index'])->name('index');
            Route::get('/scanner', [CheckInController::class, 'scanner'])->name('scanner');
            Route::post('/search', [CheckInController::class, 'search'])->name('search');
            Route::post('/check-in', [CheckInController::class, 'checkIn'])->name('check-in');
            Route::post('/undo', [CheckInController::class, 'undo'])->name('undo');
            Route::get('/report/{seminar}', [CheckInController::class, 'report'])->name('report');
        });
        
        // Analytics
        Route::prefix('analytics')->name('analytics.')->group(function () {
            Route::get('/', [AnalyticsController::class, 'index'])->name('index');
            Route::post('/export', [AnalyticsController::class, 'export'])->name('export');
        });
        
        // Reports
        Route::prefix('reports')->name('reports.')->group(function () {
            Route::get('/', [ReportsController::class, 'index'])->name('index');
            Route::get('/seminar-summary', [ReportsController::class, 'seminarSummary'])->name('seminar-summary');
            Route::get('/registration-list', [ReportsController::class, 'registrationList'])->name('registration-list');
            Route::post('/export', [ReportsController::class, 'export'])->name('export');
        });
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
