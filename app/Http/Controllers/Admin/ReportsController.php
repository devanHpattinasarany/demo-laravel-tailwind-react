<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Event as Seminar;
use App\Models\Registration;
use App\Models\CheckIn;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class ReportsController extends Controller
{
    /**
     * Display reports dashboard.
     */
    public function index()
    {
        // Available report types
        $reportTypes = [
            [
                'id' => 'event_summary',
                'title' => 'Event Summary Report',
                'description' => 'Overview of all events with registration and attendance statistics',
                'icon' => 'Calendar',
                'available' => true,
            ],
            [
                'id' => 'registration_list',
                'title' => 'Registration List',
                'description' => 'Detailed list of all registrations with participant information',
                'icon' => 'Users',
                'available' => true,
            ],
            [
                'id' => 'attendance_report',
                'title' => 'Attendance Report',
                'description' => 'Check-in status and attendance analytics',
                'icon' => 'CheckSquare',
                'available' => true,
            ],
            // Advanced reports (commented for future implementation)
            /*
            [
                'id' => 'financial_summary',
                'title' => 'Financial Summary',
                'description' => 'Revenue and cost analysis (if applicable)',
                'icon' => 'DollarSign',
                'available' => false,
            ],
            [
                'id' => 'custom_report',
                'title' => 'Custom Report Builder',
                'description' => 'Build custom reports with specific filters and metrics',
                'icon' => 'Settings',
                'available' => false,
            ],
            */
        ];

        // Recent reports (placeholder for future implementation)
        $recentReports = [
            // TODO: Implement recent reports tracking
        ];

        // Quick stats for reports dashboard
        $quickStats = [
            'total_events' => Seminar::count(),
            'total_registrations' => Registration::count(),
            'total_check_ins' => CheckIn::count(),
            'reports_generated_today' => 0, // TODO: Track generated reports
        ];

        return Inertia::render('Admin/Reports/Index', [
            'reportTypes' => $reportTypes,
            'recentReports' => $recentReports,
            'quickStats' => $quickStats,
        ]);
    }

    /**
     * Generate event summary report.
     */
    public function seminarSummary(Request $request)
    {
        $request->validate([
            'date_from' => 'nullable|date',
            'date_to' => 'nullable|date',
            'event_ids' => 'nullable|array',
        ]);

        $query = Seminar::withCount(['registrations', 'checkIns']);

        // Apply date filters
        if ($request->filled('date_from')) {
            $query->where('date', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->where('date', '<=', $request->date_to);
        }

        // Apply event filters
        if ($request->filled('event_ids')) {
            $query->whereIn('id', $request->event_ids);
        }

        $events = $query->orderBy('date', 'desc')->get();

        $reportData = [
            'events' => $events->map(function ($event) {
                return [
                    'title' => $event->title,
                    'code' => $event->event_code,
                    'date' => $event->date,
                    'location' => $event->location,
                    'capacity' => $event->max_capacity,
                    'registrations' => $event->registrations_count,
                    'check_ins' => $event->check_ins_count,
                    'attendance_rate' => $event->registrations_count > 0 
                        ? round(($event->check_ins_count / $event->registrations_count) * 100, 1)
                        : 0,
                    'available_slots' => $event->max_capacity - $event->registrations_count,
                ];
            }),
            'summary' => [
                'total_events' => $events->count(),
                'total_registrations' => $events->sum('registrations_count'),
                'total_check_ins' => $events->sum('check_ins_count'),
                'average_attendance' => $events->avg(function ($event) {
                    return $event->registrations_count > 0 
                        ? ($event->check_ins_count / $event->registrations_count) * 100
                        : 0;
                }),
            ],
        ];

        return Inertia::render('Admin/Reports/EventSummary', [
            'reportData' => $reportData,
            'filters' => $request->only(['date_from', 'date_to', 'event_ids']),
            'events' => Seminar::select('id', 'title', 'event_code')->get(),
        ]);
    }

    /**
     * Generate registration list report.
     */
    public function registrationList(Request $request)
    {
        $request->validate([
            'event_id' => 'nullable|exists:events,id',
            'status' => 'nullable|in:all,checked_in,not_checked_in',
            'date_from' => 'nullable|date',
            'date_to' => 'nullable|date',
        ]);

        $query = Registration::with(['event', 'checkIn']);

        // Apply filters
        if ($request->filled('event_id')) {
            $query->where('event_id', $request->event_id);
        }

        if ($request->filled('status')) {
            if ($request->status === 'checked_in') {
                $query->whereHas('checkIn');
            } elseif ($request->status === 'not_checked_in') {
                $query->whereDoesntHave('checkIn');
            }
        }

        if ($request->filled('date_from')) {
            $query->where('created_at', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->where('created_at', '<=', $request->date_to . ' 23:59:59');
        }

        $registrations = $query->orderBy('created_at', 'desc')->get();

        return Inertia::render('Admin/Reports/RegistrationList', [
            'registrations' => $registrations,
            'filters' => $request->only(['event_id', 'status', 'date_from', 'date_to']),
            'events' => Seminar::select('id', 'title', 'event_code')->get(),
        ]);
    }

    /**
     * Export report data.
     */
    public function export(Request $request)
    {
        // Export functionality (commented for future implementation)
        /*
        $request->validate([
            'report_type' => 'required|in:event_summary,registration_list,attendance_report',
            'format' => 'required|in:pdf,excel,csv',
            'filters' => 'nullable|array',
        ]);

        switch ($request->report_type) {
            case 'event_summary':
                return $this->exportEventSummary($request->format, $request->filters);
            case 'registration_list':
                return $this->exportRegistrationList($request->format, $request->filters);
            case 'attendance_report':
                return $this->exportAttendanceReport($request->format, $request->filters);
        }
        */

        return back()->withErrors(['message' => 'Export functionality coming soon. Will support PDF, Excel, and CSV formats.']);
    }

    // Export helper methods (commented for future implementation)
    /*
    private function exportSeminarSummary($format, $filters)
    {
        // TODO: Implement event summary export
        switch ($format) {
            case 'pdf':
                // return PDF::loadView('reports.event-summary-pdf', $data)->download();
                break;
            case 'excel':
                // return Excel::download(new EventSummaryExport($filters), 'event-summary.xlsx');
                break;
            case 'csv':
                // return Excel::download(new EventSummaryExport($filters), 'event-summary.csv');
                break;
        }
    }

    private function exportRegistrationList($format, $filters)
    {
        // TODO: Implement registration list export
    }

    private function exportAttendanceReport($format, $filters)
    {
        // TODO: Implement attendance report export
    }
    */
}