import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { 
    ArrowLeft,
    Users,
    Filter,
    Download,
    Search,
    Calendar,
    Mail,
    Phone,
    MapPin,
    CheckSquare,
    UserCheck,
    UserX,
    Eye
} from 'lucide-react';
import { useState } from 'react';

interface Registration {
    id: number;
    participant_name: string;
    email: string;
    phone: string;
    nik: string;
    ticket_number: string;
    created_at: string;
    event: {
        id: number;
        title: string;
        event_code: string;
        date: string;
        location: string;
    };
    check_in?: {
        id: number;
        created_at: string;
    };
}

interface Event {
    id: number;
    title: string;
    event_code: string;
}

interface RegistrationListProps {
    registrations: Registration[];
    filters: {
        event_id?: string;
        status?: string;
        date_from?: string;
        date_to?: string;
    };
    events: Event[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Reports', href: '/admin/reports' },
    { title: 'Registration List', href: '/admin/reports/registration-list' },
];

export default function RegistrationList({ registrations, filters, events }: RegistrationListProps) {
    const [eventId, setEventId] = useState(filters.event_id || '');
    const [status, setStatus] = useState(filters.status || 'all');
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo] = useState(filters.date_to || '');

    const handleApplyFilters = () => {
        const params: any = {};
        if (eventId) params.event_id = eventId;
        if (status !== 'all') params.status = status;
        if (dateFrom) params.date_from = dateFrom;
        if (dateTo) params.date_to = dateTo;

        router.get('/admin/reports/registration-list', params, {
            preserveState: true,
        });
    };

    const handleClearFilters = () => {
        setEventId('');
        setStatus('all');
        setDateFrom('');
        setDateTo('');
        router.get('/admin/reports/registration-list', {}, {
            preserveState: true,
        });
    };

