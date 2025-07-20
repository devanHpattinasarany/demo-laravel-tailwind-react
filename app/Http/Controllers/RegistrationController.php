<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use App\Models\Event;
use App\Models\Registration;
use Barryvdh\DomPDF\Facade\Pdf;

class RegistrationController extends Controller
{
    public function store(Request $request, Event $event)
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

        // Check if event is full
        if ($event->isFull()) {
            throw ValidationException::withMessages([
                'general' => 'Maaf, event ini sudah penuh. Tidak ada slot pendaftaran yang tersisa.'
            ]);
        }

        // Check if NIK is already registered (global restriction)
        if (Registration::isNikAlreadyRegistered($validated['nik'])) {
            throw ValidationException::withMessages([
                'nik' => 'NIK ini sudah pernah digunakan untuk mendaftar event. Satu NIK hanya dapat digunakan untuk satu pendaftaran.'
            ]);
        }

        // Check if user already registered for this event with email or phone
        $existingRegistration = Registration::where('event_id', $event->id)
            ->where(function ($query) use ($validated) {
                $query->where('email', $validated['email'])
                      ->orWhere('phone', $validated['phone']);
            })
            ->where('status', 'active')
            ->first();

        if ($existingRegistration) {
            $field = $existingRegistration->email === $validated['email'] ? 'email' : 'phone';
            throw ValidationException::withMessages([
                $field => 'Anda sudah terdaftar untuk event ini dengan ' . ($field === 'email' ? 'email' : 'nomor telepon') . ' yang sama.'
            ]);
        }

        // Generate ticket number
        $ticketNumber = Registration::generateTicketNumber($event->event_code);

        // Create registration
        $registration = Registration::create([
            'event_id' => $event->id,
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
        // Load the event relationship
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
