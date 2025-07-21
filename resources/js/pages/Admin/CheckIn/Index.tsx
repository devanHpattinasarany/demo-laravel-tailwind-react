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

// Optimistic UI interfaces
interface OptimisticRollback {
    id: string;
    registrationId: number;
    originalCheckins: number;
    timestamp: number;
}

interface OptimisticState {
    pending: number;
    rollbacks: OptimisticRollback[];
    animations: {
        [key: string]: 'success' | 'rollback' | null;
    };
}

interface EnhancedStatistics {
    total_events_today: number;
    total_registrations_today: number;
    total_checkins_today: number;
    attendance_rate: number;
    isPending?: boolean;
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
    
    // Make events list reactive for live updates
    const [liveEvents, setLiveEvents] = useState(events);

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

    // Toast notification system
    const [toastNotification, setToastNotification] = useState<{
        id: string;
        type: 'success' | 'error' | 'warning';
        message: string;
        visible: boolean;
        data?: any;
    } | null>(null);

    // Date validation context
    const today = new Date().toISOString().split('T')[0];
    const currentDate = selectedDate || today;

    // Helper function to get date context for display
    const getDateContext = (eventDate: string) => {
        const event = new Date(eventDate);
        const todayDate = new Date(today);
        const tomorrow = new Date(todayDate);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const yesterday = new Date(todayDate);
        yesterday.setDate(yesterday.getDate() - 1);

        if (eventDate === today) {
            return { label: 'Hari Ini', color: 'text-green-600 bg-green-50 border-green-200', canCheckIn: true };
        } else if (eventDate === tomorrow.toISOString().split('T')[0]) {
            return { label: 'Besok', color: 'text-orange-600 bg-orange-50 border-orange-200', canCheckIn: false };
        } else if (eventDate === yesterday.toISOString().split('T')[0]) {
            return { label: 'Kemarin', color: 'text-gray-600 bg-gray-50 border-gray-200', canCheckIn: false };
        } else if (event > todayDate) {
            const daysDiff = Math.ceil((event.getTime() - todayDate.getTime()) / (1000 * 60 * 60 * 24));
            return { 
                label: `${daysDiff} hari lagi`, 
                color: 'text-blue-600 bg-blue-50 border-blue-200', 
                canCheckIn: false 
            };
        } else {
            const daysDiff = Math.ceil((todayDate.getTime() - event.getTime()) / (1000 * 60 * 60 * 24));
            return { 
                label: `${daysDiff} hari lalu`, 
                color: 'text-gray-600 bg-gray-50 border-gray-200', 
                canCheckIn: false 
            };
        }
    };

    // Validate if check-in is allowed for event date
    const validateCheckInDate = (eventDate: string) => {
        return eventDate === today;
    };

    // Toast notification helper functions
    const showToast = (type: 'success' | 'error' | 'warning', message: string, data?: any) => {
        const toastId = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        setToastNotification({
            id: toastId,
            type,
            message,
            visible: true,
            data
        });

        // Auto-hide toast after 4 seconds
        setTimeout(() => {
            setToastNotification(prev => prev ? { ...prev, visible: false } : null);
            
            // Remove from DOM after animation
            setTimeout(() => {
                setToastNotification(null);
            }, 300);
        }, 4000);
    };

    // Update event statistics optimistically
    const updateEventStatistics = (eventId: number, increment: boolean = true) => {
        setLiveEvents(prev => prev.map(event => {
            if (event.id === eventId) {
                const newCheckInCount = increment 
                    ? event.check_in_count + 1 
                    : Math.max(0, event.check_in_count - 1);
                
                const newAttendanceRate = event.registration_count > 0 
                    ? Math.round((newCheckInCount / event.registration_count) * 100 * 10) / 10
                    : 0;

                return {
                    ...event,
                    check_in_count: newCheckInCount,
                    attendance_rate: newAttendanceRate
                };
            }
            return event;
        }));
    };

