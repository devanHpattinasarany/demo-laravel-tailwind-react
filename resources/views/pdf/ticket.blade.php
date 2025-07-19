<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>E-Ticket {{ $registration->ticket_number }} - {{ $registration->event->title }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            font-size: 14px;
            line-height: 1.6;
            color: #1f2937;
            background: linear-gradient(135deg, #fef7ed 0%, #fff5f5 100%);
            padding: 20px;
        }

        .ticket-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(234, 88, 12, 0.15);
            overflow: hidden;
            border: 3px solid #fed7aa;
        }

        .ticket-header {
            background: linear-gradient(135deg, #ea580c 0%, #dc2626 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
            position: relative;
        }

        .ticket-header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.1) 75%), 
                        linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.1) 75%);
            background-size: 20px 20px;
            background-position: 0 0, 10px 10px;
            opacity: 0.3;
        }

        .festival-logo {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 8px;
            position: relative;
            z-index: 1;
        }

        .festival-subtitle {
            font-size: 16px;
            opacity: 0.9;
            margin-bottom: 20px;
            position: relative;
            z-index: 1;
        }

        .ticket-icon {
            width: 60px;
            height: 60px;
            margin: 0 auto 20px;
            position: relative;
            z-index: 1;
        }

        .ticket-number {
            background: rgba(255, 255, 255, 0.2);
            border: 2px solid rgba(255, 255, 255, 0.3);
            padding: 12px 30px;
            border-radius: 50px;
            font-size: 24px;
            font-weight: bold;
            letter-spacing: 3px;
            display: inline-block;
            position: relative;
            z-index: 1;
        }

        .ticket-body {
            padding: 40px 30px;
        }

        .event-title {
            font-size: 32px;
            font-weight: bold;
            color: #ea580c;
            text-align: center;
            margin-bottom: 30px;
            line-height: 1.2;
        }

        .event-details {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            margin-bottom: 40px;
        }

        .detail-card {
            flex: 1;
            min-width: 200px;
            background: linear-gradient(135deg, #fef7ed 0%, #fed7aa 100%);
            border: 2px solid #fdba74;
            border-radius: 12px;
            padding: 20px;
            text-align: center;
        }

        .detail-icon {
            width: 40px;
            height: 40px;
            background: #ea580c;
            border-radius: 50%;
            margin: 0 auto 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
        }

        .detail-label {
            font-size: 12px;
            color: #ea580c;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 5px;
        }

        .detail-value {
            font-size: 16px;
            font-weight: bold;
            color: #1f2937;
        }

        .divider {
            border: none;
            border-top: 3px dashed #fdba74;
            margin: 30px 0;
            opacity: 0.7;
        }

        .participant-info {
            background: linear-gradient(135deg, #fef7ed 0%, #fef2f2 100%);
            border: 2px solid #fdba74;
            border-radius: 12px;
            padding: 30px;
            margin-bottom: 30px;
        }

        .participant-title {
            font-size: 20px;
            font-weight: bold;
            color: #ea580c;
            text-align: center;
            margin-bottom: 25px;
        }

        .participant-details {
            display: flex;
            flex-wrap: wrap;
            gap: 25px;
        }

        .participant-field {
            flex: 1;
            min-width: 150px;
        }

        .field-label {
            font-size: 11px;
            color: #6b7280;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 5px;
        }

        .field-value {
            font-size: 16px;
            font-weight: bold;
            color: #1f2937;
            word-break: break-word;
        }

        .important-notes {
            background: rgba(254, 226, 226, 0.5);
            border: 2px solid #fca5a5;
            border-radius: 12px;
            padding: 25px;
            margin-bottom: 30px;
        }

        .notes-title {
            font-size: 18px;
            font-weight: bold;
            color: #dc2626;
            margin-bottom: 20px;
            text-align: center;
        }

        .note-item {
            display: flex;
            align-items: flex-start;
            margin-bottom: 15px;
            gap: 15px;
        }

        .note-number {
            width: 24px;
            height: 24px;
            background: #ea580c;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: bold;
            flex-shrink: 0;
        }

        .note-text {
            font-size: 14px;
            color: #374151;
            line-height: 1.5;
        }

        .footer {
            text-align: center;
            color: #6b7280;
            font-size: 12px;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 2px solid #f3f4f6;
        }

        .qr-placeholder {
            width: 100px;
            height: 100px;
            background: #f3f4f6;
            border: 2px solid #d1d5db;
            border-radius: 8px;
            margin: 20px auto;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            color: #6b7280;
            text-align: center;
        }

        /* Print optimizations */
        @media print {
            body {
                background: white;
                padding: 0;
            }
            
            .ticket-container {
                box-shadow: none;
                border: 1px solid #e5e7eb;
            }
        }
    </style>
</head>
<body>
    <div class="ticket-container">
        <!-- Ticket Header -->
        <div class="ticket-header">
            <div class="festival-logo">FESTIVAL TAHURI 2025</div>
            <div class="festival-subtitle">Celebrasi Kreativitas Maluku</div>
            
            <!-- Ticket Icon Placeholder -->
            <div class="ticket-icon">
                <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
            </div>
            
            <div class="ticket-number">{{ $registration->ticket_number }}</div>
        </div>

        <!-- Ticket Body -->
        <div class="ticket-body">
            <!-- Event Title -->
            <div class="event-title">{{ $registration->event->title }}</div>

            <!-- Event Details -->
            <div class="event-details">
                <div class="detail-card">
                    <div class="detail-icon">📅</div>
                    <div class="detail-label">Tanggal</div>
                    <div class="detail-value">
                        @if($registration->event->date)
                            {{ \Carbon\Carbon::parse($registration->event->date)->translatedFormat('l, d F Y') }}
                        @else
                            Tanggal belum tersedia
                        @endif
                    </div>
                </div>

                <div class="detail-card">
                    <div class="detail-icon">🕐</div>
                    <div class="detail-label">Waktu</div>
                    <div class="detail-value">{{ $registration->event->time }} WIB</div>
                </div>

                <div class="detail-card">
                    <div class="detail-icon">📍</div>
                    <div class="detail-label">Lokasi</div>
                    <div class="detail-value">{{ $registration->event->location }}</div>
                </div>
            </div>

            <!-- Divider -->
            <hr class="divider">

            <!-- Participant Information -->
            <div class="participant-info">
                <div class="participant-title">Informasi Peserta</div>
                <div class="participant-details">
                    <div class="participant-field">
                        <div class="field-label">Nama Lengkap</div>
                        <div class="field-value">{{ $registration->full_name }}</div>
                    </div>
                    <div class="participant-field">
                        <div class="field-label">NIK</div>
                        <div class="field-value">{{ $registration->nik }}</div>
                    </div>
                    <div class="participant-field">
                        <div class="field-label">Nomor Telepon</div>
                        <div class="field-value">{{ $registration->phone }}</div>
                    </div>
                    <div class="participant-field">
                        <div class="field-label">Email</div>
                        <div class="field-value">{{ $registration->email }}</div>
                    </div>
                </div>
            </div>

            <!-- Important Notes -->
            <div class="important-notes">
                <div class="notes-title">Catatan Penting</div>
                
                <div class="note-item">
                    <div class="note-number">1</div>
                    <div class="note-text">Simpan tiket ini dengan baik dan tunjukkan saat check-in di lokasi event</div>
                </div>

                <div class="note-item">
                    <div class="note-number">2</div>
                    <div class="note-text">Datang 30 menit sebelum acara dimulai untuk proses check-in</div>
                </div>

                <div class="note-item">
                    <div class="note-number">3</div>
                    <div class="note-text">Bawa identitas asli (KTP) yang sesuai dengan data pendaftaran</div>
                </div>

                <div class="note-item">
                    <div class="note-number">4</div>
                    <div class="note-text">Tiket tidak dapat dipindahtangankan kepada orang lain</div>
                </div>
            </div>

            <!-- QR Code Placeholder -->
            <div class="qr-placeholder">
                QR CODE<br>
                {{ $registration->ticket_number }}
            </div>

            <!-- Footer -->
            <div class="footer">
                <p><strong>Festival Tahuri 2025</strong> - Celebrasi Kreativitas Maluku</p>
                <p>Dicetak pada {{ now()->translatedFormat('d F Y, H:i') ?? now()->format('d M Y, H:i') }} WIB</p>
                <p>Info: support@tahuri.id | www.tahuri.id</p>
            </div>
        </div>
    </div>
</body>
</html>