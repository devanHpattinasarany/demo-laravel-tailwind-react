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

        $this->command->info('🎭 Preparing realistic test participants...');

        // Realistic Maluku participant names with local flavor
        $participants = [
            // Popular Indonesian names suitable for financial/tech audience
            ['nama' => 'Sarah Amalia Pattiasina', 'email' => 'sarah.pattiasina@gmail.com', 'phone' => '081234567890', 'nik' => '8271234567890001'],
            ['nama' => 'Muhammad Rizki Latuheru', 'email' => 'rizki.latuheru@gmail.com', 'phone' => '081234567891', 'nik' => '8271234567890002'],
            ['nama' => 'Anastasia Putri Rehatta', 'email' => 'ana.rehatta@gmail.com', 'phone' => '081234567892', 'nik' => '8271234567890003'],
            ['nama' => 'David Jonathan Sapulette', 'email' => 'david.sapulette@gmail.com', 'phone' => '081234567893', 'nik' => '8271234567890004'],
            ['nama' => 'Melissa Grace Leiwakabessy', 'email' => 'melissa.leiwakabessy@gmail.com', 'phone' => '081234567894', 'nik' => '8271234567890005'],
            
            ['nama' => 'Felix Alexander Siahaya', 'email' => 'felix.siahaya@gmail.com', 'phone' => '081234567895', 'nik' => '8271234567890006'],
            ['nama' => 'Christina Maria Tuasikal', 'email' => 'christina.tuasikal@gmail.com', 'phone' => '081234567896', 'nik' => '8271234567890007'],
            ['nama' => 'Andrew Kevin Pesulima', 'email' => 'andrew.pesulima@gmail.com', 'phone' => '081234567897', 'nik' => '8271234567890008'],
            ['nama' => 'Gabriella Sari Louhenapessy', 'email' => 'gabriella.louhenapessy@gmail.com', 'phone' => '081234567898', 'nik' => '8271234567890009'],
            ['nama' => 'Ryan Pratama Pattinasarany', 'email' => 'ryan.pattinasarany@gmail.com', 'phone' => '081234567899', 'nik' => '8271234567890010'],
            
            // Additional realistic names for variety
            ['nama' => 'Jessica Angeline Tehupeiory', 'email' => 'jessica.tehupeiory@gmail.com', 'phone' => '082234567890', 'nik' => '8271234567890011'],
            ['nama' => 'Daniel Steven Kaihatu', 'email' => 'daniel.kaihatu@gmail.com', 'phone' => '082234567891', 'nik' => '8271234567890012'],
            ['nama' => 'Veronica Maya Titaley', 'email' => 'veronica.titaley@gmail.com', 'phone' => '082234567892', 'nik' => '8271234567890013'],
            ['nama' => 'Jonathan Michael Salampessy', 'email' => 'jonathan.salampessy@gmail.com', 'phone' => '082234567893', 'nik' => '8271234567890014'],
            ['nama' => 'Amanda Christy Pelupessy', 'email' => 'amanda.pelupessy@gmail.com', 'phone' => '082234567894', 'nik' => '8271234567890015'],
            
            ['nama' => 'Nicholas Bryan Lestaluhu', 'email' => 'nicholas.lestaluhu@gmail.com', 'phone' => '082234567895', 'nik' => '8271234567890016'],
            ['nama' => 'Stephanie Claire Mailoa', 'email' => 'stephanie.mailoa@gmail.com', 'phone' => '082234567896', 'nik' => '8271234567890017'],
            ['nama' => 'Kevin Alexander Salainti', 'email' => 'kevin.salainti@gmail.com', 'phone' => '082234567897', 'nik' => '8271234567890018'],
            ['nama' => 'Isabella Grace Solissa', 'email' => 'isabella.solissa@gmail.com', 'phone' => '082234567898', 'nik' => '8271234567890019'],
            ['nama' => 'Matthew Joshua Tamaela', 'email' => 'matthew.tamaela@gmail.com', 'phone' => '082234567899', 'nik' => '8271234567890020'],
            
            // More participants for comprehensive testing
            ['nama' => 'Natasha Olivia Latuamury', 'email' => 'natasha.latuamury@gmail.com', 'phone' => '083234567890', 'nik' => '8271234567890021'],
            ['nama' => 'Christopher Robin Matuankotta', 'email' => 'christopher.matuankotta@gmail.com', 'phone' => '083234567891', 'nik' => '8271234567890022'],
            ['nama' => 'Michelle Stefanny Persulessy', 'email' => 'michelle.persulessy@gmail.com', 'phone' => '083234567892', 'nik' => '8271234567890023'],
            ['nama' => 'Gabriel Vincent Sahetapy', 'email' => 'gabriel.sahetapy@gmail.com', 'phone' => '083234567893', 'nik' => '8271234567890024'],
            ['nama' => 'Felicia Cynthia Tamaheuw', 'email' => 'felicia.tamaheuw@gmail.com', 'phone' => '083234567894', 'nik' => '8271234567890025'],
            
            // Quick test participants with simple names for easy search
            ['nama' => 'Test User Alpha', 'email' => 'test.alpha@test.com', 'phone' => '089900001111', 'nik' => '8271234567890030'],
            ['nama' => 'Test User Beta', 'email' => 'test.beta@test.com', 'phone' => '089900001112', 'nik' => '8271234567890031'],
            ['nama' => 'Test User Gamma', 'email' => 'test.gamma@test.com', 'phone' => '089900001113', 'nik' => '8271234567890032'],
            ['nama' => 'John Doe Testing', 'email' => 'john.doe@test.com', 'phone' => '089900001114', 'nik' => '8271234567890033'],
            ['nama' => 'Jane Smith Demo', 'email' => 'jane.smith@test.com', 'phone' => '089900001115', 'nik' => '8271234567890034'],
        ];

        // Use a shuffled array to distribute participants across events
        $shuffledParticipants = $participants;
        shuffle($shuffledParticipants);
        $participantIndex = 0;

        foreach ($events as $index => $event) {
            $this->command->info("📝 Creating registrations for: {$event->title}");
            $eventDate = Carbon::parse($event->date);
            $isToday = $eventDate->isToday();
            
            // Smart registration patterns based on event timing and type
            [$registrationCount, $checkinRate] = match($index) {
                0 => [20, 0.7], // TODAY - Financial Literacy (high interest, 70% attend)
                1 => [15, 0.6], // TOMORROW - Smart Shopping (medium interest, 60% attend)
                2 => [12, 0.5], // NEXT WEEK - Ekonomi Kreatif (medium interest, 50% attend)
                3 => [8, 0.4],  // NEXT MONTH - Digital Marketing (lower early registration, 40% attend)
                4 => [18, 0.9], // YESTERDAY - Startup & Tech (high interest, high attendance)
                default => [10, 0.5]
            };

            // Create registrations for this event
            for ($i = 0; $i < $registrationCount && $participantIndex < count($shuffledParticipants); $i++) {
                $participant = $shuffledParticipants[$participantIndex];
                $participantIndex++;
                
                // Smart registration timing based on event date
                $registrationTime = match(true) {
                    $isToday => Carbon::today()->subDays(rand(1, 7))->addHours(rand(8, 20)), // Register few days before
                    $eventDate->isTomorrow() => Carbon::now()->subDays(rand(2, 10))->addHours(rand(8, 20)),
                    $eventDate->isPast() => $eventDate->subDays(rand(7, 30))->addHours(rand(8, 20)),
                    default => Carbon::now()->subDays(rand(1, 14))->addHours(rand(8, 20))
                };
                
                // Create registration
                $registration = Registration::create([
                    'event_id' => $event->id,
                    'full_name' => $participant['nama'],
                    'email' => $participant['email'],
                    'phone' => $participant['phone'],
                    'nik' => $participant['nik'],
                    'ticket_number' => 'BI' . $event->event_code . str_pad($i + 1, 3, '0', STR_PAD_LEFT) . 'T',
                    'created_at' => $registrationTime,
                    'updated_at' => $registrationTime,
                ]);

                // Smart check-in logic based on event timing
                $shouldCheckin = false;
                $checkinTime = null;

                if ($eventDate->isPast()) {
                    // Past events: create check-ins based on attendance rate
                    $shouldCheckin = (rand(1, 100) <= ($checkinRate * 100));
                    $checkinTime = $eventDate->addHours(rand(1, 3)); // Check-in during event time
                } elseif ($isToday) {
                    // Today's events: some early check-ins for testing
                    $shouldCheckin = (rand(1, 100) <= 30); // 30% already checked in today
                    $checkinTime = Carbon::today()->addHours(rand(8, 12)); // Morning check-ins
                }

                if ($shouldCheckin) {
                    CheckIn::create([
                        'registration_id' => $registration->id,
                        'admin_user_id' => $adminUser->id,
                        'check_in_time' => $checkinTime,
                        'status' => 'checked_in',
                        'created_at' => $checkinTime,
                        'updated_at' => $checkinTime,
                    ]);
                    
                    $status = $isToday ? 'TODAY - CHECKED IN ✅' : 'CHECKED IN ✅';
                    $this->command->info("  - {$participant['nama']} ({$status})");
                } else {
                    $status = $isToday ? 'TODAY - REGISTERED ⏳' : 'REGISTERED ⏳';
                    $this->command->info("  - {$participant['nama']} ({$status})");
                }
            }

            // Special test registrations for TODAY's event (for testing check-in system)
            if ($isToday && $participantIndex < count($shuffledParticipants) - 5) {
                $this->command->info("  🧪 Adding special test registrations for check-in testing...");
                
                for ($i = 0; $i < 5; $i++) {
                    $testParticipant = $shuffledParticipants[$participantIndex];
                    $participantIndex++;

                    $registration = Registration::create([
                        'event_id' => $event->id,
                        'full_name' => $testParticipant['nama'],
                        'email' => $testParticipant['email'],
                        'phone' => $testParticipant['phone'],
                        'nik' => $testParticipant['nik'],
                        'ticket_number' => 'BI' . $event->event_code . str_pad($registrationCount + $i + 1, 3, '0', STR_PAD_LEFT) . 'T',
                        'created_at' => Carbon::today()->subDays(rand(1, 3))->addHours(rand(8, 18)),
                        'updated_at' => Carbon::today()->subDays(rand(1, 3))->addHours(rand(8, 18)),
                    ]);

                    // Only 2 out of 5 already checked in for testing
                    if ($i < 2) {
                        CheckIn::create([
                            'registration_id' => $registration->id,
                            'admin_user_id' => $adminUser->id,
                            'check_in_time' => Carbon::today()->addHours(rand(9, 11)),
                            'status' => 'checked_in',
                            'created_at' => Carbon::today()->addHours(rand(9, 11)),
                            'updated_at' => Carbon::today()->addHours(rand(9, 11)),
                        ]);
                        
                        $this->command->info("  - {$testParticipant['nama']} (TEST - ALREADY CHECKED IN ✅)");
                    } else {
                        $this->command->info("  - {$testParticipant['nama']} (TEST - READY FOR CHECK-IN ⏳)");
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