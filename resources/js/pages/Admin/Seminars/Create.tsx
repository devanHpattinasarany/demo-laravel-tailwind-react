import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Save, ArrowLeft, Calendar, MapPin, Users, Clock, User, FileText, Image } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Seminar Management', href: '/admin/seminars' },
    { title: 'Buat Seminar Baru', href: '/admin/seminars/create' },
];

export default function CreateSeminar() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        speakers: '',
        date: '',
        time: '',
        location: 'Taman Budaya Maluku, Ambon',
        max_capacity: 500,
        poster_url: '',
        status: 'active',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/seminars');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Buat Seminar Baru - Festival Tahuri Admin" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6 overflow-x-auto">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent">
                            Buat Seminar Baru
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Isi form di bawah untuk membuat seminar Festival Tahuri
                        </p>
                    </div>
                    <Link
                        href="/admin/seminars"
                        className="px-4 py-2 border-2 border-orange-300 text-orange-700 hover:bg-orange-50 font-semibold rounded-lg transition-colors flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Kembali
                    </Link>
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
                                        Nama Seminar *
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
                                        Deskripsi Seminar *
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
                                        Tanggal Seminar *
                                    </label>
                                    <input
                                        type="date"
                                        value={data.date}
                                        onChange={(e) => setData('date', e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
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
                                </div>

                                <div className="lg:col-span-3">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <MapPin className="w-4 h-4 inline mr-2" />
                                        Lokasi Seminar *
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
                                        Status Seminar *
                                    </label>
                                    <select
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                        required
                                    >
                                        <option value="active">Aktif</option>
                                        <option value="inactive">Tidak Aktif</option>
                                    </select>
                                    {errors.status && (
                                        <p className="mt-1 text-sm text-red-600">{errors.status}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                            <Link
                                href="/admin/seminars"
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
                                {processing ? 'Menyimpan...' : 'Simpan Seminar'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Helper Information */}
                <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Tips Membuat Seminar</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                        <div>
                            <h4 className="font-medium text-orange-700 mb-2">Nama Seminar</h4>
                            <p>Gunakan nama yang jelas dan menarik. Kode seminar akan dibuat otomatis berdasarkan nama.</p>
                        </div>
                        <div>
                            <h4 className="font-medium text-orange-700 mb-2">Kapasitas</h4>
                            <p>Sesuaikan dengan ukuran venue. Standar untuk seminar adalah 500 peserta.</p>
                        </div>
                        <div>
                            <h4 className="font-medium text-orange-700 mb-2">Narasumber</h4>
                            <p>Tuliskan nama lengkap narasumber, pisahkan dengan koma jika lebih dari satu.</p>
                        </div>
                        <div>
                            <h4 className="font-medium text-orange-700 mb-2">Lokasi</h4>
                            <p>Berikan alamat yang lengkap dan mudah ditemukan peserta.</p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}