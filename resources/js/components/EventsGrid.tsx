import React from 'react';
import { Search, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import EventCard from './EventCard';

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  formatted_date: string;
  time: string;
  formatted_time: string;
  location: string;
  poster_url: string;
  registration_count: number;
  slug: string;
  days_until: number;
  is_today: boolean;
  is_tomorrow: boolean;
}

interface EventsGridProps {
  events: Event[];
}

export default function EventsGrid({ events }: EventsGridProps) {

  return (
    <section id="events-section" className="py-16 bg-background">
      <div className="container mx-auto">
        
        {/* Section Header */}
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex">
            <Badge className="px-4 py-2 text-sm bg-orange-100 text-orange-800 border border-orange-200">
              <Calendar className="w-4 h-4 mr-2" />
              Event Festival Mendatang
            </Badge>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold">
            Jelajahi Event
            <span className="bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent"> Festival Tahuri</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Pilih sesi festival yang sesuai dengan minat Anda. Nikmati pengalaman UMKM showcase, 
            talkshow inspiratif, dan berbagai aktivitas menarik lainnya.
          </p>
        </div>


        {/* Events Grid */}
        {events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {events.map((event) => (
              <EventCard 
                key={event.id} 
                event={event}
                className="h-full"
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 space-y-4">
            <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">Tidak ada event ditemukan</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Coba ubah kata kunci pencarian atau filter untuk menemukan event yang sesuai.
            </p>
            <Button variant="outline" className="mt-4 border-orange-200 text-orange-700 hover:bg-orange-50">
              Cari Event Lainnya
            </Button>
          </div>
        )}

        {/* Load More / Pagination Placeholder */}
        {events.length > 0 && events.length >= 6 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" className="px-8 border-orange-200 text-orange-700 hover:bg-orange-50">
              Muat Lebih Banyak Event
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}