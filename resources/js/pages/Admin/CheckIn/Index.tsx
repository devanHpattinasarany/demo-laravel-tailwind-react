import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import {
    CheckSquare,
    Users,
    Calendar,
    QrCode,
    TrendingUp,
    Clock,
    MapPin,
    FileText,
    BarChart3,
    Search
} from 'lucide-react';
import { useState, useRef, useEffect, useCallback } from 'react';

interface Event {
    id: number;
    title: string;
    event_code: string;
    date: string;
    time?: string;
    location: string;
    status: string;
    registration_count: number;
    check_in_count: number;
    attendance_rate: number;
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
    is_checked_in: boolean;
    check_in_time?: string;
}

interface CheckInIndexProps {
    events: Event[];
    filters: {
        status?: string;
        date?: string;
    };
    statistics: {
        total_events_today: number;
        total_registrations_today: number;
        total_checkins_today: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Check-in System', href: '/admin/checkin' },
];

export default function CheckInIndex({ events, filters, statistics }: CheckInIndexProps) {
    const [selectedDate, setSelectedDate] = useState(filters.date || new Date().toISOString().split('T')[0]);
    const [statusFilter, setStatusFilter] = useState(filters.status || '');

    // Check-in functionality
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Registration[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [checkInStatus, setCheckInStatus] = useState<{
        type: 'success' | 'error' | 'warning' | null;
        message: string;
        data?: any;
    }>({ type: null, message: '' });

    const searchInputRef = useRef<HTMLInputElement>(null);
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Auto-search dengan debounce dan preserve focus
    useEffect(() => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        if (searchQuery.trim().length >= 2) {
            searchTimeoutRef.current = setTimeout(() => {
                handleSearch();
            }, 300);
        } else if (searchQuery.trim().length === 0) {
            setSearchResults([]);
            setShowDropdown(false);
            setSelectedIndex(-1);
            setCheckInStatus({ type: null, message: '' });
        }

        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [searchQuery]);

    // Focus management
    const preserveFocus = useCallback(() => {
        // Preserve cursor position and focus after updates
        if (searchInputRef.current && document.activeElement !== searchInputRef.current) {
            const cursorPosition = searchInputRef.current.selectionStart;
            searchInputRef.current.focus();
            if (cursorPosition !== null) {
                searchInputRef.current.setSelectionRange(cursorPosition, cursorPosition);
            }
        }
    }, []);

    // Preserve focus after search results update
    useEffect(() => {
        if (!isSearching && searchResults.length > 0) {
            preserveFocus();
        }
    }, [searchResults, isSearching, preserveFocus]);

    const handleSearch = async () => {
        console.log('handleSearch called', { searchQuery }); // Debug log

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
        setShowDropdown(false);
        setSelectedIndex(-1);
        setCheckInStatus({ type: null, message: '' });

        try {
            const csrfToken = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content;

            const response = await fetch('/admin/checkin/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken || '',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    query: searchQuery,
                    // Don't filter by event - search across all events for today
                }),
            });

            const data = await response.json();
            console.log('Search response:', data); // Debug log

            if (response.ok) {
                setSearchResults(data.registrations);
                setShowDropdown(data.registrations.length > 0);

                // Smart auto check-in for exact matches
                await handleSmartCheckIn(data.registrations);

                if (data.registrations.length === 0) {
                    setCheckInStatus({
                        type: 'warning',
                        message: `Tidak ditemukan peserta dengan kata kunci "${searchQuery}"`
                    });
                }
            } else {
                setCheckInStatus({
                    type: 'error',
                    message: data.message || 'Terjadi kesalahan saat mencari peserta'
                });
            }
        } catch (error) {
            console.error('Search error:', error);
            setCheckInStatus({
                type: 'error',
                message: 'Terjadi kesalahan koneksi. Silakan coba lagi.'
            });
        } finally {
            setIsSearching(false);
        }
    };

    // Smart check-in logic
    const handleSmartCheckIn = async (results: Registration[]) => {
        if (results.length === 1) {
            const registration = results[0];

            // Auto check-in for exact ticket number match
            const isExactTicketMatch = registration.ticket_number.toLowerCase() === searchQuery.toLowerCase();

            if (isExactTicketMatch && !registration.is_checked_in) {
                console.log('Auto check-in for exact ticket match:', registration.ticket_number);
                await performCheckIn(registration.id);
                return;
            }
        }
    };

    // Separated check-in logic for reusability
    const performCheckIn = async (registrationId: number) => {
        setCheckInStatus({ type: null, message: '' });

        try {
            const csrfToken = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content;

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

            const data = await response.json();
            console.log('Check-in response:', data);

            if (response.ok) {
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
                    setShowDropdown(false);
                    setSelectedIndex(-1);
                    setCheckInStatus({ type: null, message: '' });
                    searchInputRef.current?.focus();
                }, 3000);
            } else {
                setCheckInStatus({
                    type: 'error',
                    message: data.message || 'Gagal melakukan check-in'
                });
            }
        } catch (error) {
            console.error('Check-in error:', error);
            setCheckInStatus({
                type: 'error',
                message: 'Terjadi kesalahan koneksi. Silakan coba lagi.'
            });
        }
    };

    // Keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!showDropdown || searchResults.length === 0) {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleSearch();
            }
            return;
        }

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(prev =>
                    prev < searchResults.length - 1 ? prev + 1 : prev
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(prev => prev > 0 ? prev - 1 : prev);
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedIndex >= 0 && selectedIndex < searchResults.length) {
                    const selectedRegistration = searchResults[selectedIndex];
                    if (!selectedRegistration.is_checked_in) {
                        performCheckIn(selectedRegistration.id);
                    }
                } else if (searchResults.length === 1 && !searchResults[0].is_checked_in) {
                    performCheckIn(searchResults[0].id);
                }
                break;
            case 'Escape':
                e.preventDefault();
                setSearchQuery('');
                setSearchResults([]);
                setShowDropdown(false);
                setSelectedIndex(-1);
                setCheckInStatus({ type: null, message: '' });
                break;
            case 'Tab':
                if (selectedIndex >= 0 && selectedIndex < searchResults.length) {
                    e.preventDefault();
                    const selectedRegistration = searchResults[selectedIndex];
                    setSearchQuery(selectedRegistration.ticket_number);
                    setShowDropdown(false);
                } else if (searchResults.length > 0) {
                    e.preventDefault();
                    setSearchQuery(searchResults[0].ticket_number);
                    setShowDropdown(false);
                }
                break;
        }
    };

    // Handle click outside dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
                searchInputRef.current && !searchInputRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
                setSelectedIndex(-1);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Legacy function name for backward compatibility
    const handleCheckIn = (registrationId: number) => {
        performCheckIn(registrationId);
    };

    const getStatusIcon = (type: string) => {
        switch (type) {
            case 'success': return '✅';
            case 'error': return '❌';
            case 'warning': return '⚠️';
            default: return '';
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

    const handleFilter = () => {
        router.get('/admin/checkin', {
            date: selectedDate,
            status: statusFilter,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const getAttendanceColor = (rate: number) => {
        if (rate >= 80) return 'text-green-600 bg-green-50 border-green-200';
        if (rate >= 60) return 'text-orange-600 bg-orange-50 border-orange-200';
        return 'text-red-600 bg-red-50 border-red-200';
    };

    const overallAttendanceRate = statistics.total_registrations_today > 0
        ? Math.round((statistics.total_checkins_today / statistics.total_registrations_today) * 100)
        : 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Check-in System - Festival Tahuri Admin" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6 overflow-x-auto">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent">
                            Check-in System
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Kelola check-in peserta untuk semua event
                        </p>
                    </div>
                </div>

                {/* Quick Check-in */}
                <div className="bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <CheckSquare className="w-5 h-5 text-green-600" />
                        Check-in Peserta
                    </h3>
                    <div className="relative">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1">
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    placeholder="Ketik nomor tiket (BIFT001T) atau nama peserta..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    disabled={isSearching}
                                    autoComplete="off"
                                />

                                {/* Dropdown Suggestions */}
                                {showDropdown && searchResults.length > 0 && (
                                    <div ref={dropdownRef} className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                        {searchResults.map((registration, index) => (
                                            <div
                                                key={registration.id}
                                                className={`p-3 cursor-pointer border-b border-gray-100 last:border-b-0 hover:bg-green-50 transition-colors ${
                                                    index === selectedIndex ? 'bg-green-50 border-green-200' : ''
                                                }`}
                                                onClick={() => {
                                                    if (!registration.is_checked_in) {
                                                        performCheckIn(registration.id);
                                                    }
                                                    setShowDropdown(false);
                                                }}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="font-semibold text-gray-900">{registration.full_name}</span>
                                                            <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded font-medium">
                                                                {registration.ticket_number}
                                                            </span>
                                                        </div>
                                                        <div className="text-sm text-gray-600">
                                                            {registration.event_title}
                                                        </div>
                                                    </div>
                                                    <div className="ml-3">
                                                        {registration.is_checked_in ? (
                                                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded font-medium">
                                                                ✅ Sudah Check-in
                                                            </span>
                                                        ) : (
                                                            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded font-medium">
                                                                ⏳ Klik untuk Check-in
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={handleSearch}
                                disabled={isSearching || !searchQuery.trim()}
                                className="px-6 py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 min-w-[140px]"
                            >
                                <Search className="w-5 h-5" />
                                {isSearching ? 'Mencari...' : 'Cari & Check-in'}
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 text-sm text-green-700 mt-3">
                        <p>💡 <strong>Tips:</strong></p>
                        <div className="space-y-1 sm:space-y-0 sm:space-x-4 sm:flex">
                            <span>• Ketik nomor tiket lengkap untuk auto check-in</span>
                            <span>• Gunakan ↑↓ untuk navigasi, Enter untuk pilih</span>
                            <span>• Tab untuk auto-complete, Esc untuk batal</span>
                        </div>
                    </div>

                    {/* Status Message */}
                    {checkInStatus.type && (
                        <div className={`flex items-start gap-3 p-4 border rounded-lg mt-4 transition-all duration-300 ${getStatusColor(checkInStatus.type)} ${
                            checkInStatus.type === 'success' ? 'animate-pulse' : ''
                        }`}>
                            <span className="text-lg">{getStatusIcon(checkInStatus.type)}</span>
                            <div className="min-w-0 flex-1">
                                <p className="font-medium">{checkInStatus.message}</p>
                                {checkInStatus.data && (
                                    <div className="text-sm mt-1 space-y-1">
                                        <p><strong>{checkInStatus.data.participant_name}</strong> - {checkInStatus.data.ticket_number}</p>
                                        <p className="text-xs opacity-75">Event: {checkInStatus.data.event_title}</p>
                                    </div>
                                )}
                            </div>
                            {checkInStatus.type === 'success' && (
                                <div className="text-2xl animate-bounce">🎉</div>
                            )}
                        </div>
                    )}

                    {/* Legacy Results (Hidden, keeping for reference) */}
                    {searchResults.length > 0 && !showDropdown && (
                        <div className="mt-4 space-y-3">
                            <h4 className="font-semibold text-gray-900">Hasil Pencarian ({searchResults.length})</h4>
                            {searchResults.map((registration) => (
                                <div key={registration.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                                                <h5 className="font-semibold text-gray-900">{registration.full_name}</h5>
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded font-medium">
                                                        {registration.ticket_number}
                                                    </span>
                                                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded font-medium">
                                                        {registration.event_title}
                                                    </span>
                                                    {registration.is_checked_in ? (
                                                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded font-medium">
                                                            ✅ Sudah Check-in
                                                        </span>
                                                    ) : (
                                                        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded font-medium">
                                                            ⏳ Belum Check-in
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="text-sm text-gray-600 space-y-1">
                                                <div>NIK: {registration.nik}</div>
                                                <div>Telepon: {registration.phone}</div>
                                            </div>
                                        </div>

                                        <div className="flex-shrink-0">
                                            {registration.is_checked_in ? (
                                                <div className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium text-center">
                                                    ✅ Sudah Hadir
                                                    {registration.check_in_time && (
                                                        <div className="text-xs mt-1">
                                                            {new Date(registration.check_in_time).toLocaleString('id-ID')}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => handleCheckIn(registration.id)}
                                                    disabled={isSearching}
                                                    className="w-full sm:w-auto px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors"
                                                >
                                                    ✅ Check-in Sekarang
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-2xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-700 font-medium text-sm">Event Hari Ini</p>
                                <p className="text-3xl font-bold text-blue-900">{statistics.total_events_today}</p>
                                <p className="text-blue-600 text-sm">Total event</p>
                            </div>
                            <Calendar className="w-8 h-8 text-blue-500" />
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 rounded-2xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-orange-700 font-medium text-sm">Registrasi Hari Ini</p>
                                <p className="text-3xl font-bold text-orange-900">{statistics.total_registrations_today}</p>
                                <p className="text-orange-600 text-sm">Total peserta</p>
                            </div>
                            <Users className="w-8 h-8 text-orange-500" />
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-2xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-700 font-medium text-sm">Check-in Hari Ini</p>
                                <p className="text-3xl font-bold text-green-900">{statistics.total_checkins_today}</p>
                                <p className="text-green-600 text-sm">Sudah hadir</p>
                            </div>
                            <CheckSquare className="w-8 h-8 text-green-500" />
                        </div>
                    </div>

                    <div className={`bg-gradient-to-br border-2 rounded-2xl p-6 ${getAttendanceColor(overallAttendanceRate)}`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-sm">Tingkat Kehadiran</p>
                                <p className="text-3xl font-bold">{overallAttendanceRate}%</p>
                                <p className="text-sm">Rata-rata hari ini</p>
                            </div>
                            <TrendingUp className="w-8 h-8" />
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white/80 backdrop-blur-sm border border-orange-100 rounded-xl p-4 sm:p-6">
                    <div className="flex flex-col gap-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Calendar className="w-4 h-4 inline mr-2" />
                                    Tanggal Event
                                </label>
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    className="w-full px-3 sm:px-4 py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Status Event
                                </label>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="w-full px-3 sm:px-4 py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                >
                                    <option value="">Semua Status</option>
                                    <option value="active">Aktif</option>
                                    <option value="inactive">Tidak Aktif</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                            <button
                                onClick={handleFilter}
                                className="flex-1 sm:flex-none px-4 sm:px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                            >
                                <Search className="w-4 h-4" />
                                <span className="hidden sm:inline">Filter</span>
                                <span className="sm:hidden">Filter</span>
                            </button>

                            <button
                                onClick={() => {
                                    setSelectedDate(new Date().toISOString().split('T')[0]);
                                    setStatusFilter('');
                                    router.get('/admin/checkin');
                                }}
                                className="flex-1 sm:flex-none px-4 sm:px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-lg transition-colors text-sm sm:text-base"
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                </div>

                {/* Events List */}
                <div className="bg-white/80 backdrop-blur-sm border border-orange-100 rounded-xl overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Event pada {new Date(selectedDate).toLocaleDateString('id-ID', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </h3>
                    </div>

                    {events.length > 0 ? (
                        <div className="grid gap-4 p-6 max-h-96 overflow-y-auto">
                            {events.map((event) => (
                                <div key={event.id} className="border border-gray-200 rounded-lg p-6 hover:border-orange-200 hover:bg-orange-50/30 transition-all duration-300">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h4 className="text-xl font-semibold text-gray-900">{event.title}</h4>
                                                <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded font-medium">
                                                    {event.event_code}
                                                </span>
                                                <span className={`px-2 py-1 text-xs rounded font-medium ${
                                                    event.status === 'active'
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-gray-100 text-gray-700'
                                                }`}>
                                                    {event.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Clock className="w-4 h-4" />
                                                    {event.time ? `${event.time} WIT` : 'Waktu belum ditentukan'}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <MapPin className="w-4 h-4" />
                                                    {event.location}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Users className="w-4 h-4" />
                                                    {event.registration_count} peserta terdaftar
                                                </div>
                                            </div>

                                            {/* Attendance Statistics */}
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm text-blue-700">Terdaftar</span>
                                                        <span className="font-semibold text-blue-900">{event.registration_count}</span>
                                                    </div>
                                                </div>
                                                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm text-green-700">Check-in</span>
                                                        <span className="font-semibold text-green-900">{event.check_in_count}</span>
                                                    </div>
                                                </div>
                                                <div className={`border rounded-lg p-3 ${getAttendanceColor(event.attendance_rate)}`}>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm">Tingkat Hadir</span>
                                                        <span className="font-semibold">{event.attendance_rate}%</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex flex-col gap-2 ml-6">
                                            {/* QR Scanner check-in (commented for future implementation) */}
                                            {/*
                                            <Link
                                                href={`/admin/checkin/scanner?event=${event.id}`}
                                                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                                            >
                                                <QrCode className="w-4 h-4" />
                                                Check-in
                                            </Link>
                                            */}

                                            <Link
                                                href={`/admin/registrations?event_id=${event.id}`}
                                                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                                            >
                                                <CheckSquare className="w-4 h-4" />
                                                Check-in Manual
                                            </Link>

                                            <Link
                                                href={`/admin/seminars/${event.id}`}
                                                className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                                            >
                                                <BarChart3 className="w-4 h-4" />
                                                Detail Event
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada event</h3>
                            <p className="text-gray-500 mb-4">
                                Tidak ada event pada tanggal yang dipilih
                            </p>
                            <Link
                                href="/admin/seminars/create"
                                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors"
                            >
                                Buat Talkshow Baru
                            </Link>
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Aksi Cepat Check-in</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* QR Scanner functionality (commented for future implementation) */}
                        {/*
                        <Link
                            href="/admin/checkin/scanner"
                            className="p-4 bg-white border border-green-200 rounded-lg hover:border-green-300 hover:shadow-md transition-all duration-200 text-center group"
                        >
                            <QrCode className="w-8 h-8 text-green-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                            <p className="font-medium text-gray-900">Scanner QR Code</p>
                            <p className="text-sm text-gray-500">Scan tiket peserta</p>
                        </Link>

                        <Link
                            href="/admin/checkin/scanner"
                            className="p-4 bg-white border border-blue-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200 text-center group"
                        >
                            <Search className="w-8 h-8 text-blue-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                            <p className="font-medium text-gray-900">Cari Manual</p>
                            <p className="text-sm text-gray-500">Cari berdasarkan nama/tiket</p>
                        </Link>
                        */}

                        <Link
                            href="/admin/registrations"
                            className="p-4 bg-white border border-blue-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200 text-center group"
                        >
                            <Users className="w-8 h-8 text-blue-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                            <p className="font-medium text-gray-900">Kelola Registrasi</p>
                            <p className="text-sm text-gray-500">Lihat dan kelola peserta</p>
                        </Link>

                        <Link
                            href="/admin/seminars"
                            className="p-4 bg-white border border-orange-200 rounded-lg hover:border-orange-300 hover:shadow-md transition-all duration-200 text-center group"
                        >
                            <FileText className="w-8 h-8 text-orange-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                            <p className="font-medium text-gray-900">Kelola Talkshow</p>
                            <p className="text-sm text-gray-500">Atur Talkshow dan peserta</p>
                        </Link>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
