<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        @page {
            margin: 0;
        }
        body {
            margin: 0;
            padding: 0;
            font-family: 'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: white;
            width: 800px;
            height: 320px;
            font-feature-settings: 'kern' 1, 'liga' 1;
            text-rendering: optimizeLegibility;
        }
        .ticket {
            width: 800px;
            height: 320px;
            display: table;
            page-break-inside: avoid;
        }

        /* LEFT - ORANGE */
        .left {
            display: table-cell;
            width: 560px;
            height: 320px;
            background: #f97316;
            color: white;
            padding: 25px;
            vertical-align: top;
            box-sizing: border-box;
        }

        /* RIGHT - WHITE */
        .right {
            display: table-cell;
            width: 240px;
            height: 320px;
            background: white;
            padding: 15px 15px 15px 100px;
            border-left: 2px dashed #f97316;
            vertical-align: middle;
            box-sizing: border-box;
        }

        .brand-text {
            margin: 0 0 8px 0;
            font-size: 18px;
            font-weight: 400;
            line-height: 1.2;
            letter-spacing: 2px;
            text-transform: uppercase;
            opacity: 0.95;
        }
        .event-title {
            margin: 0 0 10px 0;
            font-size: 30px;
            font-weight: 600;
            line-height: 1.0;
            letter-spacing: -0.5px;
            text-transform: uppercase;
        }
        .event-description {
            font-size: 15px;
            line-height: 1.3;
            font-weight: 300;
            margin-bottom: 12px;
            opacity: 0.85;
        }
        .event-details {
            font-size: 16px;
            line-height: 1.3;
            font-weight: 400;
            margin-top: 8px;
        }
        .date-container {
            margin-top: 12px;
        }
        .event-details div {
            margin-bottom: 4px;
        }
        .date-display {
            background: #ea580c;
            padding: 14px 18px;
            border-radius: 10px;
            text-align: center;
            width: 90px;
            margin: 0;
            border: 2px solid rgba(255,255,255,0.3);
        }
        .date-day {
            font-size: 26px;
            font-weight: 500;
            line-height: 1;
            margin-bottom: 3px;
        }
        .date-month {
            font-size: 12px;
            font-weight: 400;
            letter-spacing: 1px;
            text-transform: uppercase;
            opacity: 0.95;
        }

        .section-label {
            font-size: 11px;
            color: #888;
            font-weight: 500;
            margin-bottom: 6px;
            letter-spacing: 1px;
            text-transform: uppercase;
            text-align: center;
        }
        .ticket-number {
            font-size: 24px;
            color: #f97316;
            font-weight: 600;
            margin-bottom: 15px;
            line-height: 1;
            letter-spacing: 0.5px;
            padding: 8px 12px;
            background: rgba(249,115,22,0.08);
            border-radius: 8px;
            border: 1px dashed #f97316;
            text-align: center;
            font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
        }
        .participant-info {
            margin-bottom: 15px;
            text-align: center;
        }
        .user-name {
            font-size: 17px;
            font-weight: 500;
            margin-bottom: 4px;
            line-height: 1.2;
            color: #2a2a2a;
        }
        .user-phone {
            font-size: 15px;
            color: #666;
            font-weight: 400;
        }
        .access-info {
            margin-top: 12px;
            padding: 8px;
            background: #f9f9f9;
            border-radius: 8px;
            border: 1px solid #e0e0e0;
            text-align: center;
        }
        .gate-title {
            color: #f97316;
            font-weight: 500;
            font-size: 13px;
            letter-spacing: 0.5px;
        }
        .gate-instruction {
            font-size: 10px;
            color: #777;
            margin-top: 3px;
            font-weight: 300;
            line-height: 1.2;
        }
        .footer-info {
            margin-top: 10px;
            font-size: 9px;
            color: #999;
            text-align: center;
            line-height: 1.2;
        }
        .logo-text {
            margin-top: 6px;
            font-size: 8px;
            color: #bbb;
            text-align: center;
            letter-spacing: 1px;
            font-weight: 300;
        }
        .brand-logo-text {
            margin: 0 0 6px 0;
            text-align: left;
            font-size: 20px;
            font-weight: 700;
            color: white;
            letter-spacing: 2px;
            text-transform: uppercase;
        }
        .brand-text {
            margin: 0 0 8px 0;
            font-size: 18px;
            font-weight: 400;
            line-height: 1.2;
            letter-spacing: 2px;
            text-transform: uppercase;
            opacity: 0.95;
        }
        .event-title {
            margin: 0 0 10px 0;
            font-size: 28px;
            font-weight: 600;
            line-height: 1.0;
            letter-spacing: -0.5px;
            text-transform: uppercase;
        }
        .event-description {
            font-size: 15px;
            line-height: 1.3;
            font-weight: 300;
            margin-bottom: 10px;
            opacity: 0.85;
        }
    </style>
</head>
<body>
    <div class="ticket">
        <div class="left">
            <div class="brand-text">RABURABUMARKET X FESTIVAL TAHURI</div>
            <div class="event-title">{{ strtoupper($registration->event->title) }}</div>

            <div class="event-description">
                {{ Str::limit($registration->event->description ?? 'Workshop kreatif untuk mengembangkan keterampilan literasi keuangan bagi generasi muda dalam era digital modern.', 120) }}
            </div>

            <div class="date-container">
                <div class="date-display">
                    <div class="date-day">{{ $registration->event->date->format('d') }}</div>
                    <div class="date-month">{{ strtoupper($registration->event->date->translatedFormat('M')) }}</div>
                </div>
            </div>

            <div class="event-details">
                <div>{{ $registration->event->time }} WIB</div>
                <div>{{ $registration->event->location }}</div>
            </div>
        </div>

        <div class="right">
            <div class="section-label">Nomor Tiket</div>
            <div class="ticket-number">{{ $registration->ticket_number }}</div>

            <div class="section-label participant">Peserta</div>
            <div class="participant-info">
                <div class="user-name">{{ $registration->full_name }}</div>
                <div class="user-phone">{{ $registration->phone }}</div>
            </div>

            <div class="access-info">
                <div class="gate-title">INFO</div>
                <div class="gate-instruction">Tunjukkan tiket ini saat masuk</div>
            </div>

            <div class="footer-info">
                <div>Tiket valid untuk 1 orang</div>
                <div>Harap datang 15 menit sebelum acara</div>
            </div>

            <div class="logo-text">
                FESTIVAL TAHURI 2025
            </div>
        </div>
    </div>
</body>
</html>
