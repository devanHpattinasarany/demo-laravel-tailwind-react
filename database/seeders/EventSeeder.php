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
            'description' => 'Belajar perencanaan keuangan dari ahlinya. Pelajari strategi investasi, perencanaan dana pendidikan, pensiun, dan proteksi keuangan keluarga.',
            'speakers' => 'Ligwina Hananto',
            'date' => '2025-08-15',
            'time' => '14:00:00',
            'location' => 'Taman Budaya Maluku, Ambon',
            'max_capacity' => 500,
            'poster_url' => 'https://picsum.photos/400/600?random=1',
            'status' => 'active'
        ]);

        Event::create([
            'title' => 'Seminar Rupiah Talks Bijak Berbelanja',
            'event_code' => 'RT2',
            'description' => 'Tips belanja cerdas dan mengelola keuangan harian. Pelajari cara berbelanja bijak, menghindari konsumerisme, dan mengatur keuangan rumah tangga dengan prinsip-prinsip yang tepat.',
            'speakers' => 'Risyad Baya\'sud, Pdt Marshel',
            'date' => '2025-08-22',
            'time' => '09:30:00',
            'location' => 'Taman Budaya Maluku, Ambon',
            'max_capacity' => 500,
            'poster_url' => 'https://picsum.photos/400/600?random=2',
            'status' => 'active'
        ]);

        Event::create([
            'title' => 'Seminar Ekonomi Kreatif',
            'event_code' => 'EK3',
            'description' => 'Membangun ekosistem ekonomi kreatif Maluku. Diskusi tentang pengembangan industri kreatif lokal, kolaborasi antar kreator, dan strategi monetisasi karya kreatif di era digital.',
            'speakers' => 'Kirapassa, Tahilalats, Wiz Baker',
            'date' => '2025-09-05',
            'time' => '10:00:00',
            'location' => 'Taman Budaya Maluku, Ambon',
            'max_capacity' => 500,
            'poster_url' => 'https://picsum.photos/400/600?random=3',
            'status' => 'active'
        ]);
    }
}
