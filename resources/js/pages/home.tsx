import React from 'react';
import { Head } from '@inertiajs/react';
import HomeLayout from '@/layouts/home-layout';
import HeroSection from '@/components/HeroSection';
import SeminarsGrid from '@/components/SeminarsGrid';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';
import { FadeInUp, SlideIn, StaggerContainer } from '@/components/animations';

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

interface HomeProps {
  seminars: Seminar[];
  stats: {
    total_seminars: number;
    upcoming_this_week: number;
  };
  meta: {
    title: string;
    description: string;
    keywords: string;
    canonical_url: string;
  };
}

export default function Home({ seminars, stats, meta }: HomeProps) {
  return (
    <HomeLayout>
      <Head>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <meta name="keywords" content={meta.keywords} />
        <link rel="canonical" href={meta.canonical_url} />
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={meta.canonical_url} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />
      </Head>

      <div className="min-h-screen">
        {/* Hero Section */}
        <HeroSection stats={stats} />

        {/* Seminars Grid Section */}
        <SeminarsGrid seminars={seminars} />

        {/* Why Choose Section with Animations */}
        <section id="about-section" className="py-16 bg-gradient-to-br from-orange-50 via-background to-red-50">
          <div className="container mx-auto">
            <div className="max-w-6xl mx-auto text-center space-y-8">
              <SlideIn direction="up" threshold={0.4} className="space-y-4">
                <h2 className="text-3xl font-bold">
                  Mengapa Ikuti 
                  <span className="bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent"> Talkshow Festival Tahuri</span>?
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Talkshow inspiratif dengan narasumber terbaik untuk edukasi finansial dan ekonomi kreatif
                </p>
              </SlideIn>
              
              <StaggerContainer 
                className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12"
                staggerDelay={0.2}
                threshold={0.5}
              >
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 border border-orange-100 hover:border-orange-200 transition-all duration-300 hover:shadow-lg space-y-4">
                  <div className="w-16 h-16 mx-auto bg-orange-100 rounded-2xl flex items-center justify-center">
                    <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-xl text-orange-800">Registrasi Gratis</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Nikmati festival tanpa biaya registrasi. Akses mudah untuk semua kalangan dengan proses pendaftaran yang simpel dan cepat.
                  </p>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 border border-red-100 hover:border-red-200 transition-all duration-300 hover:shadow-lg space-y-4">
                  <div className="w-16 h-16 mx-auto bg-red-100 rounded-2xl flex items-center justify-center">
                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-xl text-red-800">Pengalaman Berkualitas</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Festival volume ke-9 dengan pengalaman yang telah teruji. Kurasi konten terbaik untuk pengalaman yang berkesan.
                  </p>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 border border-orange-100 hover:border-orange-200 transition-all duration-300 hover:shadow-lg space-y-4">
                  <div className="w-16 h-16 mx-auto bg-orange-100 rounded-2xl flex items-center justify-center">
                    <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-xl text-orange-800">Networking Profesional</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Bertemu dan berinteraksi dengan para ahli finansial, entrepreneur sukses, dan praktisi ekonomi kreatif.
                  </p>
                </div>
              </StaggerContainer>
            </div>
          </div>
        </section>


        {/* CTA Section with Animations */}
        <section className="py-16 bg-gradient-to-r from-orange-100/80 to-red-100/80">
          <div className="container mx-auto">
            <FadeInUp className="max-w-4xl mx-auto text-center space-y-6">
              <h2 className="text-3xl font-bold">
                Siap Ikuti <span className="bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent">Talkshow Festival Tahuri</span>?
              </h2>
              <p className="text-muted-foreground text-lg">
                Jangan lewatkan kesempatan untuk belajar dari para ahli dan mengembangkan diri. 
                Daftar sekarang dan dapatkan insight berharga untuk masa depan yang lebih baik!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                <button 
                  onClick={() => {
                    const seminarsSection = document.getElementById('events-section');
                    seminarsSection?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Daftar Sekarang - Gratis!
                </button>
                <a 
                  href="#faq"
                  className="inline-flex items-center justify-center px-8 py-3 border-2 border-orange-300 text-orange-700 rounded-lg font-semibold hover:bg-orange-50 transition-colors"
                >
                  FAQ & Info Lengkap
                </a>
              </div>
            </FadeInUp>
          </div>
        </section>

        {/* FAQ Section */}
        <FAQ />
      </div>
      
      {/* Footer */}
      <Footer />
    </HomeLayout>
  );
}