<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Event extends Model
{
    protected $fillable = [
        'title',
        'event_code',
        'description',
        'speakers',
        'date',
        'time',
        'location',
        'max_capacity',
        'poster_url',
        'status',
    ];

    protected $casts = [
        'date' => 'date',
        'time' => 'datetime:H:i',
    ];

    public function registrations(): HasMany
    {
        return $this->hasMany(Registration::class);
    }

    public function checkIns(): HasMany
    {
        return $this->hasManyThrough(CheckIn::class, Registration::class);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function getRegistrationCountAttribute(): int
    {
        return $this->registrations()->active()->count();
    }

    public function getCheckInCountAttribute(): int
    {
        return $this->checkIns()->checkedIn()->count();
    }

    public function isFull(): bool
    {
        return $this->registration_count >= $this->max_capacity;
    }

    public function getAvailableSlots(): int
    {
        return max(0, $this->max_capacity - $this->registration_count);
    }
}
