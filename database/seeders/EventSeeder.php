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
            'title' => 'Talkshow: Entrepreneurship Anak Muda Maluku',
            'event_code' => 'TLK',
            'description' => 'Inspirasi dari pengusaha muda sukses Maluku. Diskusi tentang strategi membangun bisnis lokal, memanfaatkan potensi daerah, dan menghadapi tantangan entrepreneurship di era digital.',
            'date' => '2025-08-15',
            'time' => '14:00:00',
            'location' => 'Aula Taman Budaya Maluku, Ambon',
            'max_capacity' => 150,
            'poster_url' => 'https://picsum.photos/400/600?random=1',
            'status' => 'active'
        ]);

        Event::create([
            'title' => 'Workshop: Literasi Keuangan untuk Generasi Z',
            'event_code' => 'WRK',
            'description' => 'Belajar mengelola keuangan sejak dini. Workshop tentang investasi, menabung, budgeting, dan cara cerdas menggunakan rupiah di masa muda. Cocok untuk mahasiswa dan fresh graduate.',
            'date' => '2025-08-22',
            'time' => '09:30:00',
            'location' => 'Gedung Bhupala Center, Ambon',
            'max_capacity' => 80,
            'poster_url' => 'https://picsum.photos/400/600?random=2',
            'status' => 'active'
        ]);

        Event::create([
            'title' => 'UMKM Showcase: Produk Lokal Maluku Goes Digital',
            'event_code' => 'UMK',
            'description' => 'Pameran dan demo produk UMKM Maluku terbaik. Belajar cara pemasaran digital, e-commerce, dan strategi branding untuk produk lokal agar bisa bersaing di pasar nasional.',
            'date' => '2025-09-05',
            'time' => '10:00:00',
            'location' => 'Lapangan Merdeka Ambon',
            'max_capacity' => 200,
            'poster_url' => 'https://picsum.photos/400/600?random=3',
            'status' => 'active'
        ]);
    }
}
