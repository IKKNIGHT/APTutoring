import { Event } from './supabase';

// Email service that calls our server API
class EmailService {
  async sendRSVPConfirmation(
    toEmail: string,
    studentName: string,
    event: Event
  ): Promise<boolean> {
    try {
      const response = await fetch('/api/send-rsvp-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          toEmail,
          studentName,
          event
        }),
      });

      // Read the response body only once
      const result = await response.json();

      if (!response.ok) {
        console.error('Email API failed:', result);
        return false;
      }

      if (result.success) {
        console.log('Email sent successfully:', result.emailId);
        return true;
      } else {
        console.error('Email sending failed:', result.message);
        return false;
      }
    } catch (error) {
      console.error('Email service error:', error);
      return false;
    }
  }
}

export const emailService = new EmailService();
