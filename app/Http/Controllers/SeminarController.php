<?php

namespace App\Http\Controllers;

use App\Models\Event as Seminar;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SeminarController extends Controller
{
    /**
     * Display the specified seminar
     */
    public function show(Seminar $seminar): Response
    {
        // Validate seminar exists and is active (optional - allow viewing inactive seminars for admin purposes)
        // If you want to restrict to active seminars only, uncomment the line below:
        // abort_if($seminar->status !== 'active', 404, 'Seminar not found or inactive');
        
        // Load registration count for the seminar
        $seminar->loadCount('registrations');
        
        // Format seminar data for frontend
        $seminarData = [
            'id' => $seminar->id,
            'title' => $seminar->title,
            'event_code' => $seminar->event_code,
            'description' => $seminar->description,
            'speakers' => $seminar->speakers,
            'date' => $seminar->date->format('Y-m-d'),
            'formatted_date' => $seminar->date->translatedFormat('l, d F Y'),
            'time' => $seminar->time->format('H:i'),
            'formatted_time' => $seminar->time->format('H:i') . ' WIB',
            'location' => $seminar->location,
            'max_capacity' => $seminar->max_capacity,
            'poster_url' => $seminar->poster_url,
            'registration_count' => $seminar->registrations_count,
            'available_slots' => $seminar->getAvailableSlots(),
            'is_full' => $seminar->isFull(),
            'slug' => \Str::slug($seminar->title),
            'status' => $seminar->status,
            // Calculate days until seminar (rounded to whole days)
            'days_until' => (int) ceil(now()->diffInDays($seminar->date, false)),
            'is_today' => $seminar->date->isToday(),
            'is_tomorrow' => $seminar->date->isTomorrow(),
            'is_active' => $seminar->status === 'active',
            'can_register' => $seminar->status === 'active' && $seminar->date >= now()->toDateString() && !$seminar->isFull(),
        ];

        // Get 2 other seminars for "Seminar Untuk Kamu" section
        $relatedSeminars = Seminar::select([
                'id',
                'title', 
                'poster_url',
            ])
            ->active()
            ->where('id', '!=', $seminar->id) // Exclude current seminar
            ->where('date', '>=', now()->toDateString()) // Only future seminars
            ->orderBy('date', 'asc')
            ->withCount(['registrations as registration_count'])
            ->limit(2)
            ->get()
            ->map(function ($relatedSeminar) {
                return [
                    'id' => $relatedSeminar->id,
                    'title' => $relatedSeminar->title,
                    'poster_url' => $relatedSeminar->poster_url,
                    'registration_count' => $relatedSeminar->registration_count,
                ];
            });

        return Inertia::render('Seminar/Show', [
            'seminar' => $seminarData,
            'relatedSeminars' => $relatedSeminars,
            'meta' => [
                'title' => $seminar->title . ' - Tahuri Talkshow',
                'description' => $seminar->description,
                'keywords' => 'talkshow, workshop, edukasi, ' . strtolower($seminar->title),
                'canonical_url' => route('seminars.show', $seminar),
                'og_image' => $seminar->poster_url,
            ]
        ]);
    }
}