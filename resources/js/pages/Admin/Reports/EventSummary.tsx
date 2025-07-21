import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { 
    ArrowLeft,
    Calendar,
    MapPin,
    Users,
    CheckSquare,
    Download,
    Filter,
    TrendingUp,
    TrendingDown,
    Minus
} from 'lucide-react';
import { useState } from 'react';

interface EventData {
    title: string;
    code: string;
    date: string;
    location: string;
    capacity: number;
    registrations: number;
    check_ins: number;
    attendance_rate: number;
    available_slots: number;
}

interface ReportData {
    events: EventData[];
    summary: {
        total_events: number;
        total_registrations: number;
        total_check_ins: number;
        average_attendance: number;
    };
}

interface Event {
    id: number;
    title: string;
    event_code: string;
}

interface EventSummaryProps {
    reportData: ReportData;
    filters: {
        date_from?: string;
        date_to?: string;
        event_ids?: number[];
    };
    events: Event[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Reports', href: '/admin/reports' },
    { title: 'Event Summary', href: '/admin/reports/event-summary' },
];

export default function EventSummary({ reportData, filters, events }: EventSummaryProps) {
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo] = useState(filters.date_to || '');
    const [selectedEvents, setSelectedEvents] = useState<string[]>(
        filters.event_ids?.map(id => id.toString()) || []
    );

    const handleApplyFilters = () => {
        const params: any = {};
        if (dateFrom) params.date_from = dateFrom;
        if (dateTo) params.date_to = dateTo;
        if (selectedEvents.length > 0) params.event_ids = selectedEvents.map(id => parseInt(id));

        router.get('/admin/reports/event-summary', params, {
            preserveState: true,
        });
    };

    const handleClearFilters = () => {
        setDateFrom('');
        setDateTo('');
        setSelectedEvents([]);
        router.get('/admin/reports/event-summary', {}, {
            preserveState: true,
        });
    };

    const getAttendanceIcon = (rate: number) => {
        if (rate >= 80) return <TrendingUp className="w-4 h-4 text-green-600" />;
        if (rate >= 60) return <Minus className="w-4 h-4 text-orange-600" />;
        return <TrendingDown className="w-4 h-4 text-red-600" />;
    };