    // Optimistic UI state management
    const [enhancedStatistics, setEnhancedStatistics] = useState<EnhancedStatistics>({
        ...statistics,
        attendance_rate: statistics.total_registrations_today > 0 
            ? Math.round((statistics.total_checkins_today / statistics.total_registrations_today) * 100)
            : 0,
        isPending: false
    });
    
    const [optimisticState, setOptimisticState] = useState<OptimisticState>({
        pending: 0,
        rollbacks: [],
        animations: {}
    });

    const searchInputRef = useRef<HTMLInputElement>(null);
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const checkInQueueRef = useRef<Set<number>>(new Set());

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

    // Enhanced focus management to prevent cursor loss during suggestions
    const preserveFocus = useCallback(() => {
        // Use requestAnimationFrame to ensure DOM updates are complete
        requestAnimationFrame(() => {
            if (searchInputRef.current && document.activeElement !== searchInputRef.current) {
                const cursorPosition = searchInputRef.current.selectionStart;
                searchInputRef.current.focus();
                if (cursorPosition !== null) {
                    // Use setTimeout to ensure cursor position is set after focus
                    setTimeout(() => {
                        if (searchInputRef.current) {
                            searchInputRef.current.setSelectionRange(cursorPosition, cursorPosition);
                        }
                    }, 0);
                }
            }
        });
    }, []);

    // Prevent focus loss during state updates - improved timing
    useEffect(() => {
        if (!isSearching) {
            // Preserve focus immediately after search completes
            preserveFocus();
        }
    }, [isSearching, preserveFocus]);

    // Additional focus preservation after dropdown updates
    useEffect(() => {
        if (showDropdown && searchResults.length > 0) {
            // Ensure focus stays on input when dropdown appears
            preserveFocus();
        }
    }, [showDropdown, preserveFocus]);

    // Periodic cleanup of expired rollback data
    useEffect(() => {
        const cleanupInterval = setInterval(() => {
            cleanupExpiredRollbacks();
        }, 30000); // Clean up every 30 seconds

        return () => clearInterval(cleanupInterval);
    }, []);

    // Background sync when component mounts to ensure fresh data
    useEffect(() => {
        // Sync enhanced statistics with server data on mount
        setEnhancedStatistics(prev => ({
            ...prev,
            ...statistics,
            attendance_rate: statistics.total_registrations_today > 0 
                ? Math.round((statistics.total_checkins_today / statistics.total_registrations_today) * 100)
                : 0
        }));
    }, [statistics]);

    const handleSearch = async () => {
        console.log('handleSearch called', { searchQuery }); // Debug log

        if (!searchQuery.trim() || searchQuery.length < 2) {
            if (searchQuery.length > 0 && searchQuery.length < 2) {
                showToast('warning', 'Masukkan minimal 2 karakter untuk pencarian');
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
            
            if (!csrfToken) {
                console.warn('CSRF token not found in meta tag');
                showToast('error', 'Session error. Silakan refresh halaman dan coba lagi.');
                return;
            }

            console.log('CSRF Token found:', csrfToken ? 'Yes' : 'No');

            const response = await fetch('/admin/checkin/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
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
                    showToast('warning', `Tidak ditemukan peserta dengan kata kunci "${searchQuery}"`);
                }
            } else {
                console.error('Search failed:', response.status, data);
                
                if (response.status === 419) {
                    showToast('error', 'CSRF token mismatch. Silakan refresh halaman dan login ulang.');
                } else if (response.status === 401) {
                    showToast('error', 'Session expired. Silakan login ulang.');
                } else {
                    showToast('error', data.message || 'Terjadi kesalahan saat mencari peserta');
                }
            }
        } catch (error) {
            console.error('Search error:', error);
            showToast('error', 'Terjadi kesalahan koneksi. Silakan coba lagi.');
        } finally {
            setIsSearching(false);
        }
    };

