<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->command->info('🚀 Starting Festival Tahuri database seeding...');
        $this->command->info('');

        $this->call([
            AdminSeeder::class,      // Create admin user first
            EventSeeder::class,      // Create events with realistic dates
            RegistrationSeeder::class, // Create registrations and check-ins
        ]);

        $this->command->info('');
        $this->command->info('🎉 Database seeding completed successfully!');
        $this->command->info('');
        $this->command->info('🔐 Admin Login:');
        $this->command->info('   Email: admin@tahuri.id');
        $this->command->info('   Password: password123');
        $this->command->info('');
        $this->command->info('🎯 Testing Ready:');
        $this->command->info('   - Today\'s talkshow has registrations ready for check-in testing');
        $this->command->info('   - Real-time statistics will show immediate updates');
        $this->command->info('   - Multiple test scenarios created for comprehensive testing');
        $this->command->info('');
        $this->command->info('📍 Quick Test Guide:');
        $this->command->info('   1. Login as admin: /login');
        $this->command->info('   2. Visit check-in system: /admin/checkin');
        $this->command->info('   3. Test search: Try "BIFLI" or participant names');
        $this->command->info('   4. Watch statistics update in real-time!');
    }
}
