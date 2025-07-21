<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Event as Seminar;
use App\Models\Registration;
use App\Models\CheckIn;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class AnalyticsController extends Controller
{
    /**
     * Display analytics dashboard.
     */
    public function index(Request $request)
    {
        // Basic statistics
        $totalEvents = Seminar::count();
        $totalRegistrations = Registration::count();
        $totalCheckIns = CheckIn::count();
        $attendanceRate = $totalRegistrations > 0 ? round(($totalCheckIns / $totalRegistrations) * 100, 1) : 0;

        // Recent activity trends (last 30 days)
        $recentRegistrations = $this->getRecentActivityData('registrations');
        $recentCheckIns = $this->getRecentActivityData('check_ins');

        // Event performance
        $eventPerformance = Seminar::withCount(['registrations', 'checkIns'])
            ->orderBy('registrations_count', 'desc')
            ->take(10)
            ->get()
            ->map(function ($event) {
                return [
                    'title' => $event->title,
                    'registrations' => $event->registrations_count,
                    'check_ins' => $event->check_ins_count,
                    'attendance_rate' => $event->registrations_count > 0 
                        ? round(($event->check_ins_count / $event->registrations_count) * 100, 1)
                        : 0,
                ];
            });

        // Monthly overview
        $monthlyOverview = $this->getMonthlyOverview();

        return Inertia::render('Admin/Analytics/Index', [
            'statistics' => [
                'total_events' => $totalEvents,
                'total_registrations' => $totalRegistrations,
                'total_check_ins' => $totalCheckIns,
                'attendance_rate' => $attendanceRate,
            ],
            'charts' => [
                'recent_registrations' => $recentRegistrations,
                'recent_check_ins' => $recentCheckIns,
                'event_performance' => $eventPerformance,
                'monthly_overview' => $monthlyOverview,
            ],
            // Advanced analytics features (commented for future implementation)
            /*
            'advanced_analytics' => [
                'user_demographics' => $this->getUserDemographics(),
                'peak_registration_times' => $this->getPeakRegistrationTimes(),
                'geographic_distribution' => $this->getGeographicDistribution(),
                'conversion_funnel' => $this->getConversionFunnel(),
                'cohort_analysis' => $this->getCohortAnalysis(),
            ],
            */
        ]);
    }

    /**
     * Get recent activity data for charts.
     */
    private function getRecentActivityData($type)
    {
        $days = collect();
        $model = $type === 'registrations' ? Registration::class : CheckIn::class;

        for ($i = 29; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i);
            $count = $model::whereDate('created_at', $date)->count();
            
            $days->push([
                'date' => $date->format('Y-m-d'),
                'count' => $count,
                'label' => $date->format('M j'),
            ]);
        }

        return $days;
    }

    /**
     * Get monthly overview data.
     */
    private function getMonthlyOverview()
    {
        $months = collect();

        for ($i = 11; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $startOfMonth = $date->startOfMonth()->copy();
            $endOfMonth = $date->endOfMonth()->copy();

            $registrations = Registration::whereBetween('created_at', [$startOfMonth, $endOfMonth])->count();
            $checkIns = CheckIn::whereBetween('created_at', [$startOfMonth, $endOfMonth])->count();

            $months->push([
                'month' => $date->format('M Y'),
                'registrations' => $registrations,
                'check_ins' => $checkIns,
                'attendance_rate' => $registrations > 0 ? round(($checkIns / $registrations) * 100, 1) : 0,
            ]);
        }

        return $months;
    }

    // Advanced analytics methods (commented for future implementation)
    /*
    private function getUserDemographics()
    {
        // TODO: Implement user demographics analysis
        // - Age distribution
        // - Gender breakdown
        // - Location analysis
        return [];
    }

    private function getPeakRegistrationTimes()
    {
        // TODO: Implement peak time analysis
        // - Hour of day analysis
        // - Day of week patterns
        // - Seasonal trends
        return [];
    }

    private function getGeographicDistribution()
    {
        // TODO: Implement geographic analysis
        // - Registration by city/region
        // - Distance from event location
        // - Regional preferences
        return [];
    }

    private function getConversionFunnel()
    {
        // TODO: Implement conversion funnel
        // - Event page views
        // - Registration starts
        // - Registration completions
        // - Check-in rates
        return [];
    }

    private function getCohortAnalysis()
    {
        // TODO: Implement cohort analysis
        // - First-time vs returning participants
        // - Multi-event attendance patterns
        // - Retention analysis
        return [];
    }
    */

    /**
     * Export analytics data.
     */
    public function export(Request $request)
    {
        // Export functionality (commented for future implementation)
        /*
        $request->validate([
            'type' => 'required|in:summary,detailed,custom',
            'format' => 'required|in:pdf,excel,csv',
            'date_range' => 'nullable|array',
        ]);

        switch ($request->type) {
            case 'summary':
                // TODO: Generate summary report
                break;
            case 'detailed':
                // TODO: Generate detailed analytics report
                break;
            case 'custom':
                // TODO: Generate custom report based on filters
                break;
        }

        // TODO: Implement report generation
        // return $this->generateReport($request->type, $request->format, $request->date_range);
        */

        return back()->withErrors(['message' => 'Analytics export functionality coming soon.']);
    }
}