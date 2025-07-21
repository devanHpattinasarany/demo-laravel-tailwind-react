import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import {
    Calendar,
    Users,
    MapPin,
    Edit,
    ArrowLeft,
    Clock,
    User,
    FileText,
    CheckSquare,
    Eye,
    Trash2,
    AlertCircle,
    CheckCircle,
    XCircle
} from 'lucide-react';

interface Seminar {
    id: number;
    title: string;
    event_code: string;
    description: string;
    speakers: string;
    date: string;
    time?: string;
    location: string;
    max_capacity: number;
    poster_url?: string;
    status: 'active' | 'inactive';
    registration_count: number;
    check_in_count: number;
    available_slots: number;
    created_at: string;
    updated_at: string;
}

interface Registration {
    id: number;
    full_name: string;
    email: string;
    phone: string;
    ticket_number: string;
    status: string;
    is_checked_in: boolean;
    created_at: string;
}

interface SeminarShowProps {
    seminar: Seminar;
    recentRegistrations: Registration[];
}

export default function SeminarShow({ seminar, recentRegistrations }: SeminarShowProps) {
    // Safety check untuk memastikan seminar data ada
    if (!seminar) {
        return (
            <AppLayout breadcrumbs={[]}>
                <Head title="Error - Festival Tahuri Admin" />
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Talkshow tidak ditemukan</h1>
                        <Link href="/admin/seminars" className="text-orange-600 hover:text-orange-700">
                            Kembali ke Daftar Seminar
                        </Link>
                    </div>
                </div>
            </AppLayout>
        );
    }
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Talkshow Management', href: '/admin/seminars' },
        { title: seminar.title, href: `/admin/seminars/${seminar.id}` },
    ];

    const handleDelete = () => {
        if (confirm('Apakah Anda yakin ingin menghapus Talkshow ini? Tindakan ini tidak dapat dibatalkan.')) {
            router.delete(`/admin/seminars/${seminar.id}`, {
                onSuccess: () => {
                    // Redirect will be handled by the controller
                },
                onError: (errors) => {
                    alert('Gagal menghapus talkshow: ' + (errors.delete || 'Terjadi kesalahan'));
                }
            });
        }
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
            return { color: 'text-red-600 bg-red-50 border-red-200', text: 'PENUH' };
        } else if (percentage >= 80) {
            return { color: 'text-orange-600 bg-orange-50 border-orange-200', text: 'HAMPIR PENUH' };
        }
        return { color: 'text-green-600 bg-green-50 border-green-200', text: 'TERSEDIA' };
    };

    const capacityStatus = getCapacityStatus(seminar.registration_count, seminar.max_capacity);
    const attendanceRate = seminar.registration_count > 0 ? Math.round((seminar.check_in_count / seminar.registration_count) * 100) : 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${seminar.title} - Festival Tahuri Admin`} />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6 overflow-x-auto">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent">
                                {seminar.title}
                            </h1>
                            <span className="px-3 py-1 bg-orange-100 text-orange-700 text-sm rounded-md font-medium">
                                {seminar.event_code}
                            </span>
                            {getStatusBadge(seminar.status)}
                        </div>
                        <p className="text-gray-600 dark:text-gray-400">
                            Detail lengkap talkshow dan data peserta
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Link
                            href="/admin/seminars"
                            className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-lg transition-colors flex items-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Kembali
                        </Link>
                        <Link
                            href={`/admin/seminars/${seminar.id}/edit`}
                            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
                        >
                            <Edit className="w-4 h-4" />
                            Edit Event
                        </Link>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-2xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-700 font-medium text-sm">Total Registrasi</p>
                                <p className="text-3xl font-bold text-blue-900">{seminar.registration_count}</p>
                                <p className="text-blue-600 text-sm">dari {seminar.max_capacity} slot</p>
                            </div>
                            <Users className="w-8 h-8 text-blue-500" />
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-2xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-700 font-medium text-sm">Check-in</p>
                                <p className="text-3xl font-bold text-green-900">{seminar.check_in_count}</p>
                                <p className="text-green-600 text-sm">{attendanceRate}% hadir</p>
                            </div>
                            <CheckSquare className="w-8 h-8 text-green-500" />
                        </div>
                    </div>

                    <div className={`bg-gradient-to-br ${capacityStatus.color.includes('red') ? 'from-red-50 to-red-100 border-red-200' : capacityStatus.color.includes('orange') ? 'from-orange-50 to-orange-100 border-orange-200' : 'from-green-50 to-green-100 border-green-200'} border-2 rounded-2xl p-6`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className={`font-medium text-sm ${capacityStatus.color.split(' ')[0]}`}>Slot Tersisa</p>
                                <p className={`text-3xl font-bold ${capacityStatus.color.split(' ')[0]}`}>{seminar.available_slots}</p>
                                <p className={`text-sm font-medium ${capacityStatus.color.split(' ')[0]}`}>{capacityStatus.text}</p>
                            </div>
                            <AlertCircle className={`w-8 h-8 ${capacityStatus.color.split(' ')[0]}`} />
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-2xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-700 font-medium text-sm">Hari Tersisa</p>
                                <p className="text-3xl font-bold text-purple-900">
                                    {Math.max(0, Math.ceil((new Date(seminar.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))}
                                </p>
                                <p className="text-purple-600 text-sm">hingga talkshow</p>
                            </div>
                            <Calendar className="w-8 h-8 text-purple-500" />
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Event Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Information */}
                        <div className="bg-white/80 backdrop-blur-sm border border-orange-100 rounded-xl p-6">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-orange-500" />
                                Informasi Event
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Deskripsi</label>
                                    <p className="text-gray-900 leading-relaxed">{seminar.description}</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">
                                            <User className="w-4 h-4 inline mr-1" />
                                            Narasumber
                                        </label>
                                        <p className="text-gray-900 font-medium">{seminar.speakers}</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">
                                            <Calendar className="w-4 h-4 inline mr-1" />
                                            Tanggal & Waktu
                                        </label>
                                        <p className="text-gray-900 font-medium">
                                            {new Date(seminar.date).toLocaleDateString('id-ID', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                            {seminar.time && (
                                                <span className="block text-sm text-gray-600">{seminar.time} WIT</span>
                                            )}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">
                                            <MapPin className="w-4 h-4 inline mr-1" />
                                            Lokasi
                                        </label>
                                        <p className="text-gray-900 font-medium">{seminar.location}</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">
                                            <Users className="w-4 h-4 inline mr-1" />
                                            Kapasitas
                                        </label>
                                        <p className="text-gray-900 font-medium">{seminar.max_capacity} peserta</p>
                                    </div>
                                </div>

                                {seminar.poster_url && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">Poster Event</label>
                                        <a
                                            href={seminar.poster_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-orange-600 hover:text-orange-700 underline"
                                        >
                                            Lihat Poster
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Recent Registrations */}
                        <div className="bg-white/80 backdrop-blur-sm border border-orange-100 rounded-xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                                    <Users className="w-5 h-5 text-orange-500" />
                                    Registrasi Terbaru
                                </h3>
                                <Link
                                    href={`/admin/seminars/${seminar.id}/registrations`}
                                    className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                                >
                                    Lihat Semua
                                </Link>
                            </div>

                            {recentRegistrations.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-gray-200">
                                                <th className="text-left py-2 text-sm font-medium text-gray-500">Nama</th>
                                                <th className="text-left py-2 text-sm font-medium text-gray-500">Tiket</th>
                                                <th className="text-left py-2 text-sm font-medium text-gray-500">Status</th>
                                                <th className="text-left py-2 text-sm font-medium text-gray-500">Tanggal</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {recentRegistrations.map((registration) => (
                                                <tr key={registration.id} className="hover:bg-gray-50">
                                                    <td className="py-3">
                                                        <div>
                                                            <p className="font-medium text-gray-900">{registration.full_name}</p>
                                                            <p className="text-sm text-gray-500">{registration.email}</p>
                                                        </div>
                                                    </td>
                                                    <td className="py-3">
                                                        <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded font-mono">
                                                            {registration.ticket_number}
                                                        </span>
                                                    </td>
                                                    <td className="py-3">
                                                        {registration.is_checked_in ? (
                                                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                                <CheckSquare className="w-3 h-3" />
                                                                Check-in
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                                                <Clock className="w-3 h-3" />
                                                                Terdaftar
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="py-3 text-sm text-gray-500">
                                                        {new Date(registration.created_at).toLocaleDateString('id-ID')}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                                    <p className="text-gray-500">Belum ada peserta terdaftar</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Actions Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Actions */}
                        <div className="bg-white/80 backdrop-blur-sm border border-orange-100 rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Aksi Cepat</h3>
                            <div className="space-y-3">
                                <Link
                                    href={`/admin/seminars/${seminar.id}/edit`}
                                    className="w-full flex items-center gap-3 p-3 text-left border border-orange-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors group"
                                >
                                    <Edit className="w-5 h-5 text-orange-500 group-hover:scale-110 transition-transform" />
                                    <div>
                                        <p className="font-medium text-gray-900">Edit talkshow</p>
                                        <p className="text-sm text-gray-500">Ubah detail talkshow</p>
                                    </div>
                                </Link>

                                <Link
                                    href={`/admin/seminars/${seminar.id}/registrations`}
                                    className="w-full flex items-center gap-3 p-3 text-left border border-blue-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors group"
                                >
                                    <Eye className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" />
                                    <div>
                                        <p className="font-medium text-gray-900">Lihat Peserta</p>
                                        <p className="text-sm text-gray-500">Kelola registrasi</p>
                                    </div>
                                </Link>

                                <Link
                                    href={`/admin/checkin?event=${seminar.id}`}
                                    className="w-full flex items-center gap-3 p-3 text-left border border-green-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors group"
                                >
                                    <CheckSquare className="w-5 h-5 text-green-500 group-hover:scale-110 transition-transform" />
                                    <div>
                                        <p className="font-medium text-gray-900">Check-in Peserta</p>
                                        <p className="text-sm text-gray-500">Scan tiket peserta</p>
                                    </div>
                                </Link>

                                <button
                                    onClick={handleDelete}
                                    className="w-full flex items-center gap-3 p-3 text-left border border-red-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-colors group"
                                >
                                    <Trash2 className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform" />
                                    <div>
                                        <p className="font-medium text-gray-900">Hapus Event</p>
                                        <p className="text-sm text-gray-500">Hapus talkshow ini</p>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* talkshow Metadata */}
                        <div className="bg-white/80 backdrop-blur-sm border border-orange-100 rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informasi Sistem</h3>
                            <div className="space-y-3 text-sm">
                                <div>
                                    <span className="text-gray-500">Dibuat:</span>
                                    <p className="font-medium text-gray-900">
                                        {new Date(seminar.created_at).toLocaleString('id-ID')}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-gray-500">Terakhir diubah:</span>
                                    <p className="font-medium text-gray-900">
                                        {new Date(seminar.updated_at).toLocaleString('id-ID')}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-gray-500">Kode Event:</span>
                                    <p className="font-mono font-medium text-orange-700">{seminar.event_code}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
