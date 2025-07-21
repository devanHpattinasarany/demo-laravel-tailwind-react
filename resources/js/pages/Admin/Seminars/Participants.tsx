import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    ArrowLeft,
    Users,
    Search,
    Filter,
    Mail,
    Phone,
    CheckSquare,
    Clock,
    Eye,
    Trash2,
    Calendar,
    MapPin,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

interface Event {
    id: number;
    title: string;
    event_code: string;
    date: string;
    time?: string;
    location: string;
    max_capacity: number;
    registration_count: number;
    check_in_count: number;
    available_slots: number;
}

interface Registration {
    id: number;
    full_name: string;
    email: string;
    phone: string;
    nik: string;
    ticket_number: string;
    created_at: string;
    is_checked_in: boolean;
    check_in_time?: string;
}

interface PaginationLinks {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedRegistrations {
    data: Registration[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: PaginationLinks[];
}

interface Statistics {
    total_registrations: number;
    checked_in: number;
    not_checked_in: number;
    attendance_rate: number;
}

interface Filters {
    search?: string;
    status?: string;
}

interface SeminarParticipantsProps {
    seminar: Event;
    registrations: PaginatedRegistrations;
    statistics: Statistics;
    filters: Filters;
}

export default function SeminarParticipants({ seminar, registrations, statistics, filters }: SeminarParticipantsProps) {
    // Safety check untuk memastikan seminar data ada
    if (!seminar) {
        return (
            <AppLayout breadcrumbs={[]}>
                <Head title="Error - Festival Tahuri Admin" />
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Talkshow tidak ditemukan</h1>
                        <Link href="/admin/seminars" className="text-orange-600 hover:text-orange-700">
                            Kembali ke Daftar Talkshow
                        </Link>
                    </div>
                </div>
            </AppLayout>
        );
    }
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Talkshow Management', href: '/admin/seminars' },
        { title: seminar.title, href: `/admin/seminars/${seminar.id}` },
        { title: 'Peserta', href: `/admin/seminars/${seminar.id}/registrations` },
    ];

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(`/admin/seminars/${seminar.id}/registrations`, {
            search: searchTerm,
            status: statusFilter,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleStatusFilter = (status: string) => {
        setStatusFilter(status);
        router.get(`/admin/seminars/${seminar.id}/registrations`, {
            search: searchTerm,
            status: status,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleDelete = (registrationId: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus registrasi ini?')) {
            router.delete(`/admin/registrations/${registrationId}`, {
                onSuccess: () => {
                    router.reload();
                },
                onError: (errors) => {
                    alert('Gagal menghapus registrasi: ' + (errors.message || 'Terjadi kesalahan'));
                }
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Peserta ${seminar.title} - Festival Tahuri Admin`} />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6 overflow-x-auto">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent">
                                Peserta {seminar.title}
                            </h1>
                            <span className="px-3 py-1 bg-orange-100 text-orange-700 text-sm rounded-md font-medium">
                                {seminar.event_code}
                            </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(seminar.date).toLocaleDateString('id-ID', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                                {seminar.time && ` • ${seminar.time} WIT`}
                            </div>
                            <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {seminar.location}
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Link
                            href={`/admin/seminars/${seminar.id}`}
                            className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-lg transition-colors flex items-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Kembali ke Detail
                        </Link>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-2xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-700 font-medium text-sm">Total Registrasi</p>
                                <p className="text-3xl font-bold text-blue-900">{statistics.total_registrations}</p>
                                <p className="text-blue-600 text-sm">dari {seminar.max_capacity} slot</p>
                            </div>
                            <Users className="w-8 h-8 text-blue-500" />
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-2xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-700 font-medium text-sm">Sudah Check-in</p>
                                <p className="text-3xl font-bold text-green-900">{statistics.checked_in}</p>
                                <p className="text-green-600 text-sm">{statistics.attendance_rate}% hadir</p>
                            </div>
                            <CheckSquare className="w-8 h-8 text-green-500" />
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 rounded-2xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-orange-700 font-medium text-sm">Belum Check-in</p>
                                <p className="text-3xl font-bold text-orange-900">{statistics.not_checked_in}</p>
                                <p className="text-orange-600 text-sm">menunggu</p>
                            </div>
                            <Clock className="w-8 h-8 text-orange-500" />
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-2xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-700 font-medium text-sm">Slot Tersisa</p>
                                <p className="text-3xl font-bold text-purple-900">{seminar.available_slots}</p>
                                <p className="text-purple-600 text-sm">kapasitas</p>
                            </div>
                            <Users className="w-8 h-8 text-purple-500" />
                        </div>
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="bg-white/80 backdrop-blur-sm border border-orange-100 rounded-xl p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Search */}
                        <form onSubmit={handleSearch} className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Cari berdasarkan nama, email, NIK, atau nomor tiket..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                                />
                            </div>
                        </form>

                        {/* Status Filter */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleStatusFilter('')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    statusFilter === ''
                                    ? 'bg-orange-500 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                Semua
                            </button>
                            <button
                                onClick={() => handleStatusFilter('checked_in')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    statusFilter === 'checked_in'
                                    ? 'bg-green-500 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                Sudah Check-in
                            </button>
                            <button
                                onClick={() => handleStatusFilter('not_checked_in')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    statusFilter === 'not_checked_in'
                                    ? 'bg-orange-500 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                Belum Check-in
                            </button>
                        </div>
                    </div>
                </div>

                {/* Participants Table */}
                <div className="bg-white/80 backdrop-blur-sm border border-orange-100 rounded-xl overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                            <Users className="w-5 h-5 text-orange-500" />
                            Daftar Peserta ({registrations.total})
                        </h3>
                    </div>

                    {registrations.data.length > 0 ? (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Peserta</th>
                                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Kontak</th>
                                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Tiket</th>
                                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Status Check-in</th>
                                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Tanggal Daftar</th>
                                            <th className="text-center py-4 px-6 text-sm font-medium text-gray-500">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {registrations.data.map((registration) => (
                                            <tr key={registration.id} className="hover:bg-gray-50">
                                                <td className="py-4 px-6">
                                                    <div>
                                                        <p className="font-semibold text-gray-900">{registration.full_name}</p>
                                                        <p className="text-sm text-gray-500">NIK: {registration.nik}</p>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-1 text-sm text-gray-600">
                                                            <Mail className="w-3 h-3" />
                                                            {registration.email}
                                                        </div>
                                                        <div className="flex items-center gap-1 text-sm text-gray-600">
                                                            <Phone className="w-3 h-3" />
                                                            {registration.phone}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span className="px-3 py-1 bg-orange-100 text-orange-700 text-sm rounded-md font-mono">
                                                        {registration.ticket_number}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6">
                                                    {registration.is_checked_in ? (
                                                        <div>
                                                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                                                                <CheckSquare className="w-3 h-3" />
                                                                Sudah Check-in
                                                            </span>
                                                            {registration.check_in_time && (
                                                                <p className="text-xs text-gray-500 mt-1">
                                                                    {new Date(registration.check_in_time).toLocaleString('id-ID')}
                                                                </p>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-700">
                                                            <Clock className="w-3 h-3" />
                                                            Belum Check-in
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-4 px-6 text-sm text-gray-500">
                                                    {new Date(registration.created_at).toLocaleString('id-ID')}
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <Link
                                                            href={`/admin/registrations/${registration.id}`}
                                                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                                            title="Lihat Detail"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </Link>
                                                        {!registration.is_checked_in && (
                                                            <button
                                                                onClick={() => handleDelete(registration.id)}
                                                                className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                                                title="Hapus Registrasi"
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
                            {registrations.last_page > 1 && (
                                <div className="px-6 py-4 border-t border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-gray-500">
                                            Menampilkan {((registrations.current_page - 1) * registrations.per_page) + 1} sampai{' '}
                                            {Math.min(registrations.current_page * registrations.per_page, registrations.total)} dari{' '}
                                            {registrations.total} data
                                        </div>
                                        <div className="flex gap-1">
                                            {registrations.links.map((link, index) => {
                                                if (link.url === null) {
                                                    return (
                                                        <span
                                                            key={`disabled-${link.label}-${index}`}
                                                            className="px-3 py-2 text-gray-400 cursor-not-allowed"
                                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                                        />
                                                    );
                                                }

                                                return (
                                                    <Link
                                                        key={`link-${link.url}-${link.label}-${index}`}
                                                        href={link.url}
                                                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                            link.active
                                                                ? 'bg-orange-500 text-white'
                                                                : 'text-gray-700 hover:bg-gray-100'
                                                        }`}
                                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                                    />
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Belum Ada Peserta</h3>
                            <p className="text-gray-500">
                                {filters.search || filters.status
                                    ? 'Tidak ada peserta yang sesuai dengan filter yang dipilih.'
                                    : 'Belum ada peserta yang mendaftar untuk event ini.'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
