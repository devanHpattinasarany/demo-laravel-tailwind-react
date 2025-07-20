<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('registrations', function (Blueprint $table) {
            // Drop existing unique constraints
            $table->dropUnique(['nik']);
            $table->dropUnique(['phone']);
            $table->dropUnique(['email']);
            
            // Add composite unique constraints (per event)
            $table->unique(['nik', 'event_id'], 'registrations_nik_event_unique');
            $table->unique(['phone', 'event_id'], 'registrations_phone_event_unique');
            $table->unique(['email', 'event_id'], 'registrations_email_event_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('registrations', function (Blueprint $table) {
            // Drop composite constraints
            $table->dropUnique('registrations_nik_event_unique');
            $table->dropUnique('registrations_phone_event_unique');
            $table->dropUnique('registrations_email_event_unique');
            
            // Restore original unique constraints
            $table->unique('nik');
            $table->unique('phone');
            $table->unique('email');
        });
    }
};