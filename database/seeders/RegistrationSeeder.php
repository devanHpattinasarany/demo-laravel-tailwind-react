<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Event;
use App\Models\Registration;
use App\Models\CheckIn;
use App\Models\User;
use Carbon\Carbon;

class RegistrationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all events
        $events = Event::all();

        if ($events->isEmpty()) {
            $this->command->info('No events found. Please run EventSeeder first.');
            return;
        }

        // Get admin user for check-ins
        $adminUser = User::where('role', 'admin')->first();
        if (!$adminUser) {
            $this->command->info('No admin user found. Please run UserSeeder first.');
            return;
        }

        // Dummy participant data
        $participants = [
            // Event 1 - High attendance
            ['nama' => 'Siti Nurhaliza', 'email' => 'siti.nurhaliza@email.com', 'phone' => '081234567890', 'nik' => '8271234567890001'],
            ['nama' => 'Ahmad Dhani', 'email' => 'ahmad.dhani@email.com', 'phone' => '081234567891', 'nik' => '8271234567890002'],
            ['nama' => 'Raisa Andriana', 'email' => 'raisa.andriana@email.com', 'phone' => '081234567892', 'nik' => '8271234567890003'],
            ['nama' => 'Isyana Sarasvati', 'email' => 'isyana.sarasvati@email.com', 'phone' => '081234567893', 'nik' => '8271234567890004'],
            ['nama' => 'Afgan Syahreza', 'email' => 'afgan.syahreza@email.com', 'phone' => '081234567894', 'nik' => '8271234567890005'],
            ['nama' => 'Bunga Citra Lestari', 'email' => 'bunga.citra@email.com', 'phone' => '081234567895', 'nik' => '8271234567890006'],
            ['nama' => 'Rossa Roslaina', 'email' => 'rossa.roslaina@email.com', 'phone' => '081234567896', 'nik' => '8271234567890007'],
            ['nama' => 'Glenn Fredly', 'email' => 'glenn.fredly@email.com', 'phone' => '081234567897', 'nik' => '8271234567890008'],
            ['nama' => 'Sheila on 7', 'email' => 'sheila.on7@email.com', 'phone' => '081234567898', 'nik' => '8271234567890009'],
            ['nama' => 'Noah Peterpan', 'email' => 'noah.peterpan@email.com', 'phone' => '081234567899', 'nik' => '8271234567890010'],
            
            // Additional participants for variety
            ['nama' => 'Andien Aisyah', 'email' => 'andien.aisyah@email.com', 'phone' => '082234567890', 'nik' => '8271234567890011'],
            ['nama' => 'Tompi', 'email' => 'tompi@email.com', 'phone' => '082234567891', 'nik' => '8271234567890012'],
            ['nama' => 'Maudy Ayunda', 'email' => 'maudy.ayunda@email.com', 'phone' => '082234567892', 'nik' => '8271234567890013'],
            ['nama' => 'Tulus', 'email' => 'tulus@email.com', 'phone' => '082234567893', 'nik' => '8271234567890014'],
            ['nama' => 'Rizky Febian', 'email' => 'rizky.febian@email.com', 'phone' => '082234567894', 'nik' => '8271234567890015'],
            ['nama' => 'Lyodra Ginting', 'email' => 'lyodra.ginting@email.com', 'phone' => '082234567895', 'nik' => '8271234567890016'],
            ['nama' => 'Tiara Andini', 'email' => 'tiara.andini@email.com', 'phone' => '082234567896', 'nik' => '8271234567890017'],
            ['nama' => 'Judika Sihotang', 'email' => 'judika.sihotang@email.com', 'phone' => '082234567897', 'nik' => '8271234567890018'],
            ['nama' => 'Kunto Aji', 'email' => 'kunto.aji@email.com', 'phone' => '082234567898', 'nik' => '8271234567890019'],
            ['nama' => 'Fiersa Besari', 'email' => 'fiersa.besari@email.com', 'phone' => '082234567899', 'nik' => '8271234567890020'],
            
            // More participants for testing
            ['nama' => 'Maria Selena', 'email' => 'maria.selena@email.com', 'phone' => '083234567890', 'nik' => '8271234567890021'],
            ['nama' => 'Bastian Steel', 'email' => 'bastian.steel@email.com', 'phone' => '083234567891', 'nik' => '8271234567890022'],
            ['nama' => 'Prilly Latuconsina', 'email' => 'prilly.latuconsina@email.com', 'phone' => '083234567892', 'nik' => '8271234567890023'],
            ['nama' => 'Al Ghazali', 'email' => 'al.ghazali@email.com', 'phone' => '083234567893', 'nik' => '8271234567890024'],
            ['nama' => 'Ziva Magnolya', 'email' => 'ziva.magnolya@email.com', 'phone' => '083234567894', 'nik' => '8271234567890025'],
        ];

        foreach ($events as $index => $event) {
            $this->command->info("Creating registrations for event: {$event->title}");
            
            // Different attendance patterns for each event
            $registrationCount = match($index) {
                0 => 15, // First event - high registration
                1 => 12, // Second event - medium registration  
                2 => 8,  // Third event - lower registration
                default => 6
            };

            $checkinRate = match($index) {
                0 => 0.8, // 80% check-in rate
                1 => 0.6, // 60% check-in rate
                2 => 0.4, // 40% check-in rate
                default => 0.5
            };

            // Create registrations for this event
            for ($i = 0; $i < $registrationCount && $i < count($participants); $i++) {
                $participant = $participants[$i];
                
                // Create registration
                $registration = Registration::create([
                    'event_id' => $event->id,
                    'full_name' => $participant['nama'],
                    'email' => $participant['email'],
                    'phone' => $participant['phone'],
                    'nik' => $participant['nik'],
                    'ticket_number' => 'BI' . $event->event_code . str_pad($i + 1, 3, '0', STR_PAD_LEFT) . 'T',
                    'created_at' => Carbon::now()->subDays(rand(1, 30))->subHours(rand(1, 23)),
                    'updated_at' => Carbon::now()->subDays(rand(1, 30))->subHours(rand(1, 23)),
                ]);

                // Create check-in based on check-in rate
                if (rand(1, 100) <= ($checkinRate * 100)) {
                    CheckIn::create([
                        'registration_id' => $registration->id,
                        'admin_user_id' => $adminUser->id,
                        'created_at' => $registration->created_at->addHours(rand(1, 48)),
                        'updated_at' => $registration->created_at->addHours(rand(1, 48)),
                    ]);
                    
                    $this->command->info("  - {$participant['nama']} (CHECKED IN)");
                } else {
                    $this->command->info("  - {$participant['nama']} (registered only)");
                }
            }

            // Create some registrations from today for testing "today" statistics
            if ($index === 0) {
                for ($i = 0; $i < 3; $i++) {
                    $todayParticipant = [
                        'nama' => 'Test User ' . ($i + 1),
                        'email' => 'testuser' . ($i + 1) . '@email.com',
                        'phone' => '08999000' . str_pad($i + 1, 3, '0', STR_PAD_LEFT),
                        'nik' => '827123456789' . str_pad($i + 26, 4, '0', STR_PAD_LEFT),
                    ];

                    $registration = Registration::create([
                        'event_id' => $event->id,
                        'full_name' => $todayParticipant['nama'],
                        'email' => $todayParticipant['email'],
                        'phone' => $todayParticipant['phone'],
                        'nik' => $todayParticipant['nik'],
                        'ticket_number' => 'BI' . $event->event_code . str_pad($registrationCount + $i + 1, 3, '0', STR_PAD_LEFT) . 'T',
                        'created_at' => Carbon::today()->addHours(rand(8, 18)),
                        'updated_at' => Carbon::today()->addHours(rand(8, 18)),
                    ]);

                    // 50% chance of check-in today
                    if ($i < 2) {
                        CheckIn::create([
                            'registration_id' => $registration->id,
                            'admin_user_id' => $adminUser->id,
                            'created_at' => Carbon::today()->addHours(rand(10, 20)),
                            'updated_at' => Carbon::today()->addHours(rand(10, 20)),
                        ]);
                        
                        $this->command->info("  - {$todayParticipant['nama']} (TODAY - CHECKED IN)");
                    } else {
                        $this->command->info("  - {$todayParticipant['nama']} (TODAY - registered only)");
                    }
                }
            }
        }

        $totalRegistrations = Registration::count();
        $totalCheckIns = CheckIn::count();
        $attendanceRate = $totalRegistrations > 0 ? round(($totalCheckIns / $totalRegistrations) * 100, 1) : 0;

        $this->command->info('');
        $this->command->info("✅ Registration seeding completed!");
        $this->command->info("📊 Summary:");
        $this->command->info("   - Total registrations: {$totalRegistrations}");
        $this->command->info("   - Total check-ins: {$totalCheckIns}");
        $this->command->info("   - Overall attendance rate: {$attendanceRate}%");
        $this->command->info('');
        $this->command->info("🎯 Test scenarios created:");
        $this->command->info("   - Event 1: High attendance (80% check-in rate)");
        $this->command->info("   - Event 2: Medium attendance (60% check-in rate)");
        $this->command->info("   - Event 3: Low attendance (40% check-in rate)");
        $this->command->info("   - Today's activity: 3 registrations, 2 check-ins");
    }
}