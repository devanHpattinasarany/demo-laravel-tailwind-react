import React from 'react';
import { motion } from 'framer-motion';
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
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated Dot Grid Pattern - Mobile Optimized */}
        <div 
          className="absolute inset-0 opacity-30 sm:opacity-30 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(249, 115, 22, 0.4) 1.5px, transparent 0)',
            backgroundSize: 'clamp(16px, 4vw, 24px) clamp(16px, 4vw, 24px)',
            animation: 'float 20s ease-in-out infinite'
          }}
        ></div>
        
        {/* Secondary Dot Layer - Mobile Optimized */}
        <div 
          className="absolute inset-0 opacity-20 sm:opacity-20 opacity-12"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(239, 68, 68, 0.3) 1px, transparent 0)',
            backgroundSize: 'clamp(20px, 5vw, 32px) clamp(20px, 5vw, 32px)',
            animation: 'float 25s ease-in-out infinite reverse'
          }}
        ></div>
        
        {/* Animated Mesh Gradient Overlay - Mobile Optimized */}
        <div className="absolute inset-0 opacity-40 sm:opacity-40 opacity-25">
          <div 
            className="w-full h-full bg-gradient-to-br from-orange-300/30 via-red-200/20 to-orange-200/25"
            style={{ animation: 'gradientShift 12s ease-in-out infinite alternate' }}
          ></div>
        </div>

        {/* Large Floating Geometric Elements - Mobile Safe Positioning */}
        {/* Top Left - Above text area */}
        <div className="absolute top-4 left-2 sm:top-16 sm:left-8 w-12 h-12 sm:w-20 sm:h-20 bg-orange-300/25 rounded-full blur-xl" style={{ animation: 'floatBig 10s ease-in-out infinite' }}></div>
        
        {/* Top Right - Above text area */}
        <div className="absolute top-6 right-2 sm:top-12 sm:right-8 w-10 h-10 sm:w-16 sm:h-16 bg-red-300/20 rounded-full blur-lg" style={{ animation: 'floatBig 14s ease-in-out infinite 3s' }}></div>
        
        {/* Bottom Left - Below CTA buttons */}
        <div className="absolute bottom-4 left-4 sm:bottom-16 sm:left-16 w-8 h-8 sm:w-12 sm:h-12 bg-orange-200/30 rounded-full blur-lg" style={{ animation: 'float 8s ease-in-out infinite 1s' }}></div>
        
        {/* Bottom Right - Below CTA buttons */}
        <div className="absolute bottom-2 right-4 sm:bottom-16 sm:right-8 w-16 h-16 sm:w-28 sm:h-28 bg-red-300/20 rounded-full blur-xl" style={{ animation: 'floatBig 12s ease-in-out infinite 2s' }}></div>
        
        {/* Medium Floating Shapes - Far from text areas */}
        {/* Left side - Outside main content */}
        <div className="absolute top-1/3 left-1 sm:left-8 w-3 h-3 sm:w-6 sm:h-6 bg-orange-400/40 rounded-full" style={{ animation: 'twinkle 3s ease-in-out infinite' }}></div>
        
        {/* Right side - Outside main content */}
        <div className="absolute top-2/3 right-1 sm:right-8 w-2 h-2 sm:w-4 sm:h-4 bg-red-400/40 rounded-full" style={{ animation: 'twinkle 4s ease-in-out infinite 1s' }}></div>
        
        {/* Far left - Very subtle */}
        <div className="absolute top-1/4 -left-2 sm:left-2 w-2 h-2 sm:w-3 sm:h-3 bg-orange-300/50 rounded-full" style={{ animation: 'twinkle 2.5s ease-in-out infinite 2s' }}></div>
        
        {/* Far right - Very subtle */}
        <div className="absolute bottom-1/3 -right-2 sm:right-2 w-3 h-3 sm:w-5 sm:h-5 bg-red-300/45 rounded-full" style={{ animation: 'twinkle 3.5s ease-in-out infinite 1.5s' }}></div>
        
        {/* Flowing Lines Effect - Mobile Optimized */}
        <div className="absolute inset-0 hidden sm:block">
          <svg className="w-full h-full opacity-10" viewBox="0 0 1200 800" preserveAspectRatio="none">
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(249, 115, 22, 0)" />
                <stop offset="50%" stopColor="rgba(249, 115, 22, 0.6)" />
                <stop offset="100%" stopColor="rgba(239, 68, 68, 0)" />
              </linearGradient>
            </defs>
            <path d="M0,200 Q300,100 600,150 T1200,200" stroke="url(#lineGradient)" strokeWidth="2" fill="none">
              <animate attributeName="d" 
                values="M0,200 Q300,100 600,150 T1200,200;M0,250 Q300,150 600,200 T1200,180;M0,200 Q300,100 600,150 T1200,200" 
                dur="15s" 
                repeatCount="indefinite" />
            </path>
            <path d="M0,400 Q400,300 800,350 T1200,400" stroke="url(#lineGradient)" strokeWidth="1.5" fill="none">
              <animate attributeName="d" 
                values="M0,400 Q400,300 800,350 T1200,400;M0,350 Q400,450 800,300 T1200,420;M0,400 Q400,300 800,350 T1200,400" 
                dur="20s" 
                repeatCount="indefinite" />
            </path>
          </svg>
        </div>
        
        {/* Simple Mobile Alternative - Just subtle gradient movement */}
        <div className="absolute inset-0 sm:hidden opacity-15">
          <div 
            className="w-full h-full bg-gradient-to-r from-transparent via-orange-200/20 to-transparent"
            style={{ animation: 'mobileGradient 8s ease-in-out infinite alternate' }}
          ></div>
        </div>
      </div>

      {/* Custom CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(2deg); }
        }
        @keyframes floatBig {
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
          33% { transform: translateY(-20px) translateX(10px) rotate(1deg); }
          66% { transform: translateY(-10px) translateX(-15px) rotate(-1deg); }
        }
        @keyframes gradientShift {
          0% { transform: translateX(-10px) translateY(-10px) scale(1); }
          50% { transform: translateX(5px) translateY(15px) scale(1.02); }
          100% { transform: translateX(10px) translateY(-5px) scale(1); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.3); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
        @keyframes mobileGradient {
          0% { transform: translateX(-20px) scaleX(0.8); }
          100% { transform: translateX(20px) scaleX(1.1); }
        }
      `}</style>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center space-y-8">

          {/* Event Badge */}
          <motion.div 
            className="inline-flex"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <Badge variant="outline" className="px-4 py-2 text-sm font-medium border-orange-200 bg-orange-50 text-orange-800">
              <Heart className="w-4 h-4 mr-2" />
              RRM X Festival Tahuri Vol 9
            </Badge>
          </motion.div>

          {/* Main Heading */}
          <div className="space-y-6">
            <motion.h1 
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <span className="bg-gradient-to-r from-orange-600 via-red-500 to-orange-500 bg-clip-text text-transparent">
                3 Talkshow Gratis
              </span>
              <br />
              <span className="text-foreground">
                Menanti Anda!
              </span>
            </motion.h1>

            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <p className="text-xl sm:text-2xl font-semibold text-orange-600">
                Akses gratis terbatas - Hanya 500 peserta per talkshow
              </p>
              
              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Bergabunglah dalam <span className="text-orange-600 font-semibold">3 talkshow eksklusif</span> di 
                <span className="text-red-500 font-semibold"> Raburabu Market X Festival Tahuri</span>. 
                Pilih talkshow favorit Anda dan daftar sekarang sebelum kehabisan tempat!
              </p>
            </motion.div>
          </div>


          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center pt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Button
                size="lg"
                className="px-8 py-4 text-base font-semibold bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg hover:shadow-xl transition-all duration-200"
                onClick={scrollToTalkshows}
              >
                Daftar Gratis Sekarang
                <ArrowDown className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-4 text-base font-semibold border-2 border-orange-200 text-orange-700 hover:bg-orange-50"
              >
                Info Lengkap
              </Button>
            </motion.div>
          </motion.div>

          {/* Event Info */}
          <motion.div 
            className="pt-8 space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <p className="text-sm text-muted-foreground font-medium">
              3 talkshow gratis untuk semua kalangan • Registrasi online mudah dan cepat
            </p>
            <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-muted-foreground">
              <motion.div 
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Calendar className="w-4 h-4 text-orange-500" />
                <span>Festival Volume ke-9</span>
              </motion.div>
              <motion.div 
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Users className="w-4 h-4 text-red-500" />
                <span>Open untuk Umum</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* SVG Wave Transition */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none" 
          className="w-full h-[60px] sm:h-[80px] fill-background"
          style={{ transform: 'rotate(180deg)' }}
        >
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(251, 146, 60, 0.1)" />
              <stop offset="50%" stopColor="rgba(239, 68, 68, 0.1)" />
              <stop offset="100%" stopColor="rgba(251, 146, 60, 0.1)" />
            </linearGradient>
          </defs>
          <path 
            d="M0,0 C150,100 350,0 600,50 C850,100 1050,0 1200,50 L1200,120 L0,120 Z" 
            className="fill-background"
          />
          <path 
            d="M0,20 C150,80 350,20 600,40 C850,60 1050,20 1200,40 L1200,120 L0,120 Z" 
            fill="url(#waveGradient)"
          />
        </svg>
      </div>
    </section>
  );
}
