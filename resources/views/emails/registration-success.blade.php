@component('mail::message')

<div style="text-align: center; margin-bottom: 30px;">
    <h1 style="background: linear-gradient(45deg, #f97316, #ef4444); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 28px; font-weight: bold; margin: 0;">
        Festival Tahuri 2025
    </h1>
    <p style="color: #6b7280; font-size: 14px; margin: 5px 0 0 0;">
        Platform Edukasi & Ekonomi Kreatif Maluku
    </p>
</div>

# 🎉 Pendaftaran Berhasil!

Halo **{{ $registration->full_name }}**,

Selamat! Pendaftaran Anda untuk talkshow **{{ $event->title }}** telah berhasil dikonfirmasi.

## 📋 Detail Tiket Anda

<div style="background: linear-gradient(135deg, #fef3e8 0%, #fef2f2 100%); border: 2px solid #fed7aa; border-radius: 12px; padding: 20px; margin: 20px 0;">
    <table style="width: 100%; border-collapse: collapse;">
        <tr>
            <td style="padding: 8px 0; font-weight: 600; color: #ea580c;">Nomor Tiket:</td>
            <td style="padding: 8px 0; font-family: monospace; font-size: 18px; font-weight: bold; color: #dc2626;">{{ $registration->ticket_number }}</td>
        </tr>
        <tr>
            <td style="padding: 8px 0; font-weight: 600; color: #ea580c;">Nama Peserta:</td>
            <td style="padding: 8px 0;">{{ $registration->full_name }}</td>
        </tr>
        <tr>
            <td style="padding: 8px 0; font-weight: 600; color: #ea580c;">Email:</td>
            <td style="padding: 8px 0;">{{ $registration->email }}</td>
        </tr>
        <tr>
            <td style="padding: 8px 0; font-weight: 600; color: #ea580c;">Telepon:</td>
            <td style="padding: 8px 0;">{{ $registration->phone }}</td>
        </tr>
    </table>
</div>

## 📅 Detail Talkshow

<div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; margin: 15px 0;">
    <h3 style="margin: 0 0 10px 0; color: #111827;">{{ $event->title }}</h3>
    <p style="margin: 5px 0; color: #6b7280;"><strong>📍 Lokasi:</strong> {{ $event->location }}</p>
    <p style="margin: 5px 0; color: #6b7280;"><strong>📅 Tanggal:</strong> {{ \Carbon\Carbon::parse($event->date)->translatedFormat('l, d F Y') }}</p>
    <p style="margin: 5px 0; color: #6b7280;"><strong>⏰ Waktu:</strong> {{ \Carbon\Carbon::parse($event->start_time)->format('H:i') }} - {{ \Carbon\Carbon::parse($event->end_time)->format('H:i') }} WITA</p>
    @if($event->speakers)
    <p style="margin: 5px 0; color: #6b7280;"><strong>🎤 Narasumber:</strong> {{ $event->speakers }}</p>
    @endif
</div>

## 🎫 Tiket Anda

Tiket digital Anda telah dilampirkan dalam email ini dalam format PDF. Anda juga dapat mengakses tiket online melalui link berikut:

@component('mail::button', ['url' => $ticketUrl, 'color' => 'primary'])
Lihat Tiket Online
@endcomponent

## ⚠️ Informasi Penting

- **Simpan tiket ini** sebagai bukti pendaftaran Anda
- **Tunjukkan tiket** (digital atau cetak) saat check-in di lokasi acara  
- **Datang lebih awal** untuk proses registrasi yang lancar
- **Bawa identitas diri** (KTP/SIM) yang sesuai dengan data pendaftaran

## 📱 Kontak & Support

Jika Anda memiliki pertanyaan atau memerlukan bantuan, silakan hubungi:

- **Email:** admin@tahuri.id
- **WhatsApp:** +62 821-XXXX-XXXX
- **Website:** {{ config('app.url') }}

---

<div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
    <p style="color: #9ca3af; font-size: 12px; margin: 0;">
        Email ini dikirim otomatis oleh sistem Festival Tahuri.<br>
        Terima kasih atas partisipasi Anda dalam mengembangkan ekonomi kreatif Maluku! 🏝️
    </p>
</div>

@endcomponent