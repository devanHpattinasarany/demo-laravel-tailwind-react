<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\Registration;
use Barryvdh\DomPDF\Facade\Pdf;

class RegistrationConfirmation extends Notification implements ShouldQueue
{
    use Queueable;

    protected $registration;

    /**
     * Create a new notification instance.
     */
    public function __construct(Registration $registration)
    {
        $this->registration = $registration;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $registration = $this->registration;
        $event = $registration->event;
        
        // Generate PDF for attachment
        $pdf = Pdf::loadView('pdf.ticket', ['registration' => $registration]);
        $pdf->setPaper('A4', 'portrait');
        
        $filename = sprintf(
            'E-Ticket_%s_%s.pdf',
            $registration->ticket_number,
            str_replace(' ', '_', $event->title)
        );
        
        return (new MailMessage)
            ->subject('E-Ticket Festival Tahuri 2025 - ' . $event->title)
            ->markdown('emails.registration-success', [
                'registration' => $registration,
                'event' => $event,
                'ticketUrl' => route('registrations.show', $registration)
            ])
            ->attachData($pdf->output(), $filename, [
                'mime' => 'application/pdf'
            ]);
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
