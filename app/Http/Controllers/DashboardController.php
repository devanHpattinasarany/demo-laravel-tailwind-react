<?php

namespace App\Http\Controllers;

use App\Models\Event as Seminar;
use App\Models\Registration;
use App\Models\CheckIn;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // Get statistics
        $statistics = [
            'totalSeminars' => Seminar::count(),
            'activeSeminars' => Seminar::active()->count(),
            'totalRegistrations' => Registration::where('status', 'active')->count(),
            'totalCheckIns' => CheckIn::where('check_ins.status', 'checked_in')->count(),
        ];

        // Get upcoming seminars (next 30 days)
        $upcomingSeminars = Seminar::upcoming()
            ->where('date', '<=', now()->addDays(30))
            ->active()
            ->orderBy('date')
            ->limit(5)
            ->get()
            ->map(function ($seminar) {
                return [
                    'id' => $seminar->id,
                    'title' => $seminar->title,
                    'date' => $seminar->date->format('Y-m-d'),
                    'registration_count' => $seminar->registrations()->where('status', 'active')->count(),
                    'max_capacity' => $seminar->max_capacity,
                ];
            });

        // Get recent activities (registrations and check-ins)
        $recentRegistrations = Registration::with('event')
            ->where('status', 'active')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($registration) {
                return [
                    'id' => $registration->id,
                    'type' => 'registration',
                    'participant_name' => $registration->full_name,
                    'event_title' => $registration->event->title,
                    'created_at' => $registration->created_at->toISOString(),
                ];
            });

        $recentCheckIns = CheckIn::with(['registration.event'])
            ->where('check_ins.status', 'checked_in')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($checkIn) {
                return [
                    'id' => $checkIn->id,
                    'type' => 'checkin',
                    'participant_name' => $checkIn->registration->full_name,
                    'event_title' => $checkIn->registration->event->title,
                    'created_at' => $checkIn->created_at->toISOString(),
                ];
            });

        // Merge and sort recent activities
        $recentActivities = $recentRegistrations
            ->concat($recentCheckIns)
            ->sortByDesc('created_at')
            ->take(10)
            ->values();

        return Inertia::render('dashboard', [
            'statistics' => $statistics,
            'recentActivities' => $recentActivities,
            'upcomingSeminars' => $upcomingSeminars,
        ]);
    }
}