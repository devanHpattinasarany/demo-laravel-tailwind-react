import React from 'react';
import { Calendar, Clock, MapPin, Mic, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from '@inertiajs/react';

interface SeminarCardProps {
  seminar: {
    id: number;
    title: string;
    description: string;
    speakers?: string;
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
  };
  className?: string;
}

export default function SeminarCard({ seminar, className = '' }: SeminarCardProps) {
  const getStatusBadge = () => {
    if (seminar.is_today) {
      return <Badge className="bg-red-500 text-white animate-pulse">Hari Ini</Badge>;
    }
    if (seminar.is_tomorrow) {
      return <Badge className="bg-orange-500 text-white">Besok</Badge>;
    }
    if (seminar.days_until <= 7) {
      return <Badge className="bg-orange-100 text-orange-700 border border-orange-200">{seminar.days_until} hari lagi</Badge>;
    }
    return null;
  };

  return (
    <div className={`group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-orange-200 transition-all duration-300 ${className}`}>
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={seminar.poster_url}
          alt={seminar.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        
        {/* Badge */}
        {getStatusBadge() && (
          <div className="absolute top-3 left-3">
            {getStatusBadge()}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title & Description */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {seminar.title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">
            {seminar.description}
          </p>
        </div>

        {/* Date & Time */}
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-4 h-4 text-orange-500" />
          <span className="text-sm font-medium text-gray-700">{seminar.formatted_date}</span>
          <Clock className="w-4 h-4 text-orange-500 ml-2" />
          <span className="text-sm text-gray-600">{seminar.formatted_time}</span>
        </div>

        {/* Location */}
        <div className="flex items-start gap-2 mb-3">
          <MapPin className="w-4 h-4 text-red-500 mt-0.5" />
          <span className="text-sm text-gray-600 line-clamp-1">{seminar.location}</span>
        </div>

        {/* Speakers */}
        {seminar.speakers && (
          <div className="flex items-start gap-2 mb-4">
            <Mic className="w-4 h-4 text-orange-500 mt-0.5" />
            <span className="text-sm text-gray-600 line-clamp-2">{seminar.speakers}</span>
          </div>
        )}

        {/* Button */}
        <Link href={`/seminars/${seminar.id}`}>
          <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
            Lihat Detail Talkshow
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
}