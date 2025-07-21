<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Event as Seminar;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class SeminarController extends Controller
{
    public function index(Request $request)
    {
        $query = Seminar::query()->with(['registrations']);

        // Search functionality
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', '%' . $request->search . '%')
                  ->orWhere('event_code', 'like', '%' . $request->search . '%')
                  ->orWhere('location', 'like', '%' . $request->search . '%');
            });
        }

        // Status filter
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Date filter
        if ($request->filled('date_from')) {
            $query->where('date', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->where('date', '<=', $request->date_to);
        }

        $seminars = $query->orderBy('date', 'desc')
            ->paginate(10)
            ->withQueryString();
            
        // Transform the seminars data while preserving pagination structure
        $seminars->getCollection()->transform(function ($seminar) {
            return [
                'id' => $seminar->id,
                'title' => $seminar->title,
                'event_code' => $seminar->event_code,
                'date' => $seminar->date->format('Y-m-d'),
                'time' => $seminar->time?->format('H:i'),
                'location' => $seminar->location,
                'status' => $seminar->status,
                'max_capacity' => $seminar->max_capacity,
                'registration_count' => $seminar->registration_count,
                'available_slots' => $seminar->getAvailableSlots(),
                'speakers' => $seminar->speakers,
            ];
        });

        return Inertia::render('Admin/Seminars/Index', [
            'seminars' => $seminars,
            'filters' => $request->only(['search', 'status', 'date_from', 'date_to']),
            'statistics' => [
                'total' => Seminar::count(),
                'active' => Seminar::active()->count(),
                'upcoming' => Seminar::upcoming()->count(),
                'past' => Seminar::past()->count(),
            ]
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Seminars/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'speakers' => 'required|string',
            'date' => 'required|date|after:today',
            'time' => 'required|date_format:H:i',
            'location' => 'required|string|max:255',
            'max_capacity' => 'required|integer|min:1|max:1000',
            'poster_url' => 'nullable|url',
            'status' => 'required|in:active,inactive',
        ]);

        // Generate seminar code from title
        $seminarCode = $this->generateSeminarCode($validated['title']);

        $seminar = Seminar::create([
            ...$validated,
            'event_code' => $seminarCode,
        ]);

        return redirect()->route('admin.seminars.index')
            ->with('success', 'Seminar berhasil dibuat!');
    }

    public function show(Seminar $seminar)
    {
        $seminar->load(['registrations.checkIn']);

        $seminarData = [
            'id' => $seminar->id,
            'title' => $seminar->title,
            'event_code' => $seminar->event_code,
            'description' => $seminar->description,
            'speakers' => $seminar->speakers,
            'date' => $seminar->date->format('Y-m-d'),
            'time' => $seminar->time?->format('H:i'),
            'location' => $seminar->location,
            'max_capacity' => $seminar->max_capacity,
            'poster_url' => $seminar->poster_url,
            'status' => $seminar->status,
            'registration_count' => $seminar->registration_count,
            'check_in_count' => $seminar->check_in_count,
            'available_slots' => $seminar->getAvailableSlots(),
            'created_at' => $seminar->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $seminar->updated_at->format('Y-m-d H:i:s'),
        ];

        $recentRegistrations = $seminar->registrations()
            ->with(['checkIn' => function($query) {
                $query->where('status', 'checked_in');
            }])
            ->active()
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($registration) {
                return [
                    'id' => $registration->id,
                    'full_name' => $registration->full_name,
                    'email' => $registration->email,
                    'phone' => $registration->phone,
                    'ticket_number' => $registration->ticket_number,
                    'status' => $registration->status,
                    'is_checked_in' => $registration->checkIn && $registration->checkIn->status === 'checked_in',
                    'check_in_time' => $registration->checkIn ? $registration->checkIn->check_in_time->format('Y-m-d H:i:s') : null,
                    'created_at' => $registration->created_at->format('Y-m-d H:i:s'),
                ];
            });

        return Inertia::render('Admin/Seminars/Show', [
            'seminar' => $seminarData,
            'recentRegistrations' => $recentRegistrations,
        ]);
    }

    public function edit(Seminar $seminar)
    {
        return Inertia::render('Admin/Seminars/Edit', [
            'seminar' => [
                'id' => $seminar->id,
                'title' => $seminar->title,
                'event_code' => $seminar->event_code,
                'description' => $seminar->description,
                'speakers' => $seminar->speakers,
                'date' => $seminar->date->format('Y-m-d'),
                'time' => $seminar->time?->format('H:i'),
                'location' => $seminar->location,
                'max_capacity' => $seminar->max_capacity,
                'poster_url' => $seminar->poster_url,
                'status' => $seminar->status,
            ]
        ]);
    }

    public function update(Request $request, Seminar $seminar)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'speakers' => 'required|string',
            'date' => 'required|date',
            'time' => 'required|date_format:H:i',
            'location' => 'required|string|max:255',
            'max_capacity' => 'required|integer|min:1|max:1000',
            'poster_url' => 'nullable|url',
            'status' => 'required|in:active,inactive',
        ]);

        // Validate capacity not less than current registrations
        if ($validated['max_capacity'] < $seminar->registration_count) {
            return back()->withErrors([
                'max_capacity' => 'Kapasitas tidak boleh kurang dari jumlah peserta terdaftar (' . $seminar->registration_count . ')'
            ]);
        }

        $seminar->update($validated);

        return redirect()->route('admin.seminars.show', $seminar)
            ->with('success', 'Seminar berhasil diperbarui!');
    }

    public function destroy(Seminar $seminar)
    {
        // Check if seminar has registrations
        if ($seminar->registrations()->exists()) {
            return back()->withErrors([
                'delete' => 'Seminar tidak dapat dihapus karena sudah memiliki peserta terdaftar.'
            ]);
        }

        $seminar->delete();

        return redirect()->route('admin.seminars.index')
            ->with('success', 'Seminar berhasil dihapus!');
    }

    public function registrations(Request $request, Seminar $seminar)
    {
        $query = $seminar->registrations()->with(['checkIn']);

        // Search functionality
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('full_name', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%')
                  ->orWhere('nik', 'like', '%' . $request->search . '%')
                  ->orWhere('ticket_number', 'like', '%' . $request->search . '%');
            });
        }

        // Status filter
        if ($request->filled('status')) {
            if ($request->status === 'checked_in') {
                $query->whereHas('checkIn');
            } elseif ($request->status === 'not_checked_in') {
                $query->whereDoesntHave('checkIn');
            }
        }

        $registrations = $query->orderBy('created_at', 'desc')
            ->paginate(20)
            ->withQueryString();

        // Transform registrations data
        $registrations->getCollection()->transform(function ($registration) use ($seminar) {
            return [
                'id' => $registration->id,
                'full_name' => $registration->full_name,
                'email' => $registration->email,
                'phone' => $registration->phone,
                'nik' => $registration->nik,
                'ticket_number' => $registration->ticket_number,
                'created_at' => $registration->created_at->format('Y-m-d H:i:s'),
                'is_checked_in' => $registration->checkIn && $registration->checkIn->status === 'checked_in',
                'check_in_time' => $registration->checkIn ? $registration->checkIn->check_in_time->format('Y-m-d H:i:s') : null,
            ];
        });

        return Inertia::render('Admin/Seminars/Participants', [
            'seminar' => [
                'id' => $seminar->id,
                'title' => $seminar->title,
                'event_code' => $seminar->event_code,
                'date' => $seminar->date->format('Y-m-d'),
                'time' => $seminar->time?->format('H:i'),
                'location' => $seminar->location,
                'max_capacity' => $seminar->max_capacity,
                'registration_count' => $seminar->registration_count,
                'check_in_count' => $seminar->check_in_count,
                'available_slots' => $seminar->getAvailableSlots(),
            ],
            'registrations' => $registrations,
            'filters' => $request->only(['search', 'status']),
            'statistics' => [
                'total_registrations' => $seminar->registration_count,
                'checked_in' => $seminar->check_in_count,
                'not_checked_in' => $seminar->registration_count - $seminar->check_in_count,
                'attendance_rate' => $seminar->registration_count > 0 
                    ? round(($seminar->check_in_count / $seminar->registration_count) * 100, 1)
                    : 0,
            ]
        ]);
    }

    private function generateSeminarCode(string $title): string
    {
        // Convert title to code (e.g., "Seminar Financial" -> "SF"
        $words = explode(' ', $title);
        $code = '';
        
        foreach ($words as $word) {
            if (strlen($word) > 0) {
                $code .= strtoupper($word[0]);
            }
        }
        
        // Ensure code is at least 2 characters and at most 4
        $code = substr($code, 0, 4);
        if (strlen($code) < 2) {
            $code = strtoupper(substr($title, 0, 2));
        }
        
        // Check if code already exists and append number if needed
        $baseCode = $code;
        $counter = 1;
        
        while (Seminar::where('event_code', $code)->exists()) {
            $code = $baseCode . $counter;
            $counter++;
        }
        
        return $code;
    }
}