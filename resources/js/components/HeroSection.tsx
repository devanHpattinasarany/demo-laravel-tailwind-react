import React from 'react';
import { Calendar, Users, ArrowDown, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface HeroSectionProps {
  stats: {
    total_seminars: number;
    upcoming_this_week: number;
  };
}

export default function HeroSection({ stats: _stats }: HeroSectionProps) {

  const scrollToTalkshows = () => {
    const talkshowsSection = document.getElementById('events-section');
    talkshowsSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-background to-red-50 py-20 lg:py-32">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

        {/* Subtle Decorative Elements */}
        <div className="absolute top-20 left-10 w-16 h-16 bg-orange-200/30 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-red-200/30 rounded-full blur-xl"></div>
        <div className="absolute top-1/3 right-20 w-3 h-3 bg-orange-400/50 rounded-full"></div>
        <div className="absolute bottom-1/3 left-16 w-2 h-2 bg-red-400/50 rounded-full"></div>
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center space-y-8">

          {/* Event Badge */}
          <div className="inline-flex">
            <Badge variant="outline" className="px-4 py-2 text-sm font-medium border-orange-200 bg-orange-50 text-orange-800">
              <Heart className="w-4 h-4 mr-2" />
              RRM X Festival Tahuri Vol 9
            </Badge>
          </div>

          {/* Main Heading */}
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
              <span className="bg-gradient-to-r from-orange-600 via-red-500 to-orange-500 bg-clip-text text-transparent">
                3 Talkshow Gratis
              </span>
              <br />
              <span className="text-foreground">
                Menanti Anda!
              </span>
            </h1>

            <div className="space-y-4">
              <p className="text-xl sm:text-2xl font-semibold text-orange-600">
                Akses gratis terbatas - Hanya 500 peserta per talkshow
              </p>
              
              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Bergabunglah dalam <span className="text-orange-600 font-semibold">3 talkshow eksklusif</span> di 
                <span className="text-red-500 font-semibold"> Raburabu Market X Festival Tahuri</span>. 
                Pilih talkshow favorit Anda dan daftar sekarang sebelum kehabisan tempat!
              </p>
            </div>
          </div>


          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Button
              size="lg"
              className="px-8 py-4 text-base font-semibold bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg hover:shadow-xl transition-all duration-200"
              onClick={scrollToTalkshows}
            >
              Daftar Gratis Sekarang
              <ArrowDown className="w-5 h-5 ml-2" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="px-8 py-4 text-base font-semibold border-2 border-orange-200 text-orange-700 hover:bg-orange-50"
            >
              Info Lengkap
            </Button>
          </div>

          {/* Event Info */}
          <div className="pt-8 space-y-4">
            <p className="text-sm text-muted-foreground font-medium">
              3 talkshow gratis untuk semua kalangan • Registrasi online mudah dan cepat
            </p>
            <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-orange-500" />
                <span>Festival Volume ke-9</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-red-500" />
                <span>Open untuk Umum</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-200 to-transparent"></div>
    </section>
  );
}