    const getStatusBadge = (registration: Registration) => {
        if (registration.check_in) {
            return (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                    <UserCheck className="w-3 h-3" />
                    Checked In
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full font-medium">
                <UserX className="w-3 h-3" />
                Not Checked In
            </span>
        );
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Statistics
    const totalRegistrations = registrations.length;
    const checkedInCount = registrations.filter(r => r.check_in).length;
    const attendanceRate = totalRegistrations > 0 ? Math.round((checkedInCount / totalRegistrations) * 100) : 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Registration List Report - Festival Tahuri Admin" />
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
                                Registration List Report
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                Detailed participant registration data
                            </p>
                        </div>
                    </div>
                    
                    {/* Export functionality (commented for future implementation) */}
                    {/*
                    <div className="flex gap-3">
                        <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2">
                            <Download className="w-4 h-4" />
                            Export Excel
                        </button>
                        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2">
                            <Download className="w-4 h-4" />
                            Export CSV
                        </button>
                    </div>
                    */}
                </div>

                {/* Filters */}
                <div className="bg-white/80 backdrop-blur-sm border border-orange-100 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Filters</h3>
                    
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Event
                            </label>
                            <select
                                value={eventId}
                                onChange={(e) => setEventId(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            >
                                <option value="">All Events</option>
                                {events.map((event) => (
                                    <option key={event.id} value={event.id}>
                                        {event.title} ({event.event_code})
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Status
                            </label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            >
                                <option value="all">All Status</option>
                                <option value="checked_in">Checked In</option>
                                <option value="not_checked_in">Not Checked In</option>
                            </select>
                        </div>
                        
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
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-700 font-medium text-sm">Total Registrations</p>
                                <p className="text-3xl font-bold text-blue-900">{totalRegistrations}</p>
                            </div>
                            <Users className="w-8 h-8 text-blue-500" />
                        </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-700 font-medium text-sm">Checked In</p>
                                <p className="text-3xl font-bold text-green-900">{checkedInCount}</p>
                            </div>
                            <CheckSquare className="w-8 h-8 text-green-500" />
                        </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-700 font-medium text-sm">Attendance Rate</p>
                                <p className="text-3xl font-bold text-purple-900">{attendanceRate}%</p>
                            </div>
                            <UserCheck className="w-8 h-8 text-purple-500" />
                        </div>
                    </div>
                </div>

                {/* Registrations Table */}
                <div className="bg-white/80 backdrop-blur-sm border border-orange-100 rounded-xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Registration Details ({registrations.length} records)
                        </h3>
                    </div>
                    
                    {registrations.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gradient-to-r from-orange-50 to-red-50">
                                    <tr>
                                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-900">Participant</th>
                                        <th className="hidden md:table-cell px-6 py-4 text-left text-sm font-semibold text-gray-900">Event</th>
                                        <th className="hidden lg:table-cell px-6 py-4 text-left text-sm font-semibold text-gray-900">Contact</th>
                                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-900">Registration</th>
                                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-900">Status</th>
                                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-900">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {registrations.map((registration) => (
                                        <tr key={registration.id} className="hover:bg-orange-50/30 transition-colors">
                                            <td className="px-4 sm:px-6 py-3 sm:py-4">
                                                <div>
                                                    <p className="font-medium text-gray-900 text-sm sm:text-base">{registration.participant_name}</p>
                                                    <p className="text-xs sm:text-sm text-gray-500">NIK: {registration.nik}</p>
                                                    <p className="text-xs text-orange-600 font-medium">{registration.ticket_number}</p>
                                                    {/* Mobile view additional info */}
                                                    <div className="md:hidden mt-1 space-y-1">
                                                        <p className="text-xs text-gray-500">{registration.event.title}</p>
                                                        <div className="lg:hidden">
                                                            <p className="text-xs text-gray-500">{registration.email}</p>
                                                            <p className="text-xs text-gray-500">{registration.phone}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="hidden md:table-cell px-6 py-4">
                                                <div>
                                                    <p className="font-medium text-gray-900">{registration.event.title}</p>
                                                    <p className="text-sm text-orange-600">{registration.event.event_code}</p>
                                                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                                                        <Calendar className="w-3 h-3" />
                                                        {formatDate(registration.event.date)}
                                                    </div>
                                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                                        <MapPin className="w-3 h-3" />
                                                        <span className="truncate max-w-[120px]">{registration.event.location}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="hidden lg:table-cell px-6 py-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <Mail className="w-4 h-4" />
                                                        <span className="truncate max-w-[160px]">{registration.email}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <Phone className="w-4 h-4" />
                                                        {registration.phone}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 sm:px-6 py-3 sm:py-4">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {formatDateTime(registration.created_at)}
                                                    </p>
                                                    <p className="text-xs text-gray-500">Registered</p>
                                                </div>
                                            </td>
                                            <td className="px-4 sm:px-6 py-3 sm:py-4">
                                                <div>
                                                    {getStatusBadge(registration)}
                                                    {registration.check_in && (
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            {formatDateTime(registration.check_in.created_at)}
                                                        </p>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 sm:px-6 py-3 sm:py-4">
                                                <Link
                                                    href={`/admin/registrations/${registration.id}`}
                                                    className="p-2 text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors inline-flex items-center"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No registrations found</h3>
                            <p className="text-gray-500">No registrations match your current filters.</p>
                        </div>
                    )}
                </div>

                {/* Report Notes */}
                <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Information</h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <h4 className="font-medium text-gray-900 mb-2">Data Included</h4>
                            <ul className="space-y-1 text-sm text-gray-600">
                                <li>• Participant name and NIK</li>
                                <li>• Contact information (email, phone)</li>
                                <li>• Event details and ticket numbers</li>
                                <li>• Registration and check-in timestamps</li>
                            </ul>
                        </div>
                        
                        <div>
                            <h4 className="font-medium text-gray-900 mb-2">Report Details</h4>
                            <ul className="space-y-1 text-sm text-gray-600">
                                <li>• Generated on: {new Date().toLocaleString('id-ID')}</li>
                                <li>• Total records: {registrations.length}</li>
                                <li>• Data source: Real-time database</li>
                                {/* Export note (commented) */}
                                {/*
                                <li>• Available formats: Excel, CSV, PDF</li>
                                */}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}