<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Registration extends Model
{
    protected $fillable = [
        'event_id',
        'full_name',
        'nik',
        'phone',
        'email',
        'ticket_number',
        'registration_date',
        'status',
    ];

    protected $casts = [
        'registration_date' => 'datetime',
    ];

    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }

    public function checkIn(): HasOne
    {
        return $this->hasOne(CheckIn::class);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function isCheckedIn(): bool
    {
        return $this->checkIn()->exists();
    }

    public static function generateTicketNumber(string $eventCode): string
    {
        // Count existing registrations for this event code
        $existingCount = self::whereHas('event', function($query) use ($eventCode) {
            $query->where('event_code', $eventCode);
        })->count();
        
        $nextNumber = $existingCount + 1;
        return 'BI' . $eventCode . str_pad($nextNumber, 3, '0', STR_PAD_LEFT) . 'T';
    }
    
    public static function isNikAlreadyRegistered(string $nik): bool
    {
        return self::where('nik', $nik)->where('status', 'active')->exists();
    }
}
