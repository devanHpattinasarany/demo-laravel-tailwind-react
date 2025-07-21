<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Event as Seminar;
use App\Models\Registration;
use App\Models\CheckIn;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class CheckInController extends Controller
{
    public function index(Request $request)
    {
        $query = Seminar::query()->with(['registrations']);

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        // Filter by date
        if ($request->filled('date')) {
            $query->whereDate('date', $request->input('date'));
        } else {
            // Default to today's events
            $query->whereDate('date', Carbon::today());
        }

        $seminars = $query->orderBy('date', 'asc')
            ->orderBy('time', 'asc')
            ->get()
            ->map(function ($seminar) {
                return [
                    'id' => $seminar->id,
                    'title' => $seminar->title,
                    'event_code' => $seminar->event_code,
                    'date' => $seminar->date->format('Y-m-d'),
                    'time' => $seminar->time?->format('H:i'),
                    'location' => $seminar->location,
                    'status' => $seminar->status,
                    'registration_count' => $seminar->registration_count,
                    'check_in_count' => $seminar->check_in_count,
                    'attendance_rate' => $seminar->registration_count > 0 
                        ? round(($seminar->check_in_count / $seminar->registration_count) * 100, 1)
                        : 0,
                ];
            });

        // Get overall statistics
        $statistics = [
            'total_events_today' => Seminar::whereDate('date', Carbon::today())->count(),
            'total_registrations_today' => Registration::whereHas('event', function($q) {
                $q->whereDate('date', Carbon::today());
            })->active()->count(),
            'total_checkins_today' => CheckIn::whereHas('registration.event', function($q) {
                $q->whereDate('date', Carbon::today());
            })->checkedIn()->count(),
        ];

        return Inertia::render('Admin/CheckIn/Index', [
            'events' => $seminars,
            'filters' => $request->only(['status', 'date']),
            'statistics' => $statistics,
        ]);
    }

    public function scanner(Request $request)
    {
        $selectedEventId = $request->get('event');
        $seminars = Seminar::active()
            ->orderBy('date', 'asc')
            ->get()
            ->map(function ($seminar) {
                return [
                    'id' => $seminar->id,
                    'title' => $seminar->title,
                    'event_code' => $seminar->event_code,
                    'date' => $seminar->date->format('Y-m-d'),
                    'time' => $seminar->time?->format('H:i'),
                ];
            });

        $selectedEvent = null;
        if ($selectedEventId) {
            $selectedEvent = Seminar::with(['registrations.checkIn'])
                ->find($selectedEventId);
            
            if ($selectedEvent) {
                $selectedEvent = [
                    'id' => $selectedEvent->id,
                    'title' => $selectedEvent->title,
                    'event_code' => $selectedEvent->event_code,
                    'date' => $selectedEvent->date->format('Y-m-d'),
                    'time' => $selectedEvent->time?->format('H:i'),
                    'location' => $selectedEvent->location,
                    'registration_count' => $selectedEvent->registration_count,
                    'check_in_count' => $selectedEvent->check_in_count,
                ];
            }
        }

        return Inertia::render('Admin/CheckIn/Scanner', [
            'events' => $seminars,
            'selectedEvent' => $selectedEvent,
        ]);
    }

    public function search(Request $request)
    {
        $request->validate([
            'query' => 'required|string|min:2',
            'event_id' => 'nullable|exists:events,id'
        ]);

        $query = Registration::query()
            ->with(['event', 'checkIn'])
            ->active();

        // Filter by event if specified
        if ($request->filled('event_id')) {
            $query->where('event_id', $request->input('event_id'));
        }

        // Search by ticket number, name, NIK, phone, or email
        $searchTerm = $request->input('query');
        $registrations = $query->where(function ($q) use ($searchTerm) {
            $q->where('ticket_number', 'like', "%{$searchTerm}%")
              ->orWhere('full_name', 'like', "%{$searchTerm}%")
              ->orWhere('nik', 'like', "%{$searchTerm}%")
              ->orWhere('phone', 'like', "%{$searchTerm}%")
              ->orWhere('email', 'like', "%{$searchTerm}%");
        })
        ->limit(10)
        ->get()
        ->map(function ($registration) {
            return [
                'id' => $registration->id,
                'ticket_number' => $registration->ticket_number,
                'full_name' => $registration->full_name,
                'nik' => $registration->nik,
                'phone' => $registration->phone,
                'email' => $registration->email,
                'event_title' => $registration->event->title,
                'event_code' => $registration->event->event_code,
                'event_date' => $registration->event->date->format('Y-m-d'),
                'event_time' => $registration->event->time?->format('H:i'),
                'is_checked_in' => $registration->isCheckedIn(),
                'check_in_time' => $registration->checkIn?->check_in_time?->format('Y-m-d H:i:s'),
                'registration_date' => ($registration->registration_date ?? $registration->created_at)->format('Y-m-d H:i:s'),
            ];
        });

        return response()->json([
            'registrations' => $registrations,
            'query' => $searchTerm,
        ]);
    }

    public function checkIn(Request $request)
    {
        $request->validate([
            'registration_id' => 'required|exists:registrations,id',
        ]);

        $registration = Registration::with(['event', 'checkIn'])->find($request->input('registration_id'));

        // Check if registration is active
        if ($registration->status !== 'active') {
            return response()->json([
                'success' => false,
                'message' => 'Registrasi tidak valid atau sudah dibatalkan.',
            ], 400);
        }

        // Check if already checked in
        if ($registration->isCheckedIn()) {
            return response()->json([
                'success' => false,
                'message' => 'Peserta sudah melakukan check-in sebelumnya.',
                'check_in_time' => $registration->checkIn->check_in_time->format('Y-m-d H:i:s'),
            ], 400);
        }

        // Create check-in record
        $checkIn = CheckIn::create([
            'registration_id' => $registration->id,
            'check_in_time' => now(),
            'admin_user_id' => auth()->id(),
            'status' => 'checked_in',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Check-in berhasil!',
            'data' => [
                'registration_id' => $registration->id,
                'participant_name' => $registration->full_name,
                'ticket_number' => $registration->ticket_number,
                'event_title' => $registration->event->title,
                'check_in_time' => $checkIn->check_in_time->format('Y-m-d H:i:s'),
            ],
        ]);
    }

    public function undo(Request $request)
    {
        $request->validate([
            'registration_id' => 'required|exists:registrations,id',
        ]);

        $registration = Registration::with(['checkIn'])->find($request->input('registration_id'));

        // Check if checked in
        if (!$registration->isCheckedIn()) {
            return response()->json([
                'success' => false,
                'message' => 'Peserta belum melakukan check-in.',
            ], 400);
        }

        // Delete check-in record
        $registration->checkIn->delete();

        return response()->json([
            'success' => true,
            'message' => 'Check-in berhasil dibatalkan.',
            'data' => [
                'registration_id' => $registration->id,
                'participant_name' => $registration->full_name,
                'ticket_number' => $registration->ticket_number,
            ],
        ]);
    }

    public function report(Request $request, Seminar $seminar)
    {
        $registrations = $seminar->registrations()
            ->with(['checkIn'])
            ->active()
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($registration) {
                return [
                    'id' => $registration->id,
                    'ticket_number' => $registration->ticket_number,
                    'full_name' => $registration->full_name,
                    'nik' => $registration->nik,
                    'phone' => $registration->phone,
                    'email' => $registration->email,
                    'is_checked_in' => $registration->isCheckedIn(),
                    'check_in_time' => $registration->checkIn?->check_in_time?->format('Y-m-d H:i:s'),
                    'registration_date' => ($registration->registration_date ?? $registration->created_at)->format('Y-m-d H:i:s'),
                ];
            });

        $statistics = [
            'total_registrations' => $registrations->count(),
            'checked_in' => $registrations->where('is_checked_in', true)->count(),
            'not_checked_in' => $registrations->where('is_checked_in', false)->count(),
            'attendance_rate' => $registrations->count() > 0 
                ? round(($registrations->where('is_checked_in', true)->count() / $registrations->count()) * 100, 1)
                : 0,
        ];

        return Inertia::render('Admin/CheckIn/Report', [
            'event' => [
                'id' => $seminar->id,
                'title' => $seminar->title,
                'event_code' => $seminar->event_code,
                'date' => $seminar->date->format('Y-m-d'),
                'time' => $seminar->time?->format('H:i'),
                'location' => $seminar->location,
            ],
            'registrations' => $registrations,
            'statistics' => $statistics,
        ]);
    }
}