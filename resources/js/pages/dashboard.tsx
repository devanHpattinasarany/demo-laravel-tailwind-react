import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Calendar, Users, CheckSquare, TrendingUp, Plus, Download, BarChart3 } from 'lucide-react';

interface DashboardProps {
    statistics: {
        totalSeminars: number;
        totalRegistrations: number;
        totalCheckIns: number;
        activeSeminars: number;
    };
    recentActivities: Array<{
        id: number;
        type: 'registration' | 'checkin';
        participant_name: string;
        event_title: string;
        created_at: string;
    }>;
    upcomingSeminars: Array<{
        id: number;
        title: string;
        date: string;
        registration_count: number;
        max_capacity: number;
    }>;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard({ statistics, recentActivities, upcomingSeminars }: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Festival Tahuri Admin Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6 overflow-x-auto">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent">
                            Admin Dashboard
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Kelola acara Festival Tahuri dengan mudah
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Link
                            href="/admin/seminars/create"
                            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Buat Talkshow
                        </Link>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid auto-rows-min gap-6 md:grid-cols-4">
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-orange-700 font-medium text-sm">Total Talkshow</p>
                                <p className="text-3xl font-bold text-orange-900">{statistics.totalSeminars}</p>
                                <p className="text-orange-600 text-sm">{statistics.activeSeminars} aktif</p>
                            </div>
                            <div className="p-3 bg-orange-500 rounded-xl">
                                <Calendar className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-700 font-medium text-sm">Total Registrasi</p>
                                <p className="text-3xl font-bold text-blue-900">{statistics.totalRegistrations}</p>
                                <p className="text-blue-600 text-sm">Semua talkshow</p>
                            </div>
                            <div className="p-3 bg-blue-500 rounded-xl">
                                <Users className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-700 font-medium text-sm">Check-in</p>
                                <p className="text-3xl font-bold text-green-900">{statistics.totalCheckIns}</p>
                                <p className="text-green-600 text-sm">Hadir</p>
                            </div>
                            <div className="p-3 bg-green-500 rounded-xl">
                                <CheckSquare className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-700 font-medium text-sm">Tingkat Hadir</p>
                                <p className="text-3xl font-bold text-purple-900">
                                    {statistics.totalRegistrations > 0 
                                        ? Math.round((statistics.totalCheckIns / statistics.totalRegistrations) * 100)
                                        : 0
                                    }%
                                </p>
                                <p className="text-purple-600 text-sm">Rata-rata</p>
                            </div>
                            <div className="p-3 bg-purple-500 rounded-xl">
                                <TrendingUp className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Upcoming Events */}
                    <div className="bg-white/80 backdrop-blur-sm border border-orange-100 rounded-xl hover:border-orange-200 transition-all duration-300 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-semibold text-gray-900">Talkshow Mendatang</h3>
                            <Link 
                                href="/admin/seminars"
                                className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                            >
                                Lihat Semua
                            </Link>
                        </div>
                        <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                            {upcomingSeminars.length > 0 ? upcomingSeminars.map((seminar) => (
                                <div key={seminar.id} className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-100">
                                    <div>
                                        <h4 className="font-medium text-gray-900">{seminar.title}</h4>
                                        <p className="text-sm text-gray-600">{new Date(seminar.date).toLocaleDateString('id-ID', { 
                                            weekday: 'long', 
                                            year: 'numeric', 
                                            month: 'long', 
                                            day: 'numeric' 
                                        })}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-orange-700">
                                            {seminar.registration_count}/{seminar.max_capacity}
                                        </p>
                                        <p className="text-xs text-gray-500">Terdaftar</p>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-8 text-gray-500">
                                    <Calendar className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                                    <p>Tidak ada talkshow mendatang</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recent Activities */}
                    <div className="bg-white/80 backdrop-blur-sm border border-orange-100 rounded-xl hover:border-orange-200 transition-all duration-300 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-semibold text-gray-900">Aktivitas Terbaru</h3>
                            <Link 
                                href="/admin/registrations"
                                className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                            >
                                Lihat Semua
                            </Link>
                        </div>
                        <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                            {recentActivities.length > 0 ? recentActivities.map((activity) => (
                                <div key={activity.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                    <div className={`p-2 rounded-full ${
                                        activity.type === 'registration' 
                                            ? 'bg-blue-100 text-blue-600' 
                                            : 'bg-green-100 text-green-600'
                                    }`}>
                                        {activity.type === 'registration' ? (
                                            <Users className="w-4 h-4" />
                                        ) : (
                                            <CheckSquare className="w-4 h-4" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900">
                                            {activity.participant_name}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {activity.type === 'registration' ? 'Mendaftar' : 'Check-in'} - {activity.event_title}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {new Date(activity.created_at).toLocaleString('id-ID')}
                                        </p>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-8 text-gray-500">
                                    <BarChart3 className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                                    <p>Belum ada aktivitas</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-gradient-to-r from-orange-50 via-background to-red-50 border border-orange-200 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Aksi Cepat</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <Link
                            href="/admin/seminars/create"
                            className="p-4 bg-white border border-orange-200 rounded-lg hover:border-orange-300 hover:shadow-md transition-all duration-200 text-center group"
                        >
                            <Plus className="w-8 h-8 text-orange-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                            <p className="font-medium text-gray-900">Buat Talkshow Baru</p>
                        </Link>
                        
                        <Link
                            href="/admin/registrations"
                            className="p-4 bg-white border border-orange-200 rounded-lg hover:border-orange-300 hover:shadow-md transition-all duration-200 text-center group"
                        >
                            <Users className="w-8 h-8 text-blue-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                            <p className="font-medium text-gray-900">Kelola Registrasi</p>
                        </Link>
                        
                        <Link
                            href="/admin/checkin"
                            className="p-4 bg-white border border-green-200 rounded-lg hover:border-green-300 hover:shadow-md transition-all duration-200 text-center group"
                        >
                            <CheckSquare className="w-8 h-8 text-green-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                            <p className="font-medium text-gray-900">Check-in System</p>
                        </Link>
                        
                        {/* QR Scanner check-in feature (commented for future implementation) */}
                        {/*
                        <Link
                            href="/admin/checkin"
                            className="p-4 bg-white border border-orange-200 rounded-lg hover:border-orange-300 hover:shadow-md transition-all duration-200 text-center group"
                        >
                            <CheckSquare className="w-8 h-8 text-green-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                            <p className="font-medium text-gray-900">Check-in Peserta</p>
                        </Link>
                        */}
                        
                        {/* Advanced features (commented for future implementation) */}
                        {/*
                        <Link
                            href="/admin/reports"
                            className="p-4 bg-white border border-orange-200 rounded-lg hover:border-orange-300 hover:shadow-md transition-all duration-200 text-center group"
                        >
                            <Download className="w-8 h-8 text-blue-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                            <p className="font-medium text-gray-900">Export Data</p>
                        </Link>
                        
                        <Link
                            href="/admin/analytics"
                            className="p-4 bg-white border border-orange-200 rounded-lg hover:border-orange-300 hover:shadow-md transition-all duration-200 text-center group"
                        >
                            <BarChart3 className="w-8 h-8 text-purple-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                            <p className="font-medium text-gray-900">Lihat Analytics</p>
                        </Link>
                        */}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
