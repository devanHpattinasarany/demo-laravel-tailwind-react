<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Event;
use Carbon\Carbon;

class EventSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('🎯 Creating test events with realistic dates...');

        // EVENT 1: HARI INI - Untuk testing check-in system
        $today = Carbon::today();
        Event::create([
            'title' => 'Talkshow Financial Literacy & Investment',
            'event_code' => 'FLI',
            'description' => 'Talkshow khusus tentang literasi keuangan dan investasi untuk pemula. Belajar langsung dari praktisi berpengalaman tentang cara memulai investasi yang aman dan menguntungkan.',
            'speakers' => 'Ligwina Hananto, Ryan Filbert',
            'date' => $today->format('Y-m-d'),
            'time' => '14:00:00',
            'location' => 'Taman Budaya Maluku, Ambon',
            'max_capacity' => 500,
            'poster_url' => 'https://picsum.photos/400/600?random=1',
            'status' => 'active'
        ]);
        $this->command->info("✅ Event hari ini: {$today->format('d M Y')} - Talkshow Financial Literacy");

        // EVENT 2: BESOK - Untuk testing filter date
        $tomorrow = Carbon::tomorrow();
        Event::create([
            'title' => 'Talkshow Rupiah Talks: Smart Shopping',
            'event_code' => 'RST',
            'description' => 'Talkshow interaktif tentang belanja cerdas dan pengelolaan keuangan harian. Tips praktis mengatur budget bulanan, menghindari impulse buying, dan memaksimalkan nilai setiap rupiah.',
            'speakers' => 'Risyad Baya\'sud, Pdt Marshel',
            'date' => $tomorrow->format('Y-m-d'),
            'time' => '09:30:00',
            'location' => 'Taman Budaya Maluku, Ambon',
            'max_capacity' => 500,
            'poster_url' => 'https://picsum.photos/400/600?random=2',
            'status' => 'active'
        ]);
        $this->command->info("✅ Event besok: {$tomorrow->format('d M Y')} - Talkshow Smart Shopping");

        // EVENT 3: MINGGU DEPAN - Untuk testing upcoming events
        $nextWeek = Carbon::today()->addWeek();
        Event::create([
            'title' => 'Talkshow Ekonomi Kreatif Maluku',
            'event_code' => 'EKM',
            'description' => 'Talkshow tentang membangun ekosistem ekonomi kreatif di Maluku. Diskusi bersama kreator lokal tentang pengembangan industri kreatif, kolaborasi komunitas, dan strategi monetisasi karya di era digital.',
            'speakers' => 'Kirapassa, Tahilalats, Wiz Baker',
            'date' => $nextWeek->format('Y-m-d'),
            'time' => '10:00:00',
            'location' => 'Taman Budaya Maluku, Ambon',
            'max_capacity' => 500,
            'poster_url' => 'https://picsum.photos/400/600?random=3',
            'status' => 'active'
        ]);
        $this->command->info("✅ Event minggu depan: {$nextWeek->format('d M Y')} - Talkshow Ekonomi Kreatif");

        // EVENT 4: BULAN DEPAN - Untuk testing calendar
        $nextMonth = Carbon::today()->addMonth();
        Event::create([
            'title' => 'Talkshow Digital Marketing untuk UMKM',
            'event_code' => 'DMU',
            'description' => 'Talkshow praktis tentang pemasaran digital untuk usaha mikro kecil menengah. Belajar strategi media sosial, content marketing, dan e-commerce untuk meningkatkan penjualan.',
            'speakers' => 'Gita Savitri, Raditya Dika',
            'date' => $nextMonth->format('Y-m-d'),
            'time' => '13:30:00',
            'location' => 'Taman Budaya Maluku, Ambon',
            'max_capacity' => 500,
            'poster_url' => 'https://picsum.photos/400/600?random=4',
            'status' => 'active'
        ]);
        $this->command->info("✅ Event bulan depan: {$nextMonth->format('d M Y')} - Talkshow Digital Marketing");

        // EVENT 5: KEMARIN - Untuk testing past events
        $yesterday = Carbon::yesterday();
        Event::create([
            'title' => 'Talkshow Startup & Tech Innovation',
            'event_code' => 'STI',
            'description' => 'Talkshow tentang dunia startup dan inovasi teknologi. Sharing experience dari founder successful startup tentang journey membangun bisnis tech dari nol.',
            'speakers' => 'William Tanuwijaya, Achmad Zaky',
            'date' => $yesterday->format('Y-m-d'),
            'time' => '15:00:00',
            'location' => 'Taman Budaya Maluku, Ambon',
            'max_capacity' => 500,
            'poster_url' => 'https://picsum.photos/400/600?random=5',
            'status' => 'active'
        ]);
        $this->command->info("✅ Event kemarin: {$yesterday->format('d M Y')} - Talkshow Startup & Tech");

        $this->command->info('');
        $this->command->info('🎉 Event seeding completed!');
        $this->command->info('📅 Test scenarios:');
        $this->command->info("   - TODAY ({$today->format('d/m/Y')}): Financial Literacy - untuk test check-in");
        $this->command->info("   - TOMORROW ({$tomorrow->format('d/m/Y')}): Smart Shopping - untuk test filter");
        $this->command->info("   - NEXT WEEK ({$nextWeek->format('d/m/Y')}): Ekonomi Kreatif - upcoming event");
        $this->command->info("   - NEXT MONTH ({$nextMonth->format('d/m/Y')}): Digital Marketing - future planning");
        $this->command->info("   - YESTERDAY ({$yesterday->format('d/m/Y')}): Startup & Tech - past event");
    }
}
