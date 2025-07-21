<?php

namespace App\Http\Controllers;

use App\Models\Event as Seminar;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    /**
     * Display the landing page with active seminars
     */
    public function index(): Response
    {
        // Optimized query with only necessary fields and proper ordering
        $seminars = Seminar::select([
                'id',
                'title', 
                'description',
                'speakers',
                'date',
                'time',
                'location',
                'poster_url',
                'status'
            ])
            ->active()
            ->where('date', '>=', now()->toDateString()) // Only future seminars
            ->orderBy('date', 'asc')
            ->orderBy('time', 'asc')
            ->withCount(['registrations as registration_count'])
            ->get()
            ->map(function ($seminar) {
                return [
                    'id' => $seminar->id,
                    'title' => $seminar->title,
                    'description' => $seminar->description,
                    'speakers' => $seminar->speakers,
                    'date' => $seminar->date->format('Y-m-d'),
                    'formatted_date' => $seminar->date->translatedFormat('l, d F Y'),
                    'time' => $seminar->time->format('H:i'),
                    'formatted_time' => $seminar->time->format('H:i') . ' WIB',
                    'location' => $seminar->location,
                    'poster_url' => $seminar->poster_url,
                    'registration_count' => $seminar->registration_count,
                    'slug' => \Str::slug($seminar->title),
                    // Calculate days until seminar (rounded to whole days)
                    'days_until' => (int) ceil(now()->diffInDays($seminar->date, false)),
                    'is_today' => $seminar->date->isToday(),
                    'is_tomorrow' => $seminar->date->isTomorrow(),
                ];
            });

        return Inertia::render('home', [
            'seminars' => $seminars,
            'stats' => [
                'total_seminars' => $seminars->count(),
                'upcoming_this_week' => $seminars->filter(fn($seminar) => $seminar['days_until'] <= 7)->count(),
            ],
            'meta' => [
                'title' => 'Tahuri Talkshow - Platform Talkshow Edukasi Terpercaya',
                'description' => 'Temukan dan daftar talkshow edukasi, workshop finansial, dan talkshow ekonomi kreatif terbaik. Platform ticketing yang mudah dan terpercaya untuk pengembangan diri Anda.',
                'keywords' => 'talkshow edukasi, workshop finansial, talkshow ekonomi kreatif, tahuri talkshow, ticketing online',
                'canonical_url' => route('home'),
            ]
        ]);
    }
}