    // Enhanced smart check-in logic with date validation
    const handleSmartCheckIn = async (results: Registration[]) => {
        if (results.length === 1) {
            const registration = results[0];

            // Auto check-in for exact ticket number match
            const isExactTicketMatch = registration.ticket_number.toLowerCase() === searchQuery.toLowerCase();

            if (isExactTicketMatch && !registration.is_checked_in) {
                // Check if event is scheduled for today
                const canCheckIn = validateCheckInDate(registration.event_date);
                
                if (!canCheckIn) {
                    const dateContext = getDateContext(registration.event_date);
                    showToast('warning', `Event "${registration.event_title}" dijadwalkan untuk ${dateContext.label.toLowerCase()}, tidak dapat check-in hari ini.`);
                    return;
                }

                console.log('Auto check-in for exact ticket match:', registration.ticket_number);
                await performCheckIn(registration.id);
                return;
            }
        }
    };

    // Optimistic UI utility functions
    const generateRollbackId = (): string => {
        return `rollback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    };

    const calculateAttendanceRate = (checkins: number, registrations: number): number => {
        return registrations > 0 ? Math.round((checkins / registrations) * 100) : 0;
    };

    const performOptimisticCheckIn = (registrationId: number): string => {
        const rollbackId = generateRollbackId();
        
        // Backup current state for potential rollback
        const currentStats = { ...enhancedStatistics };
        
        // Optimistically update statistics immediately
        const newCheckins = currentStats.total_checkins_today + 1;
        const newAttendanceRate = calculateAttendanceRate(newCheckins, currentStats.total_registrations_today);
        
        setEnhancedStatistics(prev => ({
            ...prev,
            total_checkins_today: newCheckins,
            attendance_rate: newAttendanceRate,
            isPending: true
        }));

        // Update optimistic state tracking
        setOptimisticState(prev => ({
            pending: prev.pending + 1,
            rollbacks: [...prev.rollbacks, {
                id: rollbackId,
                registrationId,
                originalCheckins: currentStats.total_checkins_today,
                timestamp: Date.now()
            }],
            animations: {
                ...prev.animations,
                [rollbackId]: 'success'
            }
        }));

        // Trigger success animation
        triggerStatisticsAnimation('success');
        
        console.log('Optimistic update applied:', {
            rollbackId,
            newCheckins,
            newAttendanceRate,
            registrationId
        });
        
        return rollbackId;
    };

    const rollbackOptimisticUpdate = (rollbackId: string): void => {
        const rollbackData = optimisticState.rollbacks.find(r => r.id === rollbackId);
        
        if (rollbackData) {
            // Restore original statistics
            const originalAttendanceRate = calculateAttendanceRate(
                rollbackData.originalCheckins,
                enhancedStatistics.total_registrations_today
            );
            
            setEnhancedStatistics(prev => ({
                ...prev,
                total_checkins_today: rollbackData.originalCheckins,
                attendance_rate: originalAttendanceRate,
                isPending: optimisticState.pending > 1 // Still pending if other updates exist
            }));

            // Clean up optimistic state
            setOptimisticState(prev => ({
                pending: Math.max(0, prev.pending - 1),
                rollbacks: prev.rollbacks.filter(r => r.id !== rollbackId),
                animations: {
                    ...prev.animations,
                    [rollbackId]: 'rollback'
                }
            }));

            // Trigger rollback animation
            triggerStatisticsAnimation('rollback');
            
            console.log('Rollback applied:', {
                rollbackId,
                restoredCheckins: rollbackData.originalCheckins,
                restoredAttendanceRate: originalAttendanceRate
            });
            
            // Clear rollback animation after delay
            setTimeout(() => {
                setOptimisticState(prev => ({
                    ...prev,
                    animations: {
                        ...prev.animations,
                        [rollbackId]: null
                    }
                }));
            }, 1000);
        } else {
            console.warn('Rollback data not found for ID:', rollbackId);
        }
    };

    const commitOptimisticUpdate = (rollbackId: string): void => {
        const rollbackData = optimisticState.rollbacks.find(r => r.id === rollbackId);
        
        // Remove from pending and rollbacks
        setOptimisticState(prev => ({
            pending: Math.max(0, prev.pending - 1),
            rollbacks: prev.rollbacks.filter(r => r.id !== rollbackId),
            animations: {
                ...prev.animations,
                [rollbackId]: null
            }
        }));

        // Update isPending status if no more pending updates  
        setEnhancedStatistics(prev => {
            const newPendingCount = Math.max(0, optimisticState.pending - 1);
            const updatedStats = {
                ...prev,
                isPending: newPendingCount > 0
            };
            
            console.log('Optimistic update committed:', {
                rollbackId,
                rollbackData,
                newPendingCount,
                updatedStats
            });
            
            return updatedStats;
        });
    };

    const triggerStatisticsAnimation = (type: 'success' | 'rollback'): void => {
        // Add animation class to trigger CSS animation
        const statsElements = document.querySelectorAll('.stats-card');
        statsElements.forEach(element => {
            element.classList.remove('animate-success', 'animate-rollback');
            element.classList.add(`animate-${type}`);
            
            // Remove animation class after animation completes
            setTimeout(() => {
                element.classList.remove(`animate-${type}`);
            }, 600);
        });
    };

    // Background sync for data consistency - IMPROVED VERSION
    const scheduleBackgroundSync = (): void => {
        // Schedule immediate sync after successful check-in to refresh statistics
        setTimeout(() => {
            console.log('Starting background sync...', { pendingUpdates: optimisticState.pending });
            
            // Fetch fresh statistics directly from the server
            fetch('/admin/checkin', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.props && data.props.statistics) {
                    const freshStats = data.props.statistics;
                    console.log('Fresh statistics received:', freshStats);
                    
                    // Update enhanced statistics with fresh server data
                    setEnhancedStatistics(prev => ({
                        ...prev,
                        ...freshStats,
                        attendance_rate: freshStats.total_registrations_today > 0 
                            ? Math.round((freshStats.total_checkins_today / freshStats.total_registrations_today) * 100)
                            : 0,
                        isPending: false
                    }));
                    
                    console.log('Background sync completed successfully');
                }
            })
            .catch(error => {
                console.error('Background sync failed:', error);
                // Fallback to Inertia reload if direct fetch fails
                router.reload({ 
                    only: ['statistics'], 
                    preserveState: true,
                    preserveScroll: true,
                    onSuccess: (page) => {
                        console.log('Fallback background sync completed');
                        const freshStats = (page.props as any)?.statistics;
                        if (freshStats) {
                            setEnhancedStatistics(prev => ({
                                ...prev,
                                ...freshStats,
                                attendance_rate: freshStats.total_registrations_today > 0 
                                    ? Math.round((freshStats.total_checkins_today / freshStats.total_registrations_today) * 100)
                                    : 0,
                                isPending: false
                            }));
                        }
                    }
                });
            });
        }, 2000); // Reduced to 2 seconds for faster sync
    };

    // Cleanup expired rollback data (prevent memory leaks)
    const cleanupExpiredRollbacks = (): void => {
        const now = Date.now();
        const maxAge = 60000; // 1 minute

        setOptimisticState(prev => ({
            ...prev,
            rollbacks: prev.rollbacks.filter(rollback => 
                (now - rollback.timestamp) < maxAge
            )
        }));
    };

    // Enhanced check-in logic with date validation and optimistic UI
    const performCheckIn = async (registrationId: number) => {
        // Prevent multiple rapid check-ins for same registration
        if (checkInQueueRef.current.has(registrationId)) {
            console.warn('Check-in already in progress for registration:', registrationId);
            return;
        }

        // Find the registration to validate date
        const registration = searchResults.find(r => r.id === registrationId);
        if (registration) {
            const canCheckIn = validateCheckInDate(registration.event_date);
            if (!canCheckIn) {
                const dateContext = getDateContext(registration.event_date);
                showToast('warning', `Event "${registration.event_title}" dijadwalkan untuk ${dateContext.label.toLowerCase()}, tidak dapat check-in hari ini.`);
                return;
            }
        }

        // Add to processing queue
        checkInQueueRef.current.add(registrationId);
        setCheckInStatus({ type: null, message: '' });

        // STEP 1: Perform optimistic update immediately
        const rollbackId = performOptimisticCheckIn(registrationId);

        try {
            // STEP 2: Sync with server with timeout handling
            const csrfToken = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content;
            
            if (!csrfToken) {
                console.warn('CSRF token not found in meta tag for check-in');
                rollbackOptimisticUpdate(rollbackId);
                setCheckInStatus({
                    type: 'error',
                    message: 'Session expired. Silakan refresh halaman dan coba lagi.'
                });
                return;
            }

            console.log('Check-in CSRF Token found:', csrfToken ? 'Yes' : 'No');

            // Create timeout promise
            const timeoutPromise = new Promise<never>((_, reject) =>
                setTimeout(() => reject(new Error('Request timeout')), 10000)
            );

            // Create fetch promise
            const fetchPromise = fetch('/admin/checkin/check-in', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify({
                    registration_id: registrationId,
                }),
            });

            // Race between fetch and timeout
            const response = await Promise.race([fetchPromise, timeoutPromise]);
            const data = await response.json();
            console.log('Check-in response:', data);

            if (response.ok) {
                // STEP 3: Success - commit the optimistic update
                commitOptimisticUpdate(rollbackId);

                // Show toast notification instead of status message
                showToast('success', `${data.data.participant_name} berhasil check-in! 🎉`, {
                    participant_name: data.data.participant_name,
                    ticket_number: data.data.ticket_number,
                    event_title: data.data.event_title
                });

                // Update search results to reflect check-in status
                setSearchResults(prev => prev.map(reg =>
                    reg.id === registrationId
                        ? { ...reg, is_checked_in: true, check_in_time: data.data.check_in_time }
                        : reg
                ));

                // Update event statistics for the specific event
                if (registration) {
                    const eventFromList = liveEvents.find(e => e.title === registration.event_title);
                    if (eventFromList) {
                        updateEventStatistics(eventFromList.id, true);
                    }
                }

                // IMMEDIATE statistics refresh - ensure real-time update
                console.log('Check-in successful, refreshing statistics...');
                
                // Manual statistics update to ensure real-time feedback
                setTimeout(() => {
                    setEnhancedStatistics(prev => {
                        // Verify the optimistic update was correct and finalize it
                        const finalStats = {
                            ...prev,
                            isPending: false
                        };
                        console.log('Final statistics after check-in:', finalStats);
                        return finalStats;
                    });
                }, 500);

                // Schedule background sync for data consistency
                scheduleBackgroundSync();

                // Clear search after successful check-in
                setTimeout(() => {
                    setSearchQuery('');
                    setSearchResults([]);
                    setShowDropdown(false);
                    setSelectedIndex(-1);
                    searchInputRef.current?.focus();
                }, 3000);
            } else {
                // STEP 4: Server error - rollback optimistic update
                rollbackOptimisticUpdate(rollbackId);
                
                console.error('Check-in failed:', response.status, data);
                
                if (response.status === 419) {
                    showToast('error', 'CSRF token mismatch. Silakan refresh halaman dan login ulang.');
                } else if (response.status === 401) {
                    showToast('error', 'Session expired. Silakan login ulang.');
                } else {
                    showToast('error', data.message || 'Gagal melakukan check-in');
                }
            }
        } catch (error) {
            // STEP 5: Network/timeout error - rollback optimistic update
            console.error('Check-in error:', error);
            rollbackOptimisticUpdate(rollbackId);
            
            const isTimeout = error instanceof Error && error.message === 'Request timeout';
            showToast('error', isTimeout 
                ? 'Koneksi timeout. Check-in dibatalkan, silakan coba lagi.'
                : 'Terjadi kesalahan koneksi. Silakan coba lagi.'
            );
        } finally {
            // STEP 6: Always cleanup from processing queue
            checkInQueueRef.current.delete(registrationId);
            console.log('Check-in completed for registration:', registrationId);
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
                        // Date validation will be handled inside performCheckIn
                        performCheckIn(selectedRegistration.id);
                    }
                } else if (searchResults.length === 1 && !searchResults[0].is_checked_in) {
                    // Date validation will be handled inside performCheckIn
                    performCheckIn(searchResults[0].id);
                }
                break;
            case 'Escape':
                e.preventDefault();
                setSearchQuery('');
                setSearchResults([]);
                setShowDropdown(false);
                setSelectedIndex(-1);
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

    // Use enhanced statistics for overall attendance rate (with optimistic updates)
    const overallAttendanceRate = enhancedStatistics.attendance_rate;

    // Debug helpers (can be removed in production)
    const debugOptimisticState = () => {
        if (process.env.NODE_ENV === 'development') {
            console.log('=== OPTIMISTIC UI DEBUG ===');
            console.log('Enhanced Statistics:', enhancedStatistics);
            console.log('Optimistic State:', optimisticState);
            console.log('Pending Updates:', optimisticState.pending);
            console.log('Rollback Queue:', optimisticState.rollbacks);
            console.log('========================');
        }
    };

    // Testing helper functions (development only)
    const simulateNetworkDelay = (ms: number = 2000) => {
        if (process.env.NODE_ENV === 'development') {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        return Promise.resolve();
    };

    // Expose debug functions to window for manual testing
    useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
            (window as any).debugCheckIn = {
                debugOptimisticState,
                enhancedStatistics,
                optimisticState,
                performOptimisticCheckIn,
                rollbackOptimisticUpdate,
                commitOptimisticUpdate,
            };
        }
    }, [enhancedStatistics, optimisticState]);

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
                            Kelola check-in peserta untuk semua talkshow
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

                                {/* Enhanced Dropdown Suggestions with Date Context */}
                                {showDropdown && searchResults.length > 0 && (
                                    <div ref={dropdownRef} className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                        {searchResults.map((registration, index) => {
                                            const dateContext = getDateContext(registration.event_date);
                                            const canCheckIn = dateContext.canCheckIn;
                                            return (
                                                <div
                                                    key={registration.id}
                                                    className={`p-3 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors ${
                                                        index === selectedIndex 
                                                            ? canCheckIn ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'
                                                            : canCheckIn ? 'hover:bg-green-50' : 'hover:bg-orange-50'
                                                    }`}
                                                    onClick={() => {
                                                        if (!registration.is_checked_in && canCheckIn) {
                                                            performCheckIn(registration.id);
                                                        } else if (!canCheckIn) {
                                                            showToast('warning', `Event "${registration.event_title}" dijadwalkan untuk ${dateContext.label.toLowerCase()}, tidak dapat check-in hari ini.`);
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
                                                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                                                                <span>{registration.event_title}</span>
                                                                <span className={`px-2 py-1 text-xs rounded border font-medium ${dateContext.color}`}>
                                                                    📅 {dateContext.label}
                                                                </span>
                                                            </div>
                                                            {registration.event_time && (
                                                                <div className="text-xs text-gray-500">
                                                                    🕐 {registration.event_time} WIT
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="ml-3">
                                                            {registration.is_checked_in ? (
                                                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded font-medium">
                                                                    ✅ Sudah Check-in
                                                                </span>
                                                            ) : canCheckIn ? (
                                                                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded font-medium">
                                                                    ⏳ Klik untuk Check-in
                                                                </span>
                                                            ) : (
                                                                <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded font-medium">
                                                                    ⚠️ Bukan Hari Ini
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
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

                    {/* Toast Notification - Fixed Position */}
                    {toastNotification && (
                        <div className={`fixed top-4 right-4 z-50 max-w-md p-4 border rounded-lg shadow-lg transition-all duration-300 transform ${
                            toastNotification.visible ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
                        } ${getStatusColor(toastNotification.type)}`}>
                            <div className="flex items-start gap-3">
                                <span className="text-lg">{getStatusIcon(toastNotification.type)}</span>
                                <div className="min-w-0 flex-1">
                                    <p className="font-medium">{toastNotification.message}</p>
                                    {toastNotification.data && (
                                        <div className="text-sm mt-1 space-y-1">
                                            <p><strong>{toastNotification.data.participant_name}</strong> - {toastNotification.data.ticket_number}</p>
                                            <p className="text-xs opacity-75">Event: {toastNotification.data.event_title}</p>
                                        </div>
                                    )}
                                </div>
                                {toastNotification.type === 'success' && (
                                    <div className="text-2xl animate-bounce">🎉</div>
                                )}
                                <button
                                    onClick={() => setToastNotification(prev => prev ? { ...prev, visible: false } : null)}
                                    className="text-gray-400 hover:text-gray-600 ml-2"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    )}

                </div>

                {/* Enhanced Statistics Cards with Optimistic UI */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Talkshow Hari Ini - Static */}
                    <div className="stats-card bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-2xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-700 font-medium text-sm">Talkshow Hari Ini</p>
                                <p className="text-3xl font-bold text-blue-900">{enhancedStatistics.total_events_today}</p>
                                <p className="text-blue-600 text-sm">Total talkshow</p>
                            </div>
                            <Calendar className="w-8 h-8 text-blue-500" />
                        </div>
                    </div>

                    {/* Registrasi Hari Ini - Static */}
                    <div className="stats-card bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 rounded-2xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-orange-700 font-medium text-sm">Registrasi Hari Ini</p>
                                <p className="text-3xl font-bold text-orange-900">{enhancedStatistics.total_registrations_today}</p>
                                <p className="text-orange-600 text-sm">Total peserta</p>
                            </div>
                            <Users className="w-8 h-8 text-orange-500" />
                        </div>
                    </div>

                    {/* Check-in Hari Ini - Dynamic with Optimistic UI */}
                    <div className={`stats-card bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-2xl p-6 transition-all duration-300 ${
                        enhancedStatistics.isPending ? 'stats-pending animate-pending' : ''
                    }`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-700 font-medium text-sm">Check-in Hari Ini</p>
                                <div className="flex items-center gap-2">
                                    <p className="text-3xl font-bold text-green-900">{enhancedStatistics.total_checkins_today}</p>
                                    {enhancedStatistics.isPending && (
                                        <div className="success-indicator text-green-600">
                                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <p className="text-green-600 text-sm">Sudah hadir</p>
                                    {optimisticState.pending > 0 && (
                                        <span className="px-2 py-1 bg-green-200 text-green-800 text-xs rounded-full font-medium">
                                            +{optimisticState.pending} pending
                                        </span>
                                    )}
                                </div>
                            </div>
                            <CheckSquare className={`w-8 h-8 text-green-500 transition-all duration-300 ${
                                enhancedStatistics.isPending ? 'scale-110' : ''
                            }`} />
                        </div>
                    </div>

                    {/* Tingkat Kehadiran - Dynamic with Optimistic UI */}
                    <div className={`stats-card bg-gradient-to-br border-2 rounded-2xl p-6 transition-all duration-300 ${
                        getAttendanceColor(enhancedStatistics.attendance_rate)
                    } ${enhancedStatistics.isPending ? 'stats-pending animate-pending' : ''}`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-sm">Tingkat Kehadiran</p>
                                <div className="flex items-center gap-2">
                                    <p className="text-3xl font-bold">{enhancedStatistics.attendance_rate}%</p>
                                    {enhancedStatistics.isPending && (
                                        <div className="success-indicator">
                                            <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
                                        </div>
                                    )}
                                </div>
                                <p className="text-sm">
                                    {enhancedStatistics.isPending ? 'Memperbarui...' : 'Rata-rata hari ini'}
                                </p>
                            </div>
                            <TrendingUp className={`w-8 h-8 transition-all duration-300 ${
                                enhancedStatistics.isPending ? 'scale-110' : ''
                            }`} />
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

                    {liveEvents.length > 0 ? (
                        <div className="grid gap-4 p-4 sm:p-6 max-h-96 overflow-y-auto">
                            {liveEvents.map((event) => (
                                <div key={event.id} className="border border-gray-200 rounded-lg p-4 sm:p-6 hover:border-orange-200 hover:bg-orange-50/30 transition-all duration-300">
                                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                                        <div className="flex-1">
                                            {/* Mobile-optimized title section */}
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
                                                <h4 className="text-lg sm:text-xl font-semibold text-gray-900 break-words">{event.title}</h4>
                                                <div className="flex items-center gap-2">
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
                                            </div>

                                            {/* Mobile-friendly info grid */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 mb-4">
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Clock className="w-4 h-4 flex-shrink-0" />
                                                    <span className="truncate">{event.time ? `${event.time} WIT` : 'Waktu belum ditentukan'}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <MapPin className="w-4 h-4 flex-shrink-0" />
                                                    <span className="truncate">{event.location}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-600 sm:col-span-2 lg:col-span-1">
                                                    <Users className="w-4 h-4 flex-shrink-0" />
                                                    <span>{event.registration_count} peserta terdaftar</span>
                                                </div>
                                            </div>

                                            {/* Mobile-optimized attendance statistics */}
                                            <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4">
                                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 sm:p-3">
                                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                                        <span className="text-xs sm:text-sm text-blue-700 font-medium">Terdaftar</span>
                                                        <span className="text-lg sm:text-xl font-bold text-blue-900">{event.registration_count}</span>
                                                    </div>
                                                </div>
                                                <div className="bg-green-50 border border-green-200 rounded-lg p-2 sm:p-3">
                                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                                        <span className="text-xs sm:text-sm text-green-700 font-medium">Check-in</span>
                                                        <span className="text-lg sm:text-xl font-bold text-green-900">{event.check_in_count}</span>
                                                    </div>
                                                </div>
                                                <div className={`border rounded-lg p-2 sm:p-3 ${getAttendanceColor(event.attendance_rate)}`}>
                                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                                        <span className="text-xs sm:text-sm font-medium">Hadir</span>
                                                        <span className="text-lg sm:text-xl font-bold">{event.attendance_rate}%</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Mobile-optimized action buttons */}
                                        <div className="flex flex-row lg:flex-col gap-2 lg:ml-6 w-full lg:w-auto">
                                            <Link
                                                href={`/admin/registrations?event_id=${event.id}`}
                                                className="flex-1 lg:flex-none px-3 sm:px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-xs sm:text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                                            >
                                                <CheckSquare className="w-4 h-4" />
                                                <span className="hidden sm:inline">Check-in Manual</span>
                                                <span className="sm:hidden">Check-in</span>
                                            </Link>

                                            <Link
                                                href={`/admin/seminars/${event.id}`}
                                                className="flex-1 lg:flex-none px-3 sm:px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs sm:text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                                            >
                                                <BarChart3 className="w-4 h-4" />
                                                <span className="hidden sm:inline">Detail Event</span>
                                                <span className="sm:hidden">Detail</span>
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
