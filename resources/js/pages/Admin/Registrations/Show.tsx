import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { 
    ArrowLeft,
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Clock,
    CheckSquare,
    Download,
    QrCode,
    Ticket,
    CreditCard
} from 'lucide-react';

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
        time?: string;
        location: string;
        description?: string;
        speakers?: string;
    };
    check_in?: {
        id: number;
        created_at: string;
    };
}

interface RegistrationShowProps {
    registration: Registration;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Registrations', href: '/admin/registrations' },
    { title: 'Registration Details', href: '#' },
];

export default function RegistrationShow({ registration }: RegistrationShowProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString('id-ID');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Registration: ${registration.full_name} - Festival Tahuri Admin`} />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4 sm:p-6 overflow-x-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/admin/registrations"
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent">
                                Registration Details
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                Detail lengkap registrasi peserta
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex gap-3">
                        <Link
                            href={`/registrations/${registration.id}`}
                            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                        >
                            <Ticket className="w-4 h-4" />
                            View Ticket
                        </Link>
                        <Link
                            href={`/registrations/${registration.id}/pdf`}
                            className="px-4 py-2 border border-orange-300 text-orange-700 hover:bg-orange-50 font-medium rounded-lg transition-colors flex items-center gap-2"
                        >
                            <Download className="w-4 h-4" />
                            Download PDF
                        </Link>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Registration Status */}
                    <div className="lg:col-span-1">
                        <div className="bg-white/80 backdrop-blur-sm border border-orange-100 rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Registrasi</h3>
                            
                            <div className="space-y-4">
                                <div className="text-center">
                                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium ${
                                        registration.check_in 
                                            ? 'bg-green-100 text-green-700 border border-green-200'
                                            : 'bg-orange-100 text-orange-700 border border-orange-200'
                                    }`}>
                                        <CheckSquare className="w-5 h-5" />
                                        {registration.check_in ? 'Sudah Check-in' : 'Belum Check-in'}
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-200">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Ticket Number:</span>
                                        <span className="font-mono font-medium">{registration.ticket_number}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Registered:</span>
                                    <span>{formatDateTime(registration.created_at)}</span>
                                </div>

                                {registration.check_in && (
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Checked In:</span>
                                        <span>{formatDateTime(registration.check_in.created_at)}</span>
                                    </div>
                                )}

                                {/* QR Code placeholder for future implementation */}
                                {/*
                                <div className="pt-4 border-t border-gray-200 text-center">
                                    <div className="w-32 h-32 mx-auto bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                                        <QrCode className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">QR Code for check-in</p>
                                </div>
                                */}
                            </div>
                        </div>
                    </div>

                    {/* Participant Information */}
                    <div className="lg:col-span-2">
                        <div className="space-y-6">
                            {/* Participant Details */}
                            <div className="bg-white/80 backdrop-blur-sm border border-orange-100 rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Informasi Peserta</h3>
                                
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <User className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Nama Lengkap</p>
                                            <p className="font-medium text-gray-900">{registration.full_name}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-purple-100 rounded-lg">
                                            <CreditCard className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">NIK</p>
                                            <p className="font-medium text-gray-900 font-mono">{registration.nik}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-green-100 rounded-lg">
                                            <Mail className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Email</p>
                                            <p className="font-medium text-gray-900">{registration.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-orange-100 rounded-lg">
                                            <Phone className="w-5 h-5 text-orange-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Nomor Telepon</p>
                                            <p className="font-medium text-gray-900">{registration.phone}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Event Information */}
                            <div className="bg-white/80 backdrop-blur-sm border border-orange-100 rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Informasi Event</h3>
                                
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-semibold text-gray-900 text-lg">{registration.event.title}</h4>
                                        <p className="text-orange-600 font-medium">{registration.event.event_code}</p>
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-blue-100 rounded-lg">
                                                <Calendar className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Tanggal</p>
                                                <p className="font-medium text-gray-900">{formatDate(registration.event.date)}</p>
                                            </div>
                                        </div>

                                        {registration.event.time && (
                                            <div className="flex items-start gap-3">
                                                <div className="p-2 bg-purple-100 rounded-lg">
                                                    <Clock className="w-5 h-5 text-purple-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">Waktu</p>
                                                    <p className="font-medium text-gray-900">{registration.event.time} WIT</p>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex items-start gap-3 sm:col-span-2">
                                            <div className="p-2 bg-green-100 rounded-lg">
                                                <MapPin className="w-5 h-5 text-green-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Lokasi</p>
                                                <p className="font-medium text-gray-900">{registration.event.location}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {registration.event.speakers && (
                                        <div className="pt-4 border-t border-gray-200">
                                            <p className="text-sm text-gray-600 mb-2">Narasumber</p>
                                            <p className="font-medium text-gray-900">{registration.event.speakers}</p>
                                        </div>
                                    )}

                                    {registration.event.description && (
                                        <div className="pt-4 border-t border-gray-200">
                                            <p className="text-sm text-gray-600 mb-2">Deskripsi</p>
                                            <p className="text-gray-900">{registration.event.description}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="flex flex-wrap gap-3">
                        <Link
                            href="/admin/checkin"
                            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                        >
                            <CheckSquare className="w-4 h-4" />
                            Go to Check-in System
                        </Link>
                        
                        <Link
                            href={`/admin/seminars/${registration.event.id}`}
                            className="px-4 py-2 border border-orange-300 text-orange-700 hover:bg-orange-50 font-medium rounded-lg transition-colors flex items-center gap-2"
                        >
                            <Calendar className="w-4 h-4" />
                            View Event Details
                        </Link>

                        {/* Advanced actions commented for future implementation */}
                        {/*
                        <button className="px-4 py-2 border border-blue-300 text-blue-700 hover:bg-blue-50 font-medium rounded-lg transition-colors flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            Send Email
                        </button>
                        
                        <button className="px-4 py-2 border border-purple-300 text-purple-700 hover:bg-purple-50 font-medium rounded-lg transition-colors flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            Send SMS
                        </button>
                        */}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}