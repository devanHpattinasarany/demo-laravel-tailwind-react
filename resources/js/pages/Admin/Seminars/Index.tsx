import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import {
    Calendar,
    Users,
    MapPin,
    Plus,
    Search,
    Filter,
    Eye,
    Edit,
    Trash2,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle
} from 'lucide-react';
import { useState } from 'react';

interface Seminar {
    id: number;
    title: string;
    event_code: string;
    date: string;
    time?: string;
    location: string;
    status: 'active' | 'inactive';
    max_capacity: number;
    registration_count: number;
    available_slots: number;
    speakers: string;
}

interface SeminarsIndexProps {
    seminars: {
        data: Seminar[];
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
    filters: {
        search?: string;
        status?: string;
        date_from?: string;
        date_to?: string;
    };
    statistics: {
        total: number;
        active: number;
        upcoming: number;
        past: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Talkshow Management', href: '/admin/seminars' },
];

export default function SeminarsIndex({ seminars, filters, statistics }: SeminarsIndexProps) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');

    const handleSearch = () => {
        router.get('/admin/seminars', {
            ...filters,
            search: searchTerm,
            status: statusFilter,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleClearFilters = () => {
        setSearchTerm('');
        setStatusFilter('');
        router.get('/admin/seminars', {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const getStatusBadge = (status: string) => {
        if (status === 'active') {
            return (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700 border border-green-200">
                    <CheckCircle className="w-3 h-3" />
                    Aktif
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700 border border-gray-200">
                <XCircle className="w-3 h-3" />
                Tidak Aktif
            </span>
        );
    };

    const getCapacityStatus = (registrationCount: number, maxCapacity: number) => {
        const percentage = (registrationCount / maxCapacity) * 100;

        if (percentage >= 100) {
            return { color: 'text-red-600', icon: AlertCircle, text: 'Penuh' };
        } else if (percentage >= 80) {
            return { color: 'text-orange-600', icon: Clock, text: 'Hampir Penuh' };
        }
        return { color: 'text-green-600', icon: CheckCircle, text: 'Tersedia' };
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Talkshow Management - Festival Tahuri Admin" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6 overflow-x-auto">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent">
                            Talkshow Management
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Kelola semua acara Festival Tahuri
                        </p>
                    </div>
                    <Link
                        href="/admin/seminars/create"
                        className="w-full sm:w-auto px-4 sm:px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                        <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="sm:inline">Buat Talkshow Baru</span>
                    </Link>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl sm:rounded-2xl p-3 sm:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-700 font-medium text-xs sm:text-sm">Total Talkshow</p>
                                <p className="text-xl sm:text-3xl font-bold text-blue-900">{statistics.total}</p>
                            </div>
                            <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-xl sm:rounded-2xl p-3 sm:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-700 font-medium text-xs sm:text-sm">Talkshow Aktif</p>
                                <p className="text-xl sm:text-3xl font-bold text-green-900">{statistics.active}</p>
                            </div>
                            <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 rounded-xl sm:rounded-2xl p-3 sm:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-orange-700 font-medium text-xs sm:text-sm">Mendatang</p>
                                <p className="text-xl sm:text-3xl font-bold text-orange-900">{statistics.upcoming}</p>
                            </div>
                            <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500" />
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-xl sm:rounded-2xl p-3 sm:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-700 font-medium text-xs sm:text-sm">Selesai</p>
                                <p className="text-xl sm:text-3xl font-bold text-gray-900">{statistics.past}</p>
                            </div>
                            <XCircle className="w-6 h-6 sm:w-8 sm:h-8 text-gray-500" />
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
                                    placeholder="Cari nama event, kode, lokasi..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-9 sm:pl-10 pr-4 py-3 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="flex-1 sm:flex-none sm:min-w-[140px] px-3 sm:px-4 py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            >
                                <option value="">Semua Status</option>
                                <option value="active">Aktif</option>
                                <option value="inactive">Tidak Aktif</option>
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

                {/* Talkshow List */}
                <div className="bg-white/80 backdrop-blur-sm border border-orange-100 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-orange-50 to-red-50">
                                <tr>
                                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-900">Event</th>
                                    <th className="hidden md:table-cell px-6 py-4 text-left text-sm font-semibold text-gray-900">Tanggal & Waktu</th>
                                    <th className="hidden lg:table-cell px-6 py-4 text-left text-sm font-semibold text-gray-900">Lokasi</th>
                                    <th className="hidden sm:table-cell px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-900">Kapasitas</th>
                                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-900">Status</th>
                                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-900">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {seminars.data.length > 0 ? seminars.data.map((seminar) => {
                                    const capacityStatus = getCapacityStatus(seminar.registration_count, seminar.max_capacity);
                                    const CapacityIcon = capacityStatus.icon;

                                    return (
                                        <tr key={seminar.id} className="hover:bg-orange-50/50 transition-colors">
                                            <td className="px-3 sm:px-6 py-3 sm:py-4">
                                                <div>
                                                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                                        <h3 className="font-semibold text-sm sm:text-base text-gray-900 leading-tight">{seminar.title}</h3>
                                                        <span className="self-start sm:self-auto px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-md font-medium whitespace-nowrap">
                                                            {seminar.event_code}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-1">
                                                        Narasumber: {seminar.speakers}
                                                    </p>
                                                    {/* Mobile-only date/time info */}
                                                    <div className="md:hidden mt-2 space-y-1">
                                                        <div className="flex items-center gap-1 text-xs text-gray-500">
                                                            <Calendar className="w-3 h-3" />
                                                            {new Date(seminar.date).toLocaleDateString('id-ID', {
                                                                day: 'numeric',
                                                                month: 'short'
                                                            })}
                                                            {seminar.time && <span className="ml-2">{seminar.time}</span>}
                                                        </div>
                                                        <div className="lg:hidden flex items-center gap-1 text-xs text-gray-500">
                                                            <MapPin className="w-3 h-3" />
                                                            <span className="truncate">{seminar.location}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="hidden md:table-cell px-6 py-4">
                                                <div className="flex items-center gap-2 text-sm text-gray-900">
                                                    <Calendar className="w-4 h-4 text-gray-400" />
                                                    <div>
                                                        <div>{new Date(seminar.date).toLocaleDateString('id-ID', {
                                                            weekday: 'short',
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}</div>
                                                        {seminar.time && (
                                                            <div className="text-gray-500 text-xs">{seminar.time}</div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="hidden lg:table-cell px-6 py-4">
                                                <div className="flex items-center gap-2 text-sm text-gray-900">
                                                    <MapPin className="w-4 h-4 text-gray-400" />
                                                    {seminar.location}
                                                </div>
                                            </td>
                                            <td className="hidden sm:table-cell px-3 sm:px-6 py-3 sm:py-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-1 sm:gap-2">
                                                        <Users className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                                                        <span className="text-xs sm:text-sm font-medium">
                                                            {seminar.registration_count}/{seminar.max_capacity}
                                                        </span>
                                                    </div>
                                                    <div className={`flex items-center gap-1 text-xs ${capacityStatus.color}`}>
                                                        <CapacityIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                                        <span className="text-xs">{capacityStatus.text}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-3 sm:px-6 py-3 sm:py-4">
                                                <div className="flex flex-col gap-2">
                                                    {getStatusBadge(seminar.status)}
                                                    {/* Mobile-only capacity info */}
                                                    <div className="sm:hidden flex items-center gap-1 text-xs text-gray-500">
                                                        <Users className="w-3 h-3" />
                                                        <span>{seminar.registration_count}/{seminar.max_capacity}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-3 sm:px-6 py-4">
                                                <div className="flex items-center gap-1 sm:gap-2">
                                                    <Link
                                                        href={`/admin/seminars/${seminar.id}`}
                                                        className="p-1.5 sm:p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Lihat Detail"
                                                    >
                                                        <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                    </Link>
                                                    <Link
                                                        href={`/admin/seminars/${seminar.id}/edit`}
                                                        className="p-1.5 sm:p-2 text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors"
                                                        title="Edit Event"
                                                    >
                                                        <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                    </Link>
                                                    <button
                                                        onClick={() => {
                                                            if (confirm('Apakah Anda yakin ingin menghapus event ini?')) {
                                                                router.delete(`/admin/seminars/${seminar.id}`);
                                                            }
                                                        }}
                                                        className="p-1.5 sm:p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                                        title="Hapus Event"
                                                        disabled={seminar.registration_count > 0}
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                }) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <Calendar className="w-16 h-16 text-gray-300" />
                                                <div>
                                                    <h3 className="text-lg font-medium text-gray-900">Belum ada event</h3>
                                                    <p className="text-gray-500">Mulai dengan membuat event pertama Anda</p>
                                                </div>
                                                <Link
                                                    href="/admin/seminars/create"
                                                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors"
                                                >
                                                    Buat Event Baru
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {seminars.data.length > 0 && seminars.links && (
                        <div className="border-t border-gray-200 px-3 sm:px-6 py-4">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                <div className="text-xs sm:text-sm text-gray-700 text-center sm:text-left">
                                    <span className="hidden sm:inline">Menampilkan </span>{seminars.from || 1} - {seminars.to || seminars.data.length} dari {seminars.total || seminars.data.length} seminar
                                </div>
                                <div className="flex gap-1 sm:gap-2 justify-center sm:justify-end flex-wrap">
                                    {seminars.links.map((link, index) => (
                                        <button
                                            key={`${link.url || 'disabled'}-${link.label}-${index}`}
                                            onClick={() => link.url && router.get(link.url)}
                                            disabled={!link.url}
                                            className={`px-2 sm:px-3 py-1 sm:py-1 rounded text-xs sm:text-sm font-medium transition-colors min-w-[32px] sm:min-w-[auto] ${
                                                link.active
                                                    ? 'bg-orange-500 text-white'
                                                    : link.url
                                                    ? 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
