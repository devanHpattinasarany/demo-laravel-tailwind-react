import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { 
    BarChart3, 
    TrendingUp, 
    Users, 
    Calendar,
    CheckSquare,
    Download,
    RefreshCw,
    Filter,
    Eye,
    ArrowUp,
    ArrowDown
} from 'lucide-react';
import { useState } from 'react';

interface ChartData {
    recent_registrations: Array<{
        date: string;
        count: number;
        label: string;
    }>;
    recent_check_ins: Array<{
        date: string;
        count: number;
        label: string;
    }>;
    event_performance: Array<{
        title: string;
        registrations: number;
        check_ins: number;
        attendance_rate: number;
    }>;
    monthly_overview: Array<{
        month: string;
        registrations: number;
        check_ins: number;
        attendance_rate: number;
    }>;
}

interface AnalyticsIndexProps {
    statistics: {
        total_events: number;
        total_registrations: number;
        total_check_ins: number;
        attendance_rate: number;
    };
    charts: ChartData;
    // Advanced analytics features (commented)
    /*
    advanced_analytics: {
        user_demographics: any;
        peak_registration_times: any;
        geographic_distribution: any;
        conversion_funnel: any;
        cohort_analysis: any;
    };
    */
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Analytics', href: '/admin/analytics' },
];

