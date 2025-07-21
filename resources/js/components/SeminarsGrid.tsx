import React from 'react';
import { Search, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SeminarCard from './SeminarCard';
import { FadeInUp, StaggerContainer } from '@/components/animations';

interface Seminar {
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

interface SeminarsGridProps {
  seminars: Seminar[];
}

export default function SeminarsGrid({ seminars }: SeminarsGridProps) {

  return (
    <section id="events-section" className="py-16 bg-background">
      <div className="container mx-auto">

        {/* Section Header with Animations */}
        <FadeInUp className="text-center space-y-4 mb-12">
          <div className="inline-flex">
            <Badge className="px-4 py-2 text-sm bg-orange-100 text-orange-800 border border-orange-200">
              <Calendar className="w-4 h-4 mr-2" />
              Talkshow Mendatang
            </Badge>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold">
            Jelajahi Talkshow
            <span className="bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent"> Festival Tahuri</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Pilih talkshow yang sesuai dengan minat Anda. Nikmati pengalaman edukasi finansial,
            ekonomi kreatif, dan berbagai topik menarik lainnya.
          </p>
        </FadeInUp>


        {/* Talkshow Grid with Stagger Animation */}
        {seminars.length > 0 ? (
          <StaggerContainer 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
            staggerDelay={0.15}
            threshold={0.5}
          >
            {seminars.map((seminar) => (
              <SeminarCard
                key={seminar.id}
                seminar={seminar}
                className="h-full"
              />
            ))}
          </StaggerContainer>
        ) : (
          <FadeInUp className="text-center py-16 space-y-4" delay={0.2}>
            <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">Tidak ada talkshow ditemukan</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Coba ubah kata kunci pencarian atau filter untuk menemukan talkshow yang sesuai.
            </p>
            <Button variant="outline" className="mt-4 border-orange-200 text-orange-700 hover:bg-orange-50">
              Cari Talkshow Lainnya
            </Button>
          </FadeInUp>
        )}

        {/* Load More Button with Animation */}
        {seminars.length > 0 && seminars.length >= 6 && (
          <FadeInUp className="text-center mt-12" delay={0.4}>
            <Button variant="outline" size="lg" className="px-8 border-orange-200 text-orange-700 hover:bg-orange-50">
              Muat Lebih Banyak Talkshow
            </Button>
          </FadeInUp>
        )}
      </div>
    </section>
  );
}