    const getAttendanceColor = (rate: number) => {
        if (rate >= 80) return 'text-green-600 bg-green-50 border-green-200';
        if (rate >= 60) return 'text-orange-600 bg-orange-50 border-orange-200';
        return 'text-red-600 bg-red-50 border-red-200';
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Event Summary Report - Festival Tahuri Admin" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4 sm:p-6 overflow-x-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/admin/reports"
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent">
                                Event Summary Report
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                Comprehensive overview of all event performance
                            </p>
                        </div>
                    </div>
                    
                    {/* Export functionality (commented for future implementation) */}
                    {/*
                    <div className="flex gap-3">
                        <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2">
                            <Download className="w-4 h-4" />
                            Export PDF
                        </button>
                        <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2">
                            <Download className="w-4 h-4" />
                            Export Excel
                        </button>
                    </div>
                    */}
                </div>

                {/* Filters */}
                <div className="bg-white/80 backdrop-blur-sm border border-orange-100 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Filters</h3>
                    
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                From Date
                            </label>
                            <input
                                type="date"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                To Date
                            </label>
                            <input
                                type="date"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Specific Events
                            </label>
                            <select
                                multiple
                                value={selectedEvents}
                                onChange={(e) => setSelectedEvents(Array.from(e.target.selectedOptions, option => option.value))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 h-20"
                            >
                                {events.map((event) => (
                                    <option key={event.id} value={event.id}>
                                        {event.title} ({event.event_code})
                                    </option>
                                ))}
                            </select>
                            <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
                        </div>
                    </div>
                    
                    <div className="flex gap-3 mt-4">
                        <button
                            onClick={handleApplyFilters}
                            className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                        >
                            <Filter className="w-4 h-4" />
                            Apply Filters
                        </button>
                        
                        <button
                            onClick={handleClearFilters}
                            className="px-6 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-lg transition-colors"
                        >
                            Clear All
                        </button>
                    </div>
                </div>

                {/* Summary Statistics */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl sm:rounded-2xl p-3 sm:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-700 font-medium text-xs sm:text-sm">Total Events</p>
                                <p className="text-xl sm:text-3xl font-bold text-blue-900">{reportData.summary.total_events}</p>
                            </div>
                            <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
                        </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-xl sm:rounded-2xl p-3 sm:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-700 font-medium text-xs sm:text-sm">Total Registrations</p>
                                <p className="text-xl sm:text-3xl font-bold text-green-900">{reportData.summary.total_registrations}</p>
                            </div>
                            <Users className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
                        </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-xl sm:rounded-2xl p-3 sm:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-700 font-medium text-xs sm:text-sm">Total Check-ins</p>
                                <p className="text-xl sm:text-3xl font-bold text-purple-900">{reportData.summary.total_check_ins}</p>
                            </div>
                            <CheckSquare className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500" />
                        </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 rounded-xl sm:rounded-2xl p-3 sm:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-orange-700 font-medium text-xs sm:text-sm">Avg Attendance</p>
                                <p className="text-xl sm:text-3xl font-bold text-orange-900">{Math.round(reportData.summary.average_attendance)}%</p>
                            </div>
                            <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500" />
                        </div>
                    </div>
                </div>

                {/* Events Table */}
                <div className="bg-white/80 backdrop-blur-sm border border-orange-100 rounded-xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">Event Details</h3>
                    </div>
                    
                    {reportData.events.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gradient-to-r from-orange-50 to-red-50">
                                    <tr>
                                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-900">Event</th>
                                        <th className="hidden md:table-cell px-6 py-4 text-left text-sm font-semibold text-gray-900">Date & Location</th>
                                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-900">Capacity</th>
                                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-900">Registrations</th>
                                        <th className="hidden lg:table-cell px-6 py-4 text-left text-sm font-semibold text-gray-900">Check-ins</th>
                                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-900">Attendance</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {reportData.events.map((event, index) => (
                                        <tr key={`event-summary-${event.code || event.title}-${index}`} className="hover:bg-orange-50/30 transition-colors">
                                            <td className="px-4 sm:px-6 py-3 sm:py-4">
                                                <div>
                                                    <p className="font-medium text-gray-900 text-sm sm:text-base">{event.title}</p>
                                                    <p className="text-xs sm:text-sm text-orange-600 font-medium">{event.code}</p>
                                                    <div className="md:hidden mt-1">
                                                        <p className="text-xs text-gray-500">{formatDate(event.date)}</p>
                                                        <p className="text-xs text-gray-500 truncate">{event.location}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="hidden md:table-cell px-6 py-4">
                                                <div>
                                                    <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                                                        <Calendar className="w-4 h-4" />
                                                        {formatDate(event.date)}
                                                    </div>
                                                    <div className="flex items-center gap-1 text-sm text-gray-600">
                                                        <MapPin className="w-4 h-4" />
                                                        <span className="truncate max-w-[150px]">{event.location}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 sm:px-6 py-3 sm:py-4">
                                                <div className="text-center">
                                                    <p className="font-medium text-gray-900">{event.capacity}</p>
                                                    <p className="text-xs text-gray-500">{event.available_slots} available</p>
                                                </div>
                                            </td>
                                            <td className="px-4 sm:px-6 py-3 sm:py-4">
                                                <div className="text-center">
                                                    <p className="font-medium text-gray-900">{event.registrations}</p>
                                                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                                        <div 
                                                            className="bg-blue-600 h-2 rounded-full" 
                                                            style={{ width: `${Math.min((event.registrations / event.capacity) * 100, 100)}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="hidden lg:table-cell px-6 py-4 text-center">
                                                <p className="font-medium text-gray-900">{event.check_ins}</p>
                                                <p className="text-sm text-gray-500">of {event.registrations}</p>
                                            </td>
                                            <td className="px-4 sm:px-6 py-3 sm:py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    {getAttendanceIcon(event.attendance_rate)}
                                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getAttendanceColor(event.attendance_rate)}`}>
                                                        {event.attendance_rate}%
                                                    </span>
                                                </div>
                                                <div className="lg:hidden mt-1 text-center">
                                                    <p className="text-xs text-gray-500">{event.check_ins} check-ins</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <Calendar className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
                            <p className="text-gray-500">No events match your current filters.</p>
                        </div>
                    )}
                </div>

                {/* Report Notes */}
                <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Notes</h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <h4 className="font-medium text-gray-900 mb-2">Data Accuracy</h4>
                            <ul className="space-y-1 text-sm text-gray-600">
                                <li>• All data is real-time from the database</li>
                                <li>• Attendance rates calculated from actual check-ins</li>
                                <li>• Report generated on {new Date().toLocaleString('id-ID')}</li>
                            </ul>
                        </div>
                        
                        <div>
                            <h4 className="font-medium text-gray-900 mb-2">Legend</h4>
                            <ul className="space-y-1 text-sm text-gray-600">
                                <li className="flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-green-600" />
                                    High attendance (≥80%)
                                </li>
                                <li className="flex items-center gap-2">
                                    <Minus className="w-4 h-4 text-orange-600" />
                                    Medium attendance (60-79%)
                                </li>
                                <li className="flex items-center gap-2">
                                    <TrendingDown className="w-4 h-4 text-red-600" />
                                    Low attendance (&lt;60%)
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}