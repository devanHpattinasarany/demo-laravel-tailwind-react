<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use App\Models\Event as Seminar;
use App\Models\Registration;
use Barryvdh\DomPDF\Facade\Pdf;

class RegistrationController extends Controller
{
    public function store(Request $request, Seminar $seminar)
    {
        // Validate basic input
        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'nik' => 'required|string|size:16|regex:/^[0-9]{16}$/',
            'phone' => 'required|string|max:20|regex:/^[0-9+\-\s]{10,16}$/',
            'email' => 'required|email|max:255',
        ], [
            'nik.size' => 'NIK harus terdiri dari 16 digit',
            'nik.regex' => 'NIK hanya boleh berisi angka',
            'phone.regex' => 'Format nomor telepon tidak valid',
        ]);

        // Check if seminar is full
        if ($seminar->isFull()) {
            throw ValidationException::withMessages([
                'general' => 'Maaf, talkshow ini sudah penuh. Tidak ada slot pendaftaran yang tersisa.'
            ]);
        }

        // Check if user already registered for this specific seminar
        $existingRegistration = Registration::where('event_id', $seminar->id)
            ->where(function ($query) use ($validated) {
                $query->where('nik', $validated['nik'])
                      ->orWhere('email', $validated['email'])
                      ->orWhere('phone', $validated['phone']);
            })
            ->where('status', 'active')
            ->first();

        if ($existingRegistration) {
            if ($existingRegistration->nik === $validated['nik']) {
                throw ValidationException::withMessages([
                    'nik' => 'NIK ini sudah terdaftar untuk talkshow ini.'
                ]);
            } elseif ($existingRegistration->email === $validated['email']) {
                throw ValidationException::withMessages([
                    'email' => 'Email ini sudah terdaftar untuk talkshow ini.'
                ]);
            } else {
                throw ValidationException::withMessages([
                    'phone' => 'Nomor telepon ini sudah terdaftar untuk talkshow ini.'
                ]);
            }
        }

        // Generate ticket number
        $ticketNumber = Registration::generateTicketNumber($seminar->event_code);

        // Create registration
        $registration = Registration::create([
            'event_id' => $seminar->id,
            'full_name' => $validated['full_name'],
            'nik' => $validated['nik'],
            'phone' => $validated['phone'],
            'email' => $validated['email'],
            'ticket_number' => $ticketNumber,
            'registration_date' => now(),
            'status' => 'active',
        ]);

        // Redirect to ticket display page
        return redirect()->route('registrations.show', $registration)->with([
            'success' => 'Pendaftaran berhasil! Tiket Anda: ' . $ticketNumber
        ]);
    }

    public function show(Registration $registration)
    {
        $registration->load('event');

        return Inertia::render('Registration/Show', [
            'registration' => $registration
        ]);
    }

    public function downloadPdf(Registration $registration)
    {
        // Load the seminar relationship
        $registration->load('event');

        // Create PDF from the ticket template
        $pdf = Pdf::loadView('pdf.ticket', compact('registration'));

        // Set landscape orientation for ticket
        $pdf->setPaper([0, 0, 278, 800], 'landscape');

        // Generate filename
        $filename = 'Ticket_' . $registration->ticket_number . '.pdf';

        // Return PDF as download
        return $pdf->download($filename);
    }
}
