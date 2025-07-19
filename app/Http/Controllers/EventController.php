<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EventController extends Controller
{
    /**
     * Display the specified event
     */
    public function show(Event $event): Response
    {
        // Validate event exists and is active (optional - allow viewing inactive events for admin purposes)
        // If you want to restrict to active events only, uncomment the line below:
        // abort_if($event->status !== 'active', 404, 'Event not found or inactive');
        
        // Load registration count for the event
        $event->loadCount('registrations');
        
        // Format event data for frontend
        $eventData = [
            'id' => $event->id,
            'title' => $event->title,
            'event_code' => $event->event_code,
            'description' => $event->description,
            'date' => $event->date->format('Y-m-d'),
            'formatted_date' => $event->date->translatedFormat('l, d F Y'),
            'time' => $event->time->format('H:i'),
            'formatted_time' => $event->time->format('H:i') . ' WIB',
            'location' => $event->location,
            'max_capacity' => $event->max_capacity,
            'poster_url' => $event->poster_url,
            'registration_count' => $event->registrations_count,
            'available_slots' => $event->getAvailableSlots(),
            'is_full' => $event->isFull(),
            'slug' => \Str::slug($event->title),
            'status' => $event->status,
            // Calculate days until event
            'days_until' => now()->diffInDays($event->date, false),
            'is_today' => $event->date->isToday(),
            'is_tomorrow' => $event->date->isTomorrow(),
            'is_active' => $event->status === 'active',
            'can_register' => $event->status === 'active' && $event->date >= now()->toDateString() && !$event->isFull(),
        ];

        // Get 2 other events for "Event Untuk Kamu" section
        $relatedEvents = Event::select([
                'id',
                'title', 
                'poster_url',
            ])
            ->active()
            ->where('id', '!=', $event->id) // Exclude current event
            ->where('date', '>=', now()->toDateString()) // Only future events
            ->orderBy('date', 'asc')
            ->withCount(['registrations as registration_count'])
            ->limit(2)
            ->get()
            ->map(function ($relatedEvent) {
                return [
                    'id' => $relatedEvent->id,
                    'title' => $relatedEvent->title,
                    'poster_url' => $relatedEvent->poster_url,
                    'registration_count' => $relatedEvent->registration_count,
                ];
            });

        return Inertia::render('Event/Show', [
            'event' => $eventData,
            'relatedEvents' => $relatedEvents,
            'meta' => [
                'title' => $event->title . ' - Tahuri Events',
                'description' => $event->description,
                'keywords' => 'event, seminar, workshop, ' . strtolower($event->title),
                'canonical_url' => route('events.show', $event),
                'og_image' => $event->poster_url,
            ]
        ]);
    }
}