export default function AnalyticsIndex({ statistics, charts }: AnalyticsIndexProps) {
    const [activeChart, setActiveChart] = useState<'registrations' | 'check_ins'>('registrations');
    const [selectedTimeRange, setSelectedTimeRange] = useState('30d');

    // Calculate trends (simplified)
    const getRegistrationTrend = () => {
        const recent = charts.recent_registrations.slice(-7);
        const previous = charts.recent_registrations.slice(-14, -7);
        const recentAvg = recent.reduce((sum, item) => sum + item.count, 0) / recent.length;
        const previousAvg = previous.reduce((sum, item) => sum + item.count, 0) / previous.length;
        return recentAvg > previousAvg ? 'up' : 'down';
    };

    const getCheckInTrend = () => {
        const recent = charts.recent_check_ins.slice(-7);
        const previous = charts.recent_check_ins.slice(-14, -7);
        const recentAvg = recent.reduce((sum, item) => sum + item.count, 0) / recent.length;
        const previousAvg = previous.reduce((sum, item) => sum + item.count, 0) / previous.length;
        return recentAvg > previousAvg ? 'up' : 'down';
    };

    // Simple chart component (placeholder for future implementation)
    const SimpleLineChart = ({ data, color }: { data: any[], color: string }) => (
        <div className="h-32 bg-gray-50 rounded-lg flex items-end justify-center gap-1 p-4">
            {data.slice(-10).map((item, index) => (
                <div key={`chart-item-${index}-${item.date || item.label || Math.random()}`} className="flex flex-col items-center gap-1">
                    <div 
                        className={`w-4 ${color} rounded-t`}
                        style={{ height: `${Math.max((item.count || 0) * 2, 4)}px` }}
                    />
                    <span className="text-xs text-gray-500 rotate-45 origin-bottom-left">
                        {item.label}
                    </span>
                </div>
            ))}
        </div>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Analytics Dashboard - Festival Tahuri Admin" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4 sm:p-6 overflow-x-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent">
                            Analytics Dashboard
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Insight dan analisis data event Festival Tahuri
                        </p>
                    </div>
                    
                    <div className="flex gap-3">
                        <select
                            value={selectedTimeRange}
                            onChange={(e) => setSelectedTimeRange(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        >
                            <option value="7d">Last 7 days</option>
                            <option value="30d">Last 30 days</option>
                            <option value="90d">Last 90 days</option>
                            <option value="1y">Last year</option>
                        </select>
                        
                        {/* Advanced export functionality (commented) */}
                        {/*
                        <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2">
                            <Download className="w-4 h-4" />
                            Export Report
                        </button>
                        */}
                        
                        <button className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-lg transition-colors flex items-center gap-2">
                            <RefreshCw className="w-4 h-4" />
                            <span className="hidden sm:inline">Refresh</span>
                        </button>
                    </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl sm:rounded-2xl p-3 sm:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-700 font-medium text-xs sm:text-sm">Total Events</p>
                                <p className="text-xl sm:text-3xl font-bold text-blue-900">{statistics.total_events}</p>
                                <div className="flex items-center gap-1 mt-1">
                                    <TrendingUp className="w-3 h-3 text-green-600" />
                                    <span className="text-xs text-green-600">Active</span>
                                </div>
                            </div>
                            <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
                        </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-xl sm:rounded-2xl p-3 sm:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-700 font-medium text-xs sm:text-sm">Total Registrasi</p>
                                <p className="text-xl sm:text-3xl font-bold text-green-900">{statistics.total_registrations}</p>
                                <div className="flex items-center gap-1 mt-1">
                                    {getRegistrationTrend() === 'up' ? (
                                        <ArrowUp className="w-3 h-3 text-green-600" />
                                    ) : (
                                        <ArrowDown className="w-3 h-3 text-red-600" />
                                    )}
                                    <span className={`text-xs ${getRegistrationTrend() === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                                        Trending {getRegistrationTrend()}
                                    </span>
                                </div>
                            </div>
                            <Users className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
                        </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-xl sm:rounded-2xl p-3 sm:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-700 font-medium text-xs sm:text-sm">Total Check-in</p>
                                <p className="text-xl sm:text-3xl font-bold text-purple-900">{statistics.total_check_ins}</p>
                                <div className="flex items-center gap-1 mt-1">
                                    {getCheckInTrend() === 'up' ? (
                                        <ArrowUp className="w-3 h-3 text-green-600" />
                                    ) : (
                                        <ArrowDown className="w-3 h-3 text-red-600" />
                                    )}
                                    <span className={`text-xs ${getCheckInTrend() === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                                        Trending {getCheckInTrend()}
                                    </span>
                                </div>
                            </div>
                            <CheckSquare className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500" />
                        </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 rounded-xl sm:rounded-2xl p-3 sm:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-orange-700 font-medium text-xs sm:text-sm">Attendance Rate</p>
                                <p className="text-xl sm:text-3xl font-bold text-orange-900">{statistics.attendance_rate}%</p>
                                <div className="flex items-center gap-1 mt-1">
                                    <TrendingUp className="w-3 h-3 text-green-600" />
                                    <span className="text-xs text-green-600">Good</span>
                                </div>
                            </div>
                            <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500" />
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Activity Trends */}
                    <div className="bg-white/80 backdrop-blur-sm border border-orange-100 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Activity Trends</h3>
                            <div className="flex border border-gray-200 rounded-lg">
                                <button
                                    onClick={() => setActiveChart('registrations')}
                                    className={`px-3 py-1 text-sm font-medium rounded-l-lg transition-colors ${
                                        activeChart === 'registrations'
                                            ? 'bg-orange-500 text-white'
                                            : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    Registrations
                                </button>
                                <button
                                    onClick={() => setActiveChart('check_ins')}
                                    className={`px-3 py-1 text-sm font-medium rounded-r-lg transition-colors ${
                                        activeChart === 'check_ins'
                                            ? 'bg-orange-500 text-white'
                                            : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    Check-ins
                                </button>
                            </div>
                        </div>
                        
                        {activeChart === 'registrations' ? (
                            <SimpleLineChart 
                                data={charts.recent_registrations} 
                                color="bg-blue-500" 
                            />
                        ) : (
                            <SimpleLineChart 
                                data={charts.recent_check_ins} 
                                color="bg-green-500" 
                            />
                        )}
                        
                        <p className="text-sm text-gray-600 mt-3">
                            {activeChart === 'registrations' 
                                ? 'Daily registration trends over the last 30 days'
                                : 'Daily check-in trends over the last 30 days'
                            }
                        </p>
                    </div>

                    {/* Event Performance */}
                    <div className="bg-white/80 backdrop-blur-sm border border-orange-100 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Event Performance</h3>
                            <Link 
                                href="/admin/seminars"
                                className="text-orange-600 hover:text-orange-700 text-sm font-medium flex items-center gap-1"
                            >
                                <Eye className="w-4 h-4" />
                                View All
                            </Link>
                        </div>
                        
                        <div className="space-y-3">
                            {charts.event_performance.slice(0, 5).map((event, index) => (
                                <div key={`event-performance-${index}-${event.title}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900 text-sm truncate">{event.title}</p>
                                        <p className="text-xs text-gray-600">
                                            {event.registrations} registrations • {event.check_ins} check-ins
                                        </p>
                                    </div>
                                    <div className="text-right ml-3">
                                        <p className={`text-sm font-medium ${
                                            event.attendance_rate >= 80 ? 'text-green-600' :
                                            event.attendance_rate >= 60 ? 'text-orange-600' : 'text-red-600'
                                        }`}>
                                            {event.attendance_rate}%
                                        </p>
                                        <p className="text-xs text-gray-500">attendance</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Monthly Overview */}
                <div className="bg-white/80 backdrop-blur-sm border border-orange-100 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Overview</h3>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-sm text-gray-600">
                                    <th className="pb-3">Month</th>
                                    <th className="pb-3">Registrations</th>
                                    <th className="pb-3">Check-ins</th>
                                    <th className="pb-3">Attendance Rate</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {charts.monthly_overview.slice(-6).map((month, index) => (
                                    <tr key={`monthly-${index}-${month.month}`} className="text-sm">
                                        <td className="py-3 font-medium text-gray-900">{month.month}</td>
                                        <td className="py-3 text-gray-600">{month.registrations}</td>
                                        <td className="py-3 text-gray-600">{month.check_ins}</td>
                                        <td className="py-3">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                month.attendance_rate >= 80 ? 'bg-green-100 text-green-700' :
                                                month.attendance_rate >= 60 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                                {month.attendance_rate}%
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Advanced Analytics Section (Commented for future implementation) */}
                {/*
                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="bg-white/80 backdrop-blur-sm border border-orange-100 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">User Demographics</h3>
                        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                            <div className="text-center">
                                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                <p className="text-gray-500">Advanced demographics analysis</p>
                                <p className="text-sm text-gray-400">Age, gender, location distribution</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm border border-orange-100 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Peak Registration Times</h3>
                        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                            <div className="text-center">
                                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                <p className="text-gray-500">Peak time analysis</p>
                                <p className="text-sm text-gray-400">Hour of day, day of week patterns</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm border border-orange-100 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Geographic Distribution</h3>
                        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                            <div className="text-center">
                                <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                <p className="text-gray-500">Geographic analysis</p>
                                <p className="text-sm text-gray-400">Registration by city/region</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm border border-orange-100 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion Funnel</h3>
                        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                            <div className="text-center">
                                <TrendingDown className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                <p className="text-gray-500">Conversion analysis</p>
                                <p className="text-sm text-gray-400">Page views → Registrations → Check-ins</p>
                            </div>
                        </div>
                    </div>
                </div>
                */}

                {/* Quick Insights */}
                <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Insights</h3>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="p-4 bg-white rounded-lg border">
                            <div className="flex items-center gap-2 mb-2">
                                <TrendingUp className="w-5 h-5 text-green-600" />
                                <span className="font-medium text-gray-900">Best Performing Event</span>
                            </div>
                            <p className="text-sm text-gray-600">
                                {charts.event_performance[0]?.title || 'No events yet'} 
                                {charts.event_performance[0] && ` (${charts.event_performance[0].attendance_rate}% attendance)`}
                            </p>
                        </div>
                        
                        <div className="p-4 bg-white rounded-lg border">
                            <div className="flex items-center gap-2 mb-2">
                                <Calendar className="w-5 h-5 text-blue-600" />
                                <span className="font-medium text-gray-900">Average Attendance</span>
                            </div>
                            <p className="text-sm text-gray-600">
                                {statistics.attendance_rate}% across all events
                            </p>
                        </div>
                        
                        <div className="p-4 bg-white rounded-lg border">
                            <div className="flex items-center gap-2 mb-2">
                                <Users className="w-5 h-5 text-purple-600" />
                                <span className="font-medium text-gray-900">Total Participants</span>
                            </div>
                            <p className="text-sm text-gray-600">
                                {statistics.total_registrations} people registered across all events
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}