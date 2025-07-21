import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, UserCheck, Calendar, MapPin, Users } from 'lucide-react';

interface Seminar {
    id: number;
    title: string;
    event_code: string;
    date: string;
    time: string;
    location: string;
    max_capacity: number;
    registration_count: number;
    available_slots: number;
    is_full: boolean;
}

interface RegistrationFormProps {
    seminar: Seminar;
    onSuccess?: (registration: unknown) => void;
    onCancel?: () => void;
}

interface RegistrationData {
    full_name: string;
    nik: string;
    phone: string;
    email: string;
}

interface RegistrationErrors {
    full_name?: string;
    nik?: string;
    phone?: string;
    email?: string;
    general?: string;
}

export default function RegistrationForm({ seminar, onSuccess, onCancel }: RegistrationFormProps) {
    const { data, setData: setFormData, post, processing, errors } = useForm({
        full_name: '',
        nik: '',
        phone: '',
        email: '',
    });

    const [isSubmitted, setIsSubmitted] = useState(false);
    const formErrors = errors as RegistrationErrors;
    
    const setData = (key: keyof RegistrationData, value: string) => {
        setFormData(key, value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        post(route('seminars.register', seminar.id), {
            onSuccess: (response) => {
                setIsSubmitted(true);
                if (onSuccess) {
                    onSuccess(response);
                }
            },
            onError: () => {
                // Errors are handled by the errors object from useForm
            }
        });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (timeString: string) => {
        return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (isSubmitted) {
        return (
            <Card className="max-w-md mx-auto">
                <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <UserCheck className="w-8 h-8 text-green-600" />
                    </div>
                    <CardTitle className="text-green-700">Pendaftaran Berhasil!</CardTitle>
                    <CardDescription>
                        Anda telah berhasil mendaftar untuk talkshow ini. Tiket akan dikirim melalui email.
                    </CardDescription>
                </CardHeader>
            </Card>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Event Summary */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Daftar Talkshow</CardTitle>
                    <CardDescription>
                        Lengkapi formulir di bawah untuk mendaftar ke talkshow ini
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <h3 className="font-semibold text-lg bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent">
                            {seminar.title}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>{formatDate(seminar.date)} • {formatTime(seminar.time)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                <span>{seminar.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                <span>{seminar.available_slots} slot tersisa dari {seminar.max_capacity}</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Registration Form */}
            <Card>
                <CardHeader>
                    <CardTitle>Informasi Pendaftar</CardTitle>
                    <CardDescription>
                        Pastikan data yang Anda masukkan sudah benar karena akan digunakan untuk verifikasi saat check-in
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {seminar.is_full && (
                        <Alert className="mb-6 border-red-200 bg-red-50">
                            <AlertDescription className="text-red-700">
                                Maaf, talkshow ini sudah penuh. Tidak ada slot pendaftaran yang tersisa.
                            </AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="full_name">Nama Lengkap *</Label>
                            <Input
                                id="full_name"
                                type="text"
                                value={data.full_name}
                                onChange={(e) => setData('full_name', e.target.value)}
                                placeholder="Masukkan nama lengkap sesuai KTP"
                                disabled={processing || seminar.is_full}
                                className={formErrors.full_name ? 'border-red-500' : ''}
                            />
                            {formErrors.full_name && (
                                <p className="text-sm text-red-500">{formErrors.full_name}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="nik">NIK (Nomor Induk Kependudukan) *</Label>
                            <Input
                                id="nik"
                                type="text"
                                value={data.nik}
                                onChange={(e) => setData('nik', e.target.value)}
                                placeholder="16 digit NIK sesuai KTP"
                                maxLength={16}
                                disabled={processing || seminar.is_full}
                                className={formErrors.nik ? 'border-red-500' : ''}
                            />
                            {formErrors.nik && (
                                <p className="text-sm text-red-500">{formErrors.nik}</p>
                            )}
                            <p className="text-xs text-gray-500">
                                NIK hanya dapat digunakan untuk satu pendaftaran talkshow
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Nomor Telepon/WhatsApp *</Label>
                            <Input
                                id="phone"
                                type="tel"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                placeholder="Contoh: 081234567890"
                                disabled={processing || seminar.is_full}
                                className={formErrors.phone ? 'border-red-500' : ''}
                            />
                            {formErrors.phone && (
                                <p className="text-sm text-red-500">{formErrors.phone}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email *</Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="contoh@email.com"
                                disabled={processing || seminar.is_full}
                                className={formErrors.email ? 'border-red-500' : ''}
                            />
                            {formErrors.email && (
                                <p className="text-sm text-red-500">{formErrors.email}</p>
                            )}
                            <p className="text-xs text-gray-500">
                                Tiket akan dikirim ke email ini
                            </p>
                        </div>

                        {/* Global Error Messages */}
                        {formErrors.general && (
                            <Alert className="border-red-200 bg-red-50">
                                <AlertDescription className="text-red-700">
                                    {formErrors.general}
                                </AlertDescription>
                            </Alert>
                        )}

                        <div className="flex gap-3 pt-4">
                            {onCancel && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onCancel}
                                    disabled={processing}
                                    className="flex-1"
                                >
                                    Batal
                                </Button>
                            )}
                            <Button
                                type="submit"
                                disabled={processing || seminar.is_full}
                                className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                            >
                                {processing ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Mendaftar...
                                    </>
                                ) : (
                                    'Daftar Sekarang'
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}