<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    /**
     * Display the landing page with active events
     */
    public function index(): Response
    {
        // Optimized query with only necessary fields and proper ordering
        $events = Event::select([
                'id',
                'title', 
                'description',
                'date',
                'time',
                'location',
                'poster_url',
                'status'
            ])
            ->active()
            ->where('date', '>=', now()->toDateString()) // Only future events
            ->orderBy('date', 'asc')
            ->orderBy('time', 'asc')
            ->withCount(['registrations as registration_count'])
            ->get()
            ->map(function ($event) {
                return [
                    'id' => $event->id,
                    'title' => $event->title,
                    'description' => $event->description,
                    'date' => $event->date->format('Y-m-d'),
                    'formatted_date' => $event->date->translatedFormat('l, d F Y'),
                    'time' => $event->time->format('H:i'),
                    'formatted_time' => $event->time->format('H:i') . ' WIB',
                    'location' => $event->location,
                    'poster_url' => $event->poster_url,
                    'registration_count' => $event->registration_count,
                    'slug' => \Str::slug($event->title),
                    // Calculate days until event
                    'days_until' => now()->diffInDays($event->date, false),
                    'is_today' => $event->date->isToday(),
                    'is_tomorrow' => $event->date->isTomorrow(),
                ];
            });

        return Inertia::render('home', [
            'events' => $events,
            'stats' => [
                'total_events' => $events->count(),
                'upcoming_this_week' => $events->filter(fn($event) => $event['days_until'] <= 7)->count(),
            ],
            'meta' => [
                'title' => 'Tahuri Events - Platform Event & Seminar Terpercaya',
                'description' => 'Temukan dan daftar event teknologi, workshop, dan seminar terbaik. Platform ticketing yang mudah dan terpercaya untuk pengembangan diri Anda.',
                'keywords' => 'event teknologi, workshop programming, seminar IT, tahuri events, ticketing online',
                'canonical_url' => route('home'),
            ]
        ]);
    }
}