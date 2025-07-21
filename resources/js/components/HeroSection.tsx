import React, { useState, useEffect } from 'react';
import { Calendar, Users, ArrowDown, Heart, Gift, Mic, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface HeroSectionProps {
  stats: {
    total_seminars: number;
    upcoming_this_week: number;
  };
}

export default function HeroSection({ stats: _stats }: HeroSectionProps) {
  const [currentFeature, setCurrentFeature] = useState(0);

  const features = [
    { icon: ShoppingBag, text: "Edukasi Finansial" },
    { icon: Mic, text: "Talkshow Inspiring" },
    { icon: Gift, text: "Doorprize Menarik" },
    { icon: Heart, text: "Community Talkshow" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [features.length]);

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
              Raburabu Market Vol 9 x Festival Tahuri
            </Badge>
          </div>

          {/* Main Heading */}
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
              <span className="bg-gradient-to-r from-orange-600 via-red-500 to-orange-500 bg-clip-text text-transparent">
                Festival Kreativitas
              </span>
              <br />
              <span className="text-foreground">
                & UMKM Tahuri
              </span>
            </h1>

            {/* Animated Feature Rotator */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-lg sm:text-xl text-muted-foreground">
              <span>Nikmati pengalaman</span>
              <div className="relative h-8 w-40 flex items-center justify-center">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={index}
                      className={`absolute flex items-center gap-2 transition-all duration-500 ${
                        index === currentFeature
                          ? 'opacity-100 transform translate-y-0'
                          : 'opacity-0 transform translate-y-4'
                      }`}
                    >
                      <Icon className="w-5 h-5 text-orange-500" />
                      <span className="bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent font-semibold">
                        {feature.text}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Bergabunglah dalam festival yang memadukan <span className="text-orange-600 font-semibold">edukasi finansial</span> dengan
              <span className="text-red-500 font-semibold"> talkshow inspiratif</span>. Daftar gratis sekarang dan rasakan pengalaman tak terlupakan!
            </p>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
            <div className="group bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 rounded-2xl p-6 hover:from-orange-100 hover:to-orange-150 hover:border-orange-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <ShoppingBag className="w-8 h-8 text-white" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-xl text-orange-800">Edukasi Finansial</h3>
                  <p className="text-sm text-orange-700 leading-relaxed">
                    Pelajari strategi keuangan dan investasi dari para ahli finansial terpercaya
                  </p>
                </div>
              </div>
            </div>

            <div className="group bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-2xl p-6 hover:from-red-100 hover:to-red-150 hover:border-red-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <Mic className="w-8 h-8 text-white" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-xl text-red-800">Talkshow Inspiring</h3>
                  <p className="text-sm text-red-700 leading-relaxed">
                    Dengarkan talkshow edukatif dari narasumber berpengalaman dan inspiratif
                  </p>
                </div>
              </div>
            </div>

            <div className="group bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 rounded-2xl p-6 hover:from-orange-100 hover:to-orange-150 hover:border-orange-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <Gift className="w-8 h-8 text-white" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-xl text-orange-800">Doorprize Seru</h3>
                  <p className="text-sm text-orange-700 leading-relaxed">
                    Raih kesempatan memenangkan hadiah menarik di setiap sesi acara
                  </p>
                </div>
              </div>
            </div>

            <div className="group bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-2xl p-6 hover:from-red-100 hover:to-red-150 hover:border-red-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-xl text-red-800">Community Fest</h3>
                  <p className="text-sm text-red-700 leading-relaxed">
                    Bergabung dan berkenalan dengan komunitas kreatif Maluku yang inspiratif
                  </p>
                </div>
              </div>
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
              Talkshow gratis untuk semua kalangan • Registrasi online mudah dan cepat
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
