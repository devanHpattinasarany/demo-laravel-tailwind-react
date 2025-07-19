<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CheckIn extends Model
{
    protected $fillable = [
        'registration_id',
        'check_in_time',
        'admin_user_id',
        'status',
    ];

    protected $casts = [
        'check_in_time' => 'datetime',
    ];

    public function registration(): BelongsTo
    {
        return $this->belongsTo(Registration::class);
    }

    public function adminUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'admin_user_id');
    }

    public function scopeCheckedIn($query)
    {
        return $query->where('status', 'checked_in');
    }
}
