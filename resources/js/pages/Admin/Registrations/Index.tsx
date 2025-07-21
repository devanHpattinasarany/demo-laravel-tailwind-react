import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { 
    Users, 
    Search, 
    Filter, 
    Eye, 
    Trash2,
    CheckSquare,
    Calendar,
    Mail,
    Phone,
    MapPin,
    Clock,
    Download,
    MoreHorizontal,
    UserCheck,
    UserX
} from 'lucide-react';
import { useState } from 'react';

interface Registration {
    id: number;
    full_name: string;
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

interface RegistrationsIndexProps {
    registrations: {
        data: Registration[];
        current_page: number;
        first_page_url: string;
        from: number;
        last_page: number;
        last_page_url: string;
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
        next_page_url: string | null;
        path: string;
        per_page: number;
        prev_page_url: string | null;
        to: number;
        total: number;
    };
    events: Event[];
    filters: {
        search?: string;
        event_id?: string;
        status?: string;
    };
    statistics: {
        total_registrations: number;
        total_checked_in: number;
        registrations_today: number;
        check_ins_today: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Registrations', href: '/admin/registrations' },
];

export default function RegistrationsIndex({ registrations, events, filters, statistics }: RegistrationsIndexProps) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [eventFilter, setEventFilter] = useState(filters.event_id || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [selectedRegistrations, setSelectedRegistrations] = useState<number[]>([]);

    const handleSearch = () => {
        router.get('/admin/registrations', {
            ...filters,
            search: searchTerm,
            event_id: eventFilter,
            status: statusFilter,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleClearFilters = () => {
        setSearchTerm('');
        setEventFilter('');
        setStatusFilter('');
        router.get('/admin/registrations', {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleSelectAll = () => {
        if (selectedRegistrations.length === registrations.data.length) {
            setSelectedRegistrations([]);
        } else {
            setSelectedRegistrations(registrations.data.map(r => r.id));
        }
    };

    const handleSelectRegistration = (id: number) => {
        setSelectedRegistrations(prev => 
            prev.includes(id) 
                ? prev.filter(regId => regId !== id)
                : [...prev, id]
        );
    };

    const handleBulkAction = (action: string) => {
        if (selectedRegistrations.length === 0) return;

        if (action === 'delete' && !confirm('Are you sure you want to delete selected registrations?')) {
            return;
        }

        router.post('/admin/registrations/bulk-action', {
            action,
            registration_ids: selectedRegistrations,
        }, {
            onSuccess: () => setSelectedRegistrations([]),
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

    const attendanceRate = statistics.total_registrations > 0 
        ? Math.round((statistics.total_checked_in / statistics.total_registrations) * 100)
        : 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Registration Management - Festival Tahuri Admin" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4 sm:p-6 overflow-x-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent">
                            Registration Management
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Kelola semua registrasi peserta event
                        </p>
                    </div>
                    {selectedRegistrations.length > 0 && (
                        <div className="flex gap-2 sm:gap-3">
                            <button
                                onClick={() => handleBulkAction('delete')}
                                className="px-3 sm:px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2 text-sm"
                            >
                                <Trash2 className="w-4 h-4" />
                                <span className="hidden sm:inline">Delete ({selectedRegistrations.length})</span>
                                <span className="sm:hidden">{selectedRegistrations.length}</span>
                            </button>
                            {/* Export functionality commented for future implementation */}
                            {/*
                            <button
                                onClick={() => handleBulkAction('export')}
                                className="px-3 sm:px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2 text-sm"
                            >
                                <Download className="w-4 h-4" />
                                <span className="hidden sm:inline">Export ({selectedRegistrations.length})</span>
                                <span className="sm:hidden">Export</span>
                            </button>
                            */}
                        </div>
                    )}
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl sm:rounded-2xl p-3 sm:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-700 font-medium text-xs sm:text-sm">Total Registrasi</p>
                                <p className="text-xl sm:text-3xl font-bold text-blue-900">{statistics.total_registrations}</p>
                            </div>
                            <Users className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
                        </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-xl sm:rounded-2xl p-3 sm:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-700 font-medium text-xs sm:text-sm">Total Check-in</p>
                                <p className="text-xl sm:text-3xl font-bold text-green-900">{statistics.total_checked_in}</p>
                            </div>
                            <CheckSquare className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
                        </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 rounded-xl sm:rounded-2xl p-3 sm:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-orange-700 font-medium text-xs sm:text-sm">Hari Ini</p>
                                <p className="text-xl sm:text-3xl font-bold text-orange-900">{statistics.registrations_today}</p>
                            </div>
                            <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500" />
                        </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-xl sm:rounded-2xl p-3 sm:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-700 font-medium text-xs sm:text-sm">Tingkat Hadir</p>
                                <p className="text-xl sm:text-3xl font-bold text-purple-900">{attendanceRate}%</p>
                            </div>
                            <UserCheck className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500" />
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white/80 backdrop-blur-sm border border-orange-100 rounded-xl p-4 sm:p-6">
                    <div className="flex flex-col gap-4">
                        <div className="w-full">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                                <input
                                    type="text"
                                    placeholder="Cari nama peserta, email, NIK, nomor tiket..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-9 sm:pl-10 pr-4 py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                />
                            </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-3">
                            <select
                                value={eventFilter}
                                onChange={(e) => setEventFilter(e.target.value)}
                                className="flex-1 sm:flex-none sm:min-w-[180px] px-3 sm:px-4 py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            >
                                <option value="">Semua Event</option>
                                {events.map((event) => (
                                    <option key={event.id} value={event.id}>
                                        {event.title} ({event.event_code})
                                    </option>
                                ))}
                            </select>
                            
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="flex-1 sm:flex-none sm:min-w-[140px] px-3 sm:px-4 py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            >
                                <option value="">Semua Status</option>
                                <option value="checked_in">Sudah Check-in</option>
                                <option value="not_checked_in">Belum Check-in</option>
                            </select>
                            
                            <div className="flex gap-2 sm:gap-3">
                                <button
                                    onClick={handleSearch}
                                    className="flex-1 sm:flex-none px-4 sm:px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                                >
                                    <Filter className="w-4 h-4" />
                                    <span className="hidden sm:inline">Filter</span>
                                </button>
                                
                                <button
                                    onClick={handleClearFilters}
                                    className="flex-1 sm:flex-none px-4 sm:px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-lg transition-colors text-sm sm:text-base"
                                >
                                    Reset
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Registrations List */}
                <div className="bg-white/80 backdrop-blur-sm border border-orange-100 rounded-xl overflow-hidden max-h-[600px] flex flex-col">
                    {registrations.data.length > 0 ? (
                        <>
                            <div className="overflow-x-auto flex-1 overflow-y-auto">
                                <table className="w-full">
                                    <thead className="bg-gradient-to-r from-orange-50 to-red-50">
                                        <tr>
                                            <th className="px-3 sm:px-6 py-3 sm:py-4 text-left">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedRegistrations.length === registrations.data.length}
                                                    onChange={handleSelectAll}
                                                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                                                />
                                            </th>
                                            <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-900">Peserta</th>
                                            <th className="hidden md:table-cell px-6 py-4 text-left text-sm font-semibold text-gray-900">Event</th>
                                            <th className="hidden lg:table-cell px-6 py-4 text-left text-sm font-semibold text-gray-900">Kontak</th>
                                            <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-900">Status</th>
                                            <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-900">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {registrations.data.map((registration) => (
                                            <tr key={registration.id} className="hover:bg-orange-50/30 transition-colors">
                                                <td className="px-3 sm:px-6 py-3 sm:py-4">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedRegistrations.includes(registration.id)}
                                                        onChange={() => handleSelectRegistration(registration.id)}
                                                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                                                    />
                                                </td>
                                                <td className="px-3 sm:px-6 py-3 sm:py-4">
                                                    <div>
                                                        <p className="font-medium text-gray-900 text-sm sm:text-base">{registration.full_name}</p>
                                                        <p className="text-xs sm:text-sm text-gray-500">NIK: {registration.nik}</p>
                                                        <p className="text-xs text-orange-600 font-medium">{registration.ticket_number}</p>
                                                        <p className="text-xs text-gray-500 md:hidden mt-1">
                                                            {registration.event.title}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="hidden md:table-cell px-6 py-4">
                                                    <div>
                                                        <p className="font-medium text-gray-900">{registration.event.title}</p>
                                                        <p className="text-sm text-gray-500">{registration.event.event_code}</p>
                                                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                                                            <Calendar className="w-3 h-3" />
                                                            {new Date(registration.event.date).toLocaleDateString('id-ID')}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="hidden lg:table-cell px-6 py-4">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                                            <Mail className="w-4 h-4" />
                                                            <span className="truncate max-w-[200px]">{registration.email}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                                            <Phone className="w-4 h-4" />
                                                            {registration.phone}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-3 sm:px-6 py-3 sm:py-4">
                                                    {getStatusBadge(registration)}
                                                    {registration.check_in && (
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            Check-in: {new Date(registration.check_in.created_at).toLocaleString('id-ID')}
                                                        </p>
                                                    )}
                                                </td>
                                                <td className="px-3 sm:px-6 py-3 sm:py-4">
                                                    <div className="flex items-center gap-1 sm:gap-2">
                                                        <Link
                                                            href={`/admin/registrations/${registration.id}`}
                                                            className="p-1 sm:p-2 text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors"
                                                            title="View Details"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </Link>
                                                        {!registration.check_in && (
                                                            <button
                                                                onClick={() => {
                                                                    if (confirm('Are you sure you want to delete this registration?')) {
                                                                        router.delete(`/admin/registrations/${registration.id}`);
                                                                    }
                                                                }}
                                                                className="p-1 sm:p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                                                title="Delete Registration"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {registrations.links && (
                                <div className="px-4 sm:px-6 py-4 border-t border-gray-200 bg-gray-50">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-gray-700">
                                            Showing {registrations.from} to {registrations.to} of {registrations.total} results
                                        </div>
                                        <div className="flex space-x-1">
                                            {registrations.links.map((link, index) => (
                                                <Link
                                                    key={index}
                                                    href={link.url || '#'}
                                                    className={`px-3 py-2 text-sm rounded-md ${
                                                        link.active
                                                            ? 'bg-orange-500 text-white'
                                                            : link.url
                                                            ? 'text-gray-700 hover:bg-gray-200'
                                                            : 'text-gray-400 cursor-not-allowed'
                                                    }`}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No registrations found</h3>
                            <p className="text-gray-500">No registrations match your current filters.</p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}