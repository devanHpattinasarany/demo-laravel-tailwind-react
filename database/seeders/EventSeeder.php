<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Event;

class EventSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Event::create([
            'title' => 'Seminar Financial Planner',
            'event_code' => 'FP1',
            'description' => 'Belajar perencanaan keuangan dari ahlinya. Narasumber: Ligwina Hananto - Financial Planner bersertifikat internasional. Pelajari strategi investasi, perencanaan dana pendidikan, pensiun, dan proteksi keuangan keluarga.',
            'date' => '2025-08-15',
            'time' => '14:00:00',
            'location' => 'Aula Taman Budaya Maluku, Ambon',
            'max_capacity' => 500,
            'poster_url' => 'https://picsum.photos/400/600?random=1',
            'status' => 'active'
        ]);

        Event::create([
            'title' => 'Seminar Rupiah Talks Bijak Berbelanja',
            'event_code' => 'RT2',
            'description' => 'Tips belanja cerdas dan mengelola keuangan harian. Narasumber: Risyad Baya\'sud dan Pdt Marshel. Pelajari cara berbelanja bijak, menghindari konsumerisme, dan mengatur keuangan rumah tangga dengan prinsip-prinsip yang tepat.',
            'date' => '2025-08-22',
            'time' => '09:30:00',
            'location' => 'Gedung Bhupala Center, Ambon',
            'max_capacity' => 500,
            'poster_url' => 'https://picsum.photos/400/600?random=2',
            'status' => 'active'
        ]);

        Event::create([
            'title' => 'Seminar Ekonomi Kreatif',
            'event_code' => 'EK3',
            'description' => 'Membangun ekosistem ekonomi kreatif Maluku. Narasumber: Kirapassa, Tahilalats, dan Wiz Baker. Diskusi tentang pengembangan industri kreatif lokal, kolaborasi antar kreator, dan strategi monetisasi karya kreatif di era digital.',
            'date' => '2025-09-05',
            'time' => '10:00:00',
            'location' => 'Lapangan Merdeka Ambon',
            'max_capacity' => 500,
            'poster_url' => 'https://picsum.photos/400/600?random=3',
            'status' => 'active'
        ]);
    }
}
