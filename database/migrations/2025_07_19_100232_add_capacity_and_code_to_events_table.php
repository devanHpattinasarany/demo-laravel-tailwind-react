<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->string('event_code', 10)->nullable()->after('title');
            $table->integer('max_capacity')->default(100)->after('location');
        });
        
        // Update existing events with codes
        DB::table('events')->where('title', 'LIKE', '%Entrepreneurship%')->update(['event_code' => 'TLK']);
        DB::table('events')->where('title', 'LIKE', '%Literasi Keuangan%')->update(['event_code' => 'WRK']);
        DB::table('events')->where('title', 'LIKE', '%UMKM%')->update(['event_code' => 'UMK']);
        
        // Make event_code unique after populating data
        Schema::table('events', function (Blueprint $table) {
            $table->string('event_code', 10)->unique()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->dropColumn(['event_code', 'max_capacity']);
        });
    }
};
