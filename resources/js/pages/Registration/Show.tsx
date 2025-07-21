import React from 'react';
import { Head, Link } from '@inertiajs/react';
import HomeLayout from '@/layouts/home-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Ticket, 
  Download, 
  Share2,
  ArrowLeft,
  User,
  Phone,
  Mail,
  Star,
  CheckCircle
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

interface RegistrationShowProps {
  registration: Registration;
}

export default function RegistrationShow({ registration }: RegistrationShowProps) {
  // Safe data extraction
  const ticketNumber = registration?.ticket_number || 'Unknown';
  const fullName = registration?.full_name || 'Unknown';
  const phone = registration?.phone || 'Unknown';
  const email = registration?.email || 'Unknown';
  
  const eventTitle = registration?.event?.title || 'Event';
  const eventDate = registration?.event?.date || '';
  const eventTime = registration?.event?.time || 'Unknown';
  const eventLocation = registration?.event?.location || 'Unknown';
  const eventId = registration?.event?.id || 1;

  // Safe title construction
  const pageTitle = `Tiket ${ticketNumber} - ${eventTitle}`;

  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return 'Tanggal belum tersedia';
      return new Date(dateString).toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Format tanggal tidak valid';
    }
  };

  const formatTime = (timeString: string) => {
    return timeString + ' WIB';
  };

  const handleDownload = () => {
    if (!registration) return;
    
    // Create download URL for PDF
    const pdfUrl = `/registrations/${registration.id}/pdf`;
    
    // Create a temporary anchor element and trigger download
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `E-Ticket_${ticketNumber}_${eventTitle.replace(/\s+/g, '_')}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Tiket ${eventTitle}`,
        text: `Saya telah terdaftar untuk event ${eventTitle}!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link tiket telah disalin ke clipboard!');
    }
  };

  return (
    <HomeLayout>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={`E-Ticket untuk ${eventTitle} - ${fullName}`} />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-background to-red-50">
        {/* Spacing for transparent navbar */}
        <div className="h-16 sm:h-20"></div>
        
        {/* Breadcrumb Navigation - Festival Tahuri Style */}
        <div className="bg-white/95 backdrop-blur-sm border-b border-gray-100">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex items-center space-x-2 text-sm">
              <Link 
                href="/" 
                className="text-orange-600 hover:text-orange-800 font-medium transition-colors duration-200 flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Beranda
              </Link>
              <span className="text-gray-400">/</span>
              <Link 
                href={`/seminars/${eventId}`}
                className="text-orange-600 hover:text-orange-800 font-medium transition-colors duration-200"
              >
                Event Detail
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 font-medium">E-Ticket</span>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-4xl mx-auto">
            
            {/* Success Message - Festival Tahuri Hero Style */}
            <div className="text-center space-y-4 mb-12">
              <div className="inline-flex">
                <Badge className="px-4 py-2 text-sm bg-green-100 text-green-800 border border-green-200">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Pendaftaran Berhasil
                </Badge>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold">
                Selamat
                <span className="bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent"> Terdaftar!</span>
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                Anda telah berhasil terdaftar untuk <strong>{eventTitle}</strong>. 
                Simpan tiket ini dan tunjukkan saat check-in di lokasi event.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 mb-12">
              <Button
                onClick={handleDownload}
                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Download className="w-5 h-5 mr-2" />
                Download PDF
              </Button>
              <Button
                onClick={handleShare}
                variant="outline"
                className="border-2 border-orange-300 text-orange-700 hover:bg-orange-50 font-semibold rounded-lg transition-colors"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Bagikan
              </Button>
            </div>

            {/* Main Ticket Card - Festival Tahuri Card Style */}
            <Card className="group bg-white rounded-2xl border-2 border-orange-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
              
              {/* Ticket Header */}
              <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-center py-8">
                <div className="space-y-4">
                  <Ticket className="w-16 h-16 mx-auto text-white/90" />
                  <CardTitle className="text-3xl font-bold">E-Ticket</CardTitle>
                  <p className="text-orange-100 text-lg font-medium">Festival Tahuri 2025</p>
                  <Badge className="bg-white/20 backdrop-blur-sm text-white border border-white/30 px-6 py-2 text-lg font-bold tracking-widest">
                    {ticketNumber}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-8 space-y-8">
                
                {/* Event Information */}
                <div className="text-center space-y-6">
                  <h2 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent leading-tight">
                    {eventTitle}
                  </h2>
                  
                  {/* Event Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                      <div className="text-center space-y-3">
                        <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto">
                          <Calendar className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-orange-600 font-medium uppercase tracking-wide">Tanggal</p>
                          <p className="font-bold text-gray-900">{formatDate(eventDate)}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                      <div className="text-center space-y-3">
                        <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto">
                          <Clock className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-orange-600 font-medium uppercase tracking-wide">Waktu</p>
                          <p className="font-bold text-gray-900">{formatTime(eventTime)}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 md:col-span-1">
                      <div className="text-center space-y-3">
                        <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto">
                          <MapPin className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-red-600 font-medium uppercase tracking-wide">Lokasi</p>
                          <p className="font-bold text-gray-900 text-sm leading-relaxed">{eventLocation}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Divider with Festival Tahuri style */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t-2 border-dashed border-orange-200"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <div className="bg-orange-50 px-6 py-2 rounded-full">
                      <Star className="w-5 h-5 text-orange-500" />
                    </div>
                  </div>
                </div>

                {/* Participant Information */}
                <div className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 rounded-2xl p-8">
                  <h3 className="text-xl font-bold text-center mb-6 bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent">
                    Informasi Peserta
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <User className="w-5 h-5 text-orange-600" />
                        <div>
                          <p className="text-sm text-gray-500 font-medium">Nama Lengkap</p>
                          <p className="font-bold text-gray-900">{fullName}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-orange-600" />
                        <div>
                          <p className="text-sm text-gray-500 font-medium">Nomor Telepon</p>
                          <p className="font-bold text-gray-900">{phone}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-orange-600" />
                        <div>
                          <p className="text-sm text-gray-500 font-medium">Email</p>
                          <p className="font-bold text-gray-900">{email}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Ticket className="w-5 h-5 text-red-600" />
                        <div>
                          <p className="text-sm text-gray-500 font-medium">Nomor Tiket</p>
                          <p className="font-bold text-red-600 text-lg tracking-widest">{ticketNumber}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Important Notes - Festival Tahuri Glass Card Style */}
            <Card className="bg-white/80 backdrop-blur-sm border border-orange-100 rounded-xl hover:border-orange-200 transition-all duration-300 mt-8">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-red-600 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6" />
                  Catatan Penting
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-gray-700">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-orange-600 font-bold text-sm">1</span>
                    </div>
                    <p>Simpan tiket ini dengan baik dan tunjukkan saat check-in di lokasi event</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-orange-600 font-bold text-sm">2</span>
                    </div>
                    <p>Datang 30 menit sebelum acara dimulai untuk proses check-in</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-orange-600 font-bold text-sm">3</span>
                    </div>
                    <p>Bawa identitas asli (KTP) yang sesuai dengan data pendaftaran</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-orange-600 font-bold text-sm">4</span>
                    </div>
                    <p>Tiket tidak dapat dipindahtangankan kepada orang lain</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Footer Actions */}
            <div className="text-center mt-12 space-y-6">
              <p className="text-muted-foreground">
                Ada pertanyaan atau butuh bantuan?
              </p>
              <div className="flex justify-center gap-4">
                <Link href="/">
                  <Button 
                    variant="outline" 
                    className="border-2 border-orange-300 text-orange-700 hover:bg-orange-50 font-semibold rounded-lg transition-colors"
                  >
                    Lihat Event Lainnya
                  </Button>
                </Link>
                <a href="mailto:support@tahuri.id">
                  <Button 
                    variant="outline" 
                    className="border-2 border-orange-300 text-orange-700 hover:bg-orange-50 font-semibold rounded-lg transition-colors"
                  >
                    Hubungi Support
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </HomeLayout>
  );
}