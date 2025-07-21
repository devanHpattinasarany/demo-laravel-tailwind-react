import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { 
    QrCode, 
    Search, 
    Users, 
    Calendar, 
    MapPin, 
    Clock,
    CheckCircle,
    XCircle,
    ArrowLeft,
    Scan,
    UserCheck,
    AlertCircle,
    Loader
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface Event {
    id: number;
    title: string;
    event_code: string;
    date: string;
    time?: string;
    location: string;
    registration_count: number;
    check_in_count: number;
}

interface Registration {
    id: number;
    ticket_number: string;
    full_name: string;
    nik: string;
    phone: string;
    email: string;
    event_title: string;
    event_code: string;
    event_date: string;
    event_time?: string;
    is_checked_in: boolean;
    check_in_time?: string;
    registration_date: string;
}

interface ScannerProps {
    events: Event[];
    selectedEvent?: Event;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Check-in System', href: '/admin/checkin' },
    { title: 'Scanner Check-in', href: '/admin/checkin/scanner' },
];

export default function Scanner({ events, selectedEvent }: ScannerProps) {
    const [selectedEventId, setSelectedEventId] = useState<string>(selectedEvent?.id?.toString() || '');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Registration[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [scannerMode, setScannerMode] = useState<'qr' | 'manual'>('manual');
    const [checkInStatus, setCheckInStatus] = useState<{
        type: 'success' | 'error' | 'warning' | null;
        message: string;
        data?: any;
    }>({ type: null, message: '' });
    
    const searchInputRef = useRef<HTMLInputElement>(null);
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Auto-search dengan debounce
    useEffect(() => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        if (searchQuery.trim().length >= 2 && selectedEventId) {
            searchTimeoutRef.current = setTimeout(() => {
                handleSearch();
            }, 300); // 300ms delay untuk responsiveness lebih baik
        } else if (searchQuery.trim().length === 0) {
            setSearchResults([]);
            setCheckInStatus({ type: null, message: '' });
        }

        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [searchQuery, selectedEventId]); // Removed handleSearch dependency to fix infinite loop

    const handleEventChange = (eventId: string) => {
        setSelectedEventId(eventId);
        if (eventId) {
            router.get('/admin/checkin/scanner', { event: eventId }, {
                preserveState: true,
                preserveScroll: true,
            });
        }
    };

    const handleSearch = async () => {
        console.log('handleSearch called', { searchQuery, selectedEventId }); // Debug log
        
        if (!selectedEventId) {
            setCheckInStatus({
                type: 'warning',
                message: 'Pilih event terlebih dahulu sebelum melakukan pencarian'
            });
            return;
        }
        
        if (!searchQuery.trim() || searchQuery.length < 2) {
            if (searchQuery.length > 0 && searchQuery.length < 2) {
                setCheckInStatus({
                    type: 'warning',
                    message: 'Masukkan minimal 2 karakter untuk pencarian'
                });
            }
            return;
        }

        setIsSearching(true);
        setSearchResults([]);
        setCheckInStatus({ type: null, message: '' });

        try {
            const csrfToken = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content;
            console.log('CSRF Token:', csrfToken); // Debug log
            
            const response = await fetch('/admin/checkin/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken || '',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    query: searchQuery,
                    event_id: selectedEventId || undefined,
                }),
            });

            console.log('Response status:', response.status); // Debug log

            const data = await response.json();
            console.log('Response data:', data); // Debug log

            if (response.ok) {
                setSearchResults(data.registrations);
                console.log('Search results set:', data.registrations); // Debug log
                if (data.registrations.length === 0) {
                    setCheckInStatus({
                        type: 'warning',
                        message: `Tidak ditemukan peserta dengan kata kunci "${searchQuery}"`
                    });
                }
            } else {
                console.log('Response error:', data); // Debug log
                setCheckInStatus({
                    type: 'error',
                    message: data.message || 'Terjadi kesalahan saat mencari peserta'
                });
            }
        } catch (error) {
            console.error('Search error:', error); // Debug log
            setCheckInStatus({
                type: 'error',
                message: 'Terjadi kesalahan koneksi. Silakan coba lagi.'
            });
        } finally {
            setIsSearching(false);
        }
    };

    const handleCheckIn = async (registrationId: number) => {
        console.log('handleCheckIn called for registration ID:', registrationId); // Debug log
        setCheckInStatus({ type: null, message: '' });

        try {
            const csrfToken = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content;
            console.log('Check-in CSRF Token:', csrfToken); // Debug log
            
            const response = await fetch('/admin/checkin/check-in', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken || '',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    registration_id: registrationId,
                }),
            });

            console.log('Check-in response status:', response.status); // Debug log

            const data = await response.json();
            console.log('Check-in response data:', data); // Debug log

            if (response.ok) {
                console.log('Check-in successful:', data); // Debug log
                setCheckInStatus({
                    type: 'success',
                    message: data.message,
                    data: data.data
                });
                
                // Update search results to reflect check-in status
                setSearchResults(prev => prev.map(reg => 
                    reg.id === registrationId 
                        ? { ...reg, is_checked_in: true, check_in_time: data.data.check_in_time }
                        : reg
                ));
                
                // Clear search after successful check-in
                setTimeout(() => {
                    setSearchQuery('');
                    setSearchResults([]);
                    setCheckInStatus({ type: null, message: '' });
                    searchInputRef.current?.focus();
                }, 3000);
            } else {
                console.log('Check-in error:', data); // Debug log
                setCheckInStatus({
                    type: 'error',
                    message: data.message || 'Gagal melakukan check-in'
                });
            }
        } catch (error) {
            console.error('Check-in error:', error); // Debug log
            setCheckInStatus({
                type: 'error',
                message: 'Terjadi kesalahan koneksi. Silakan coba lagi.'
            });
        }
    };

    const getStatusIcon = (type: string) => {
        switch (type) {
            case 'success': return <CheckCircle className="w-5 h-5" />;
            case 'error': return <XCircle className="w-5 h-5" />;
            case 'warning': return <AlertCircle className="w-5 h-5" />;
            default: return null;
        }
    };

    const getStatusColor = (type: string) => {
        switch (type) {
            case 'success': return 'bg-green-50 border-green-200 text-green-800';
            case 'error': return 'bg-red-50 border-red-200 text-red-800';
            case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
            default: return '';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Scanner Check-in - Festival Tahuri Admin" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6 overflow-x-auto">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent">
                            Scanner Check-in
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm sm:text-base">
                            Scan tiket atau cari manual untuk check-in peserta
                        </p>
                    </div>
                    <Link
                        href="/admin/checkin"
                        className="w-full sm:w-auto px-4 py-3 sm:py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-lg transition-colors flex items-center justify-center sm:justify-start gap-2 text-sm sm:text-base"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Kembali
                    </Link>
                </div>

                {/* Event Selection */}
                <div className="bg-white/80 backdrop-blur-sm border border-orange-100 rounded-xl p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Pilih Event untuk Check-in</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Event
                            </label>
                            <select
                                value={selectedEventId}
                                onChange={(e) => handleEventChange(e.target.value)}
                                className="w-full px-3 sm:px-4 py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            >
                                <option value="">Pilih Event...</option>
                                {events.map((event) => (
                                    <option key={event.id} value={event.id}>
                                        {event.title} - {new Date(event.date).toLocaleDateString('id-ID')}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        {selectedEvent && (
                            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 sm:p-4">
                                <h4 className="font-semibold text-sm sm:text-base text-orange-900 mb-2 leading-tight">{selectedEvent.title}</h4>
                                <div className="space-y-1 text-xs sm:text-sm text-orange-700">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                                        {new Date(selectedEvent.date).toLocaleDateString('id-ID', { 
                                            weekday: 'long', 
                                            year: 'numeric', 
                                            month: 'long', 
                                            day: 'numeric' 
                                        })}
                                    </div>
                                    {selectedEvent.time && (
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                                            {selectedEvent.time} WIT
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                                        {selectedEvent.location}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                                        {selectedEvent.check_in_count}/{selectedEvent.registration_count} check-in
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Scanner Mode Toggle */}
                <div className="bg-white/80 backdrop-blur-sm border border-orange-100 rounded-xl p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 mb-6">
                        <button
                            onClick={() => setScannerMode('qr')}
                            className={`px-4 sm:px-6 py-3 font-medium rounded-lg transition-colors flex items-center justify-center gap-2 text-sm sm:text-base ${
                                scannerMode === 'qr'
                                    ? 'bg-green-500 text-white'
                                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            <QrCode className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span className="hidden sm:inline">Scan QR Code</span>
                            <span className="sm:hidden">QR Code</span>
                        </button>
                        <button
                            onClick={() => setScannerMode('manual')}
                            className={`px-4 sm:px-6 py-3 font-medium rounded-lg transition-colors flex items-center justify-center gap-2 text-sm sm:text-base ${
                                scannerMode === 'manual'
                                    ? 'bg-blue-500 text-white'
                                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span className="hidden sm:inline">Cari Manual</span>
                            <span className="sm:hidden">Manual</span>
                        </button>
                    </div>

                    {scannerMode === 'qr' ? (
                        /* QR Scanner Mode */
                        <div className="text-center py-12">
                            <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl p-8 mb-4">
                                <Scan className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">QR Code Scanner</h3>
                                <p className="text-gray-600 mb-4">
                                    Fitur QR Code Scanner akan tersedia dalam versi selanjutnya
                                </p>
                                <p className="text-sm text-gray-500">
                                    Gunakan mode "Cari Manual" untuk sementara
                                </p>
                            </div>
                        </div>
                    ) : (
                        /* Manual Search Mode */
                        <div>
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Pencarian Manual</h3>
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
                                <div className="flex-1">
                                    <input
                                        ref={searchInputRef}
                                        type="text"
                                        placeholder={selectedEventId 
                                            ? "Ketik nomor tiket, nama, NIK, email, atau telepon (auto-search)..." 
                                            : "Pilih event terlebih dahulu..."
                                        }
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                        className="w-full px-3 sm:px-4 py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                        disabled={isSearching || !selectedEventId}
                                    />
                                </div>
                                <button
                                    onClick={handleSearch}
                                    disabled={isSearching || !searchQuery.trim() || !selectedEventId}
                                    className="w-full sm:w-auto px-4 sm:px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                                >
                                    {isSearching ? (
                                        <Loader className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                                    ) : (
                                        <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                                    )}
                                    <span>{isSearching ? 'Mencari...' : 'Cari Manual'}</span>
                                </button>
                            </div>

                            {/* Status Message */}
                            {checkInStatus.type && (
                                <div className={`flex items-start gap-2 sm:gap-3 p-3 sm:p-4 border rounded-lg mb-6 ${getStatusColor(checkInStatus.type)}`}>
                                    <div className="flex-shrink-0 mt-0.5">
                                        {getStatusIcon(checkInStatus.type)}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="font-medium text-sm sm:text-base leading-tight">{checkInStatus.message}</p>
                                        {checkInStatus.data && (
                                            <p className="text-xs sm:text-sm mt-1 break-words">
                                                {checkInStatus.data.participant_name} - {checkInStatus.data.ticket_number}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Search Results */}
                            {searchResults.length > 0 && (
                                <div className="space-y-4">
                                    <h4 className="font-semibold text-gray-900">Hasil Pencarian ({searchResults.length})</h4>
                                    {searchResults.map((registration) => (
                                        <div key={registration.id} className="border border-gray-200 rounded-lg p-4 hover:border-orange-200 transition-colors">
                                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
                                                        <h5 className="font-semibold text-gray-900 text-base sm:text-lg">{registration.full_name}</h5>
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded font-medium">
                                                                {registration.ticket_number}
                                                            </span>
                                                            {registration.is_checked_in ? (
                                                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded font-medium flex items-center gap-1">
                                                                    <CheckCircle className="w-3 h-3" />
                                                                    Sudah Check-in
                                                                </span>
                                                            ) : (
                                                                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded font-medium">
                                                                    Belum Check-in
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                                                        <div className="break-words">NIK: {registration.nik}</div>
                                                        <div className="break-words">Telepon: {registration.phone}</div>
                                                        <div className="break-words">Email: {registration.email}</div>
                                                        <div className="break-words">Event: {registration.event_title}</div>
                                                    </div>
                                                    
                                                    <div className="text-xs text-gray-500 space-y-1">
                                                        <div>Registrasi: {new Date(registration.registration_date).toLocaleString('id-ID')}</div>
                                                        {registration.is_checked_in && registration.check_in_time && (
                                                            <div>Check-in: {new Date(registration.check_in_time).toLocaleString('id-ID')}</div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex-shrink-0 w-full sm:w-auto">
                                                    {registration.is_checked_in ? (
                                                        <div className="w-full sm:w-auto px-4 py-3 bg-green-100 text-green-700 rounded-lg text-sm font-medium flex items-center justify-center gap-2">
                                                            <UserCheck className="w-4 h-4" />
                                                            Sudah Hadir
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleCheckIn(registration.id)}
                                                            disabled={isSearching}
                                                            className="w-full sm:w-auto px-4 py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                                                        >
                                                            <UserCheck className="w-4 h-4" />
                                                            Check-in Sekarang
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}