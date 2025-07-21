<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Registration;
use App\Models\Event;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RegistrationController extends Controller
{
    /**
     * Display a listing of registrations.
     */
    public function index(Request $request)
    {
        $query = Registration::with(['event'])
            ->latest();

        // Filter by event
        if ($request->filled('event_id')) {
            $query->where('event_id', $request->event_id);
        }

        // Filter by status
        if ($request->filled('status')) {
            if ($request->status === 'checked_in') {
                $query->whereHas('checkIn');
            } elseif ($request->status === 'not_checked_in') {
                $query->whereDoesntHave('checkIn');
            }
        }

        // Search by participant name, email, NIK
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('full_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('nik', 'like', "%{$search}%")
                  ->orWhere('ticket_number', 'like', "%{$search}%");
            });
        }

        $registrations = $query->paginate(20);

        // Get events for filter dropdown
        $events = Event::select('id', 'title', 'event_code')
            ->orderBy('date', 'desc')
            ->get();

        // Statistics
        $statistics = [
            'total_registrations' => Registration::count(),
            'total_checked_in' => Registration::whereHas('checkIn')->count(),
            'registrations_today' => Registration::whereDate('created_at', today())->count(),
            'check_ins_today' => Registration::whereHas('checkIn', function ($q) {
                $q->whereDate('created_at', today());
            })->count(),
        ];

        return Inertia::render('Admin/Registrations/Index', [
            'registrations' => $registrations,
            'events' => $events,
            'filters' => $request->only(['event_id', 'status', 'search']),
            'statistics' => $statistics,
        ]);
    }

    /**
     * Display the specified registration.
     */
    public function show(Registration $registration)
    {
        $registration->load(['event', 'checkIn']);

        return Inertia::render('Admin/Registrations/Show', [
            'registration' => $registration,
        ]);
    }

    /**
     * Remove the specified registration from storage.
     */
    public function destroy(Registration $registration)
    {
        // Only allow deletion if not checked in
        if ($registration->checkIn) {
            return back()->withErrors([
                'message' => 'Cannot delete registration that has already been checked in.'
            ]);
        }

        $registration->delete();

        return back()->with('success', 'Registration deleted successfully.');
    }

    /**
     * Bulk operations for registrations.
     */
    public function bulkAction(Request $request)
    {
        $request->validate([
            'action' => 'required|in:delete,export',
            'registration_ids' => 'required|array',
            'registration_ids.*' => 'exists:registrations,id',
        ]);

        if ($request->action === 'delete') {
            // Only delete registrations that haven't been checked in
            $deletableRegistrations = Registration::whereIn('id', $request->registration_ids)
                ->whereDoesntHave('checkIn')
                ->get();

            $deletableRegistrations->each->delete();

            $deletedCount = $deletableRegistrations->count();
            $totalSelected = count($request->registration_ids);

            if ($deletedCount === $totalSelected) {
                return back()->with('success', "Successfully deleted {$deletedCount} registrations.");
            } else {
                $skipped = $totalSelected - $deletedCount;
                return back()->with('warning', "Deleted {$deletedCount} registrations. Skipped {$skipped} registrations that were already checked in.");
            }
        }

        // Export functionality (commented for future implementation)
        /*
        if ($request->action === 'export') {
            $registrations = Registration::with(['event', 'checkIn'])
                ->whereIn('id', $request->registration_ids)
                ->get();

            // TODO: Implement CSV/Excel export
            // return Excel::download(new RegistrationsExport($registrations), 'registrations.xlsx');
        }
        */

        return back()->withErrors(['message' => 'Export functionality coming soon.']);
    }
}