import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Ticket, 
  Download, 
  Share2,
  QrCode,
  User,
  Phone,
  Mail
} from 'lucide-react';

interface Event {
  id: number;
  title: string;
  event_code: string;
  date: string;
  time: string;
  location: string;
  poster_url: string;
}

interface Registration {
  id: number;
  full_name: string;
  nik: string;
  phone: string;
  email: string;
  ticket_number: string;
  registration_date: string;
  status: string;
  event: Event;
}

interface TicketDisplayProps {
  registration: Registration;
  onDownload?: () => void;
  onShare?: () => void;
}

export default function TicketDisplay({ registration, onDownload, onShare }: TicketDisplayProps) {
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

  const formatRegistrationDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Ticket Card */}
      <Card className="overflow-hidden bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white pb-8">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold mb-2">E-Ticket</CardTitle>
              <p className="text-orange-100">Festival Tahuri 2025</p>
            </div>
            <div className="text-right">
              <Badge className="bg-white/20 backdrop-blur-sm text-white border border-white/30 px-3 py-1 mb-2">
                {registration.status === 'active' ? 'Valid' : 'Inactive'}
              </Badge>
              <p className="text-lg font-bold">{registration.ticket_number}</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Event Info Section */}
          <div className="p-6 bg-white">
            <h3 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent mb-6">
              {registration.event.title}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-orange-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Tanggal Event</p>
                    <p className="font-semibold text-gray-900">{formatDate(registration.event.date)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-orange-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Waktu</p>
                    <p className="font-semibold text-gray-900">{formatTime(registration.event.time)} WIB</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Lokasi</p>
                    <p className="font-semibold text-gray-900 text-sm leading-relaxed">{registration.event.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Ticket className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Terdaftar</p>
                    <p className="font-semibold text-gray-900">{formatRegistrationDate(registration.registration_date)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-dashed border-orange-200"></div>
            </div>
            <div className="relative flex justify-center">
              <div className="bg-orange-50 px-6 py-2">
                <span className="text-sm text-orange-600 font-medium">Informasi Peserta</span>
              </div>
            </div>
          </div>

          {/* Participant Info Section */}
          <div className="p-6 bg-gradient-to-br from-orange-50 to-red-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-orange-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Nama Lengkap</p>
                    <p className="font-semibold text-gray-900">{registration.full_name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-orange-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Nomor Telepon</p>
                    <p className="font-semibold text-gray-900">{registration.phone}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-orange-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-semibold text-gray-900">{registration.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <QrCode className="w-5 h-5 text-orange-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Nomor Tiket</p>
                    <p className="font-bold text-orange-700 text-lg">{registration.ticket_number}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="p-6 bg-white border-t border-orange-200">
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <QrCode className="w-16 h-16 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500">
                QR Code untuk check-in akan ditampilkan saat mendekati tanggal event
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-6 bg-gradient-to-r from-orange-500 to-red-500">
            <div className="flex gap-3">
              {onDownload && (
                <Button 
                  onClick={onDownload}
                  variant="secondary"
                  className="flex-1 bg-white text-orange-600 hover:bg-orange-50 font-semibold"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              )}
              {onShare && (
                <Button 
                  onClick={onShare}
                  variant="secondary"
                  className="flex-1 bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30 font-semibold"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Bagikan
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Important Notes */}
      <Card className="mt-6">
        <CardContent className="p-6">
          <h4 className="font-bold text-gray-900 mb-4">Catatan Penting:</h4>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>Simpan tiket ini dengan baik dan tunjukkan saat check-in di lokasi event</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>Datang 30 menit sebelum acara dimulai untuk proses check-in</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>Bawa identitas asli (KTP) yang sesuai dengan data pendaftaran</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>Tiket tidak dapat dipindahtangankan kepada orang lain</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}