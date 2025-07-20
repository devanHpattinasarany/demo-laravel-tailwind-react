import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import HomeLayout from '@/layouts/home-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import RegistrationForm from '@/components/RegistrationForm';
import { 
  CalendarDays, 
  Clock, 
  MapPin, 
  Users, 
  ArrowLeft, 
  Share2,
  Ticket,
  Star,
  ChevronRight,
  Mic
} from 'lucide-react';

interface Event {
  id: number;
  title: string;
  event_code: string;
  description: string;
  speakers?: string;
  date: string;
  formatted_date: string;
  time: string;
  formatted_time: string;
  location: string;
  max_capacity: number;
  poster_url: string;
  registration_count: number;
  available_slots: number;
  is_full: boolean;
  slug: string;
  days_until: number;
  is_today: boolean;
  is_tomorrow: boolean;
  status: string;
  is_active: boolean;
  can_register: boolean;
}

interface RelatedEvent {
  id: number;
  title: string;
  poster_url: string;
  registration_count: number;
}

interface EventShowProps {
  event: Event;
  relatedEvents: RelatedEvent[];
  meta: {
    title: string;
    description: string;
    keywords: string;
    canonical_url: string;
    og_image?: string;
  };
}

export default function EventShow({ event, relatedEvents, meta }: EventShowProps) {
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);

  return (
    <HomeLayout>
      <Head>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <meta name="keywords" content={meta.keywords} />
        <link rel="canonical" href={meta.canonical_url} />
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:type" content="event" />
        <meta property="og:url" content={meta.canonical_url} />
        {meta.og_image && <meta property="og:image" content={meta.og_image} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />
        {meta.og_image && <meta name="twitter:image" content={meta.og_image} />}
      </Head>

      <div className="min-h-screen bg-white">
        {/* Spacing for transparent navbar */}
        <div className="h-16 sm:h-20"></div>
        
        {/* Breadcrumb Navigation - Simple & Clean */}
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
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <span className="text-gray-500">Event</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <span className="text-gray-900 font-medium">{event.title}</span>
            </nav>
          </div>
        </div>

        {/* Hero Section - Simple & Clean dengan Grid Alignment */}
        <div className="bg-gradient-to-br from-orange-50 via-background to-red-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              
              {/* Event Poster - Simple & Clean */}
              <div className="lg:col-span-2">
                <div className="relative group">
                  <img
                    src={event.poster_url}
                    alt={`Poster ${event.title}`}
                    className="w-full h-[450px] lg:h-[550px] object-cover rounded-2xl shadow-xl group-hover:shadow-2xl transition-all duration-300"
                  />
                  {/* Status Badge */}
                  <div className="absolute top-6 left-6">
                    {event.is_today && (
                      <Badge className="bg-red-500 text-white animate-pulse px-4 py-2 text-sm font-medium rounded-full shadow-lg">
                        Hari Ini
                      </Badge>
                    )}
                    {event.is_tomorrow && (
                      <Badge className="bg-orange-500 text-white px-4 py-2 text-sm font-medium rounded-full shadow-lg">
                        Besok
                      </Badge>
                    )}
                    {!event.is_today && !event.is_tomorrow && event.days_until <= 7 && (
                      <Badge className="bg-orange-100 text-orange-700 border border-orange-200 px-4 py-2 text-sm font-medium rounded-full shadow-lg">
                        {event.days_until} hari lagi
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Event Info & CTA Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white/90 backdrop-blur-sm border border-orange-100 rounded-2xl shadow-xl p-8 space-y-8 sticky top-8">
                  
                  {/* Event Title */}
                  <div className="space-y-4">
                    <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent leading-tight">
                      {event.title}
                    </h1>
                    
                    {/* Event Details */}
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <CalendarDays className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Tanggal</p>
                          <p className="font-semibold text-gray-900">{event.formatted_date}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Clock className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Waktu</p>
                          <p className="font-semibold text-gray-900">{event.formatted_time}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Lokasi</p>
                          <p className="font-semibold text-gray-900 text-sm leading-relaxed">{event.location}</p>
                        </div>
                      </div>

                      {event.speakers && (
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Mic className="w-5 h-5 text-orange-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Narasumber</p>
                            <p className="font-semibold text-gray-900 text-sm leading-relaxed">{event.speakers}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Pricing Section */}
                  <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-xl p-6">
                    <div className="text-center space-y-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Biaya Partisipasi</p>
                        <div className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent">
                          Gratis
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Tidak ada biaya pendaftaran</p>
                      </div>
                      
                      {/* Registration CTA */}
                      {event.can_register && !event.is_full ? (
                        <Button 
                          size="lg" 
                          onClick={() => setShowRegistrationModal(true)}
                          className="w-full px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
                        >
                          <Ticket className="w-5 h-5 mr-2" />
                          Daftar Sekarang
                        </Button>
                      ) : (
                        <Button 
                          size="lg" 
                          disabled
                          className="w-full px-8 py-4 bg-gray-300 text-gray-500 font-semibold rounded-lg cursor-not-allowed"
                        >
                          {event.is_full ? 'Event Penuh' : 
                           event.status !== 'active' ? 'Event Tidak Aktif' : 'Pendaftaran Ditutup'}
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          <Users className="w-5 h-5 text-orange-600" />
                          <span className="text-sm text-gray-600">Peserta Terdaftar</span>
                        </div>
                        <span className="font-bold text-gray-900">{event.registration_count} orang</span>
                      </div>
                      
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          <Ticket className="w-5 h-5 text-green-600" />
                          <span className="text-sm text-gray-600">Slot Tersisa</span>
                        </div>
                        <span className="font-bold text-green-700">{event.available_slots} slot</span>
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full border-2 border-orange-300 text-orange-700 hover:bg-orange-50 font-semibold rounded-lg transition-colors"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Bagikan Event
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation & Content - Enhanced */}
        <div className="bg-white border-t border-orange-100">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="max-w-5xl mx-auto">
              <Tabs defaultValue="deskripsi" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-orange-50 border border-orange-200 p-1 rounded-xl h-12">
                  <TabsTrigger 
                    value="deskripsi" 
                    className="text-sm font-semibold data-[state=active]:bg-white data-[state=active]:text-orange-700 data-[state=active]:shadow-sm rounded-lg transition-all duration-200"
                  >
                    Deskripsi
                  </TabsTrigger>
                  <TabsTrigger 
                    value="syarat" 
                    className="text-sm font-semibold data-[state=active]:bg-white data-[state=active]:text-orange-700 data-[state=active]:shadow-sm rounded-lg transition-all duration-200"
                  >
                    Syarat & Ketentuan
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="deskripsi" className="mt-12">
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent mb-6">
                        Tentang Event Ini
                      </h3>
                      <p className="text-gray-700 leading-relaxed text-lg">
                        {event.description}
                      </p>
                    </div>
                    
                    {/* Enhanced detailed description */}
                    <div className="space-y-6">
                      <p className="text-gray-700 leading-relaxed text-base">
                        {event.title} adalah acara yang dirancang khusus untuk memberikan pengalaman terbaik 
                        bagi para peserta. Event ini akan menghadirkan pembicara-pembicara berkualitas dan 
                        aktivitas menarik yang tidak boleh Anda lewatkan.
                      </p>
                      
                      <div className="bg-gradient-to-br from-orange-50 to-red-50 border-l-4 border-orange-500 rounded-r-xl p-6">
                        <h4 className="font-bold text-orange-900 mb-4 text-lg">Yang Akan Anda Dapatkan:</h4>
                        <ul className="space-y-3 text-orange-800">
                          <li className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span>Materi pembelajaran berkualitas tinggi dari praktisi berpengalaman</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span>Networking dengan peserta dan komunitas yang relevan</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span>Sertifikat kehadiran digital yang dapat diunduh</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span>Dokumentasi acara dan materi presentasi</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="syarat" className="mt-12">
                  <div className="space-y-8">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent mb-6">
                      Syarat dan Ketentuan
                    </h3>
                    
                    <div className="space-y-8">
                      <div className="bg-white border border-orange-200 rounded-xl p-6">
                        <h4 className="font-bold text-gray-900 mb-4 text-lg flex items-center gap-3">
                          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                            <span className="text-orange-600 font-bold text-sm">1</span>
                          </div>
                          Ketentuan Pendaftaran
                        </h4>
                        <ul className="space-y-3 text-gray-700 ml-11">
                          <li className="flex items-start gap-3">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                            <span>Peserta wajib mengisi formulir pendaftaran dengan data yang valid dan lengkap</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                            <span>Konfirmasi kehadiran akan dikirimkan melalui email yang terdaftar</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                            <span>Peserta wajib hadir tepat waktu sesuai jadwal yang ditentukan</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="bg-white border border-orange-200 rounded-xl p-6">
                        <h4 className="font-bold text-gray-900 mb-4 text-lg flex items-center gap-3">
                          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                            <span className="text-red-600 font-bold text-sm">2</span>
                          </div>
                          Ketentuan Event
                        </h4>
                        <ul className="space-y-3 text-gray-700 ml-11">
                          <li className="flex items-start gap-3">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                            <span>Peserta wajib mematuhi protokol kesehatan yang berlaku</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                            <span>Dilarang membawa makanan dan minuman dari luar venue</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                            <span>Panitia berhak menolak peserta yang tidak memenuhi syarat</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>

        {/* Related Events Section - Clean & Integrated Design */}
        {relatedEvents.length > 0 && (
          <div className="bg-gradient-to-br from-orange-50 via-background to-red-50 py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-5xl mx-auto">
                {/* Section Header */}
                <div className="text-center space-y-4 mb-12">
                  <div className="inline-flex">
                    <Badge className="px-4 py-2 text-sm bg-orange-100 text-orange-800 border border-orange-200">
                      <Star className="w-4 h-4 mr-2" />
                      Event Rekomendasi
                    </Badge>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-bold">
                    Event Untuk
                    <span className="bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent"> Kamu</span>
                  </h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                    Jelajahi event menarik lainnya dari Festival Tahuri
                  </p>
                </div>
                
                {/* Clean Cards Layout - 2 Events Max */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {relatedEvents.map((relatedEvent, index) => (
                    <Link key={relatedEvent.id} href={`/events/${relatedEvent.id}`}>
                      <div className={`group relative overflow-hidden rounded-2xl bg-white border border-orange-200 hover:border-orange-300 hover:shadow-xl transition-all duration-300 h-64 ${index % 2 === 0 ? 'hover:-translate-y-2' : 'hover:translate-y-2'}`}>
                        {/* Background Image */}
                        <div className="absolute inset-0">
                          <img
                            src={relatedEvent.poster_url}
                            alt={relatedEvent.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
                        </div>

                        {/* Content Overlay */}
                        <div className="relative z-10 p-8 h-full flex flex-col justify-between">
                          <div>
                            <div className="inline-flex mb-4">
                              <Badge className="bg-white/20 backdrop-blur-sm text-white border border-white/30 px-3 py-1 text-xs font-medium">
                                Gratis
                              </Badge>
                            </div>
                            
                            <h3 className="text-xl lg:text-2xl font-bold text-white mb-3 leading-tight group-hover:text-orange-200 transition-colors duration-200">
                              {relatedEvent.title}
                            </h3>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-white/90">
                              <Users className="w-4 h-4" />
                              <span className="text-sm font-medium">{relatedEvent.registration_count} peserta</span>
                            </div>
                            
                            <div className="flex items-center gap-2 text-orange-300 group-hover:text-orange-200 transition-colors duration-200">
                              <span className="text-sm font-semibold">Lihat Detail</span>
                              <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform duration-200" />
                            </div>
                          </div>
                        </div>

                        {/* Decorative Element */}
                        <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
                      </div>
                    </Link>
                  ))}
                </div>

                {/* View All Events Button */}
                <div className="text-center mt-12">
                  <Link href="/">
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="border-2 border-orange-300 text-orange-700 hover:bg-orange-50 font-semibold px-8 py-3 hover:-translate-y-1 transition-all duration-200"
                    >
                      Lihat Semua Event
                      <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Registration Modal */}
        <Dialog open={showRegistrationModal} onOpenChange={setShowRegistrationModal}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent">
                Pendaftaran Event
              </DialogTitle>
            </DialogHeader>
            <RegistrationForm 
              event={event}
              onSuccess={() => {
                setShowRegistrationModal(false);
                // Refresh page or update event data
                window.location.reload();
              }}
              onCancel={() => setShowRegistrationModal(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </HomeLayout>
  );
}