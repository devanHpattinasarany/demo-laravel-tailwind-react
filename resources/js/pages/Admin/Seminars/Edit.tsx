import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { Save, ArrowLeft, Calendar, MapPin, Users, Clock, User, FileText, Image, Trash2 } from 'lucide-react';

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
}

interface EditSeminarProps {
    seminar: Seminar;
}

export default function EditSeminar({ seminar }: EditSeminarProps) {
    // Safety check untuk memastikan seminar data ada
    if (!seminar) {
        return (
            <AppLayout breadcrumbs={[]}>
                <Head title="Error - Festival Tahuri Admin" />
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Seminar tidak ditemukan</h1>
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
        { title: 'Seminar Management', href: '/admin/seminars' },
        { title: seminar.title, href: `/admin/seminars/${seminar.id}` },
        { title: 'Edit', href: `/admin/seminars/${seminar.id}/edit` },
    ];

    const { data, setData, put, processing, errors } = useForm({
        title: seminar.title,
        description: seminar.description,
        speakers: seminar.speakers,
        date: seminar.date,
        time: seminar.time || '',
        location: seminar.location,
        max_capacity: seminar.max_capacity,
        poster_url: seminar.poster_url || '',
        status: seminar.status,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/seminars/${seminar.id}`);
    };

    const handleDelete = () => {
        if (confirm('Apakah Anda yakin ingin menghapus seminar ini? Tindakan ini tidak dapat dibatalkan.')) {
            router.delete(`/admin/seminars/${seminar.id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${seminar.title} - Festival Tahuri Admin`} />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6 overflow-x-auto">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent">
                            Edit Event
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Perbarui informasi seminar "{seminar.title}"
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Link
                            href={`/admin/seminars/${seminar.id}`}
                            className="px-4 py-2 border-2 border-orange-300 text-orange-700 hover:bg-orange-50 font-semibold rounded-lg transition-colors flex items-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Kembali
                        </Link>
                        <button
                            onClick={handleDelete}
                            className="px-4 py-2 border-2 border-red-300 text-red-700 hover:bg-red-50 font-semibold rounded-lg transition-colors flex items-center gap-2"
                        >
                            <Trash2 className="w-4 h-4" />
                            Hapus Event
                        </button>
                    </div>
                </div>

                {/* Event Code Display */}
                <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-4">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">Kode Event:</span>
                        <span className="px-3 py-1 bg-orange-100 text-orange-700 font-mono font-semibold rounded-md">
                            {seminar.event_code}
                        </span>
                        <span className="text-sm text-gray-500">(tidak dapat diubah)</span>
                    </div>
                </div>

                {/* Form */}
                <div className="bg-white/80 backdrop-blur-sm border border-orange-100 rounded-xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Basic Information */}
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-orange-500" />
                                Informasi Dasar
                            </h2>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="lg:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nama Event *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                        placeholder="Contoh: Seminar Financial Planner"
                                        required
                                    />
                                    {errors.title && (
                                        <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                                    )}
                                </div>

                                <div className="lg:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Deskripsi Event *
                                    </label>
                                    <textarea
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        rows={4}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                        placeholder="Jelaskan deskripsi lengkap tentang seminar ini..."
                                        required
                                    />
                                    {errors.description && (
                                        <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                                    )}
                                </div>

                                <div className="lg:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <User className="w-4 h-4 inline mr-2" />
                                        Narasumber *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.speakers}
                                        onChange={(e) => setData('speakers', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                        placeholder="Contoh: Ligwina Hananto, Risyad Baya'sud"
                                        required
                                    />
                                    {errors.speakers && (
                                        <p className="mt-1 text-sm text-red-600">{errors.speakers}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Date & Time */}
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-orange-500" />
                                Waktu & Tempat
                            </h2>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tanggal Event *
                                    </label>
                                    <input
                                        type="date"
                                        value={data.date}
                                        onChange={(e) => setData('date', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                        required
                                    />
                                    {errors.date && (
                                        <p className="mt-1 text-sm text-red-600">{errors.date}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <Clock className="w-4 h-4 inline mr-2" />
                                        Waktu Mulai *
                                    </label>
                                    <input
                                        type="time"
                                        value={data.time}
                                        onChange={(e) => setData('time', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                        required
                                    />
                                    {errors.time && (
                                        <p className="mt-1 text-sm text-red-600">{errors.time}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <Users className="w-4 h-4 inline mr-2" />
                                        Kapasitas Maksimal *
                                    </label>
                                    <input
                                        type="number"
                                        value={data.max_capacity}
                                        onChange={(e) => {
                                            const value = parseInt(e.target.value);
                                            setData('max_capacity', isNaN(value) ? 0 : value);
                                        }}
                                        min="1"
                                        max="1000"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                        required
                                    />
                                    {errors.max_capacity && (
                                        <p className="mt-1 text-sm text-red-600">{errors.max_capacity}</p>
                                    )}
                                    <p className="mt-1 text-sm text-gray-500">
                                        Saat ini ada peserta terdaftar, pastikan kapasitas tidak kurang dari jumlah peserta.
                                    </p>
                                </div>

                                <div className="lg:col-span-3">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <MapPin className="w-4 h-4 inline mr-2" />
                                        Lokasi Event *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.location}
                                        onChange={(e) => setData('location', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                        required
                                    />
                                    {errors.location && (
                                        <p className="mt-1 text-sm text-red-600">{errors.location}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Additional Settings */}
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Image className="w-5 h-5 text-orange-500" />
                                Pengaturan Tambahan
                            </h2>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        URL Poster (Opsional)
                                    </label>
                                    <input
                                        type="url"
                                        value={data.poster_url}
                                        onChange={(e) => setData('poster_url', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                        placeholder="https://example.com/poster.jpg"
                                    />
                                    {errors.poster_url && (
                                        <p className="mt-1 text-sm text-red-600">{errors.poster_url}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Status Event *
                                    </label>
                                    <select
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value as 'active' | 'inactive')}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                        required
                                    >
                                        <option value="active">Aktif</option>
                                        <option value="inactive">Tidak Aktif</option>
                                    </select>
                                    {errors.status && (
                                        <p className="mt-1 text-sm text-red-600">{errors.status}</p>
                                    )}
                                    <p className="mt-1 text-sm text-gray-500">
                                        Event tidak aktif tidak akan muncul di halaman publik.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                            <Link
                                href={`/admin/seminars/${seminar.id}`}
                                className="px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-lg transition-colors"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Save className="w-4 h-4" />
                                {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Important Notes */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-yellow-800 mb-3">⚠️ Peringatan Penting</h3>
                    <div className="space-y-2 text-sm text-yellow-700">
                        <p>• Kode seminar tidak dapat diubah setelah seminar dibuat</p>
                        <p>• Kapasitas tidak boleh kurang dari jumlah peserta yang sudah terdaftar</p>
                        <p>• Mengubah tanggal seminar dapat mempengaruhi jadwal peserta</p>
                        <p>• Event yang di-nonaktifkan tidak akan muncul di halaman publik</p>
                        <p>• Menghapus seminar hanya bisa dilakukan jika belum ada peserta terdaftar</p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}