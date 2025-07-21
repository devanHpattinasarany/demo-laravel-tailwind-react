import React from 'react';
import SeminarCard from './SeminarCard';

interface Seminar {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  speakers: string;
  event_code: string;
  registrations_count: number;
}

interface SeminarsGridDebugProps {
  seminars: Seminar[];
  className?: string;
}

export default function SeminarsGridDebug({ seminars, className = "" }: SeminarsGridDebugProps) {
  console.log('🐛 DEBUG: SeminarsGridDebug rendered with', seminars.length, 'seminars');
  console.log('🐛 DEBUG: Seminars data:', seminars);
  
  return (
    <section className={`py-16 bg-background ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="max-w-3xl mx-auto text-center space-y-6 mb-12">
          <h2 className="text-3xl font-bold">
            Jelajahi <span className="bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent">Talkshow Festival Tahuri</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Pilih talkshow favorit Anda dan daftar sekarang juga
          </p>
        </div>

        {/* Debug Info */}
        <div className="bg-yellow-100 border border-yellow-400 rounded-lg p-4 mb-8 text-center">
          <p className="text-yellow-800 font-semibold">
            🐛 DEBUG MODE: Found {seminars.length} seminars
          </p>
          <p className="text-yellow-700 text-sm">
            If you see this, data is loading correctly
          </p>
        </div>

        {/* Talkshow Grid - NO ANIMATIONS */}
        {seminars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {seminars.map((seminar, index) => (
              <div key={seminar.id} className="w-full">
                <div className="bg-blue-100 border border-blue-400 rounded p-2 mb-2 text-center">
                  <span className="text-blue-800 text-xs">Card #{index + 1}</span>
                </div>
                <SeminarCard
                  seminar={seminar}
                  className="h-full"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-red-100 border border-red-400 rounded-lg p-8">
              <h3 className="text-red-800 font-semibold text-lg mb-2">
                ❌ No Seminars Found
              </h3>
              <p className="text-red-700">
                This indicates a data loading issue
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}