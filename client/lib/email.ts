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

      // Clone the response to avoid body stream conflicts
      const responseClone = response.clone();

      if (!response.ok) {
        console.error('Email API failed:', {
          status: response.status,
          statusText: response.statusText
        });
        return false;
      }

      try {
        // Use the cloned response to read the body
        const result = await responseClone.json();
        
        if (result && result.success) {
          console.log('Email sent successfully:', result.emailId);
          return true;
        } else {
          console.error('Email sending failed:', result?.message || 'Unknown error');
          return false;
        }
      } catch (parseError) {
        console.error('Failed to parse email response:', parseError);
        // If JSON parsing fails but response was OK, assume success
        console.log('Email request completed (assuming success due to 200 status)');
        return true;
      }
    } catch (error) {
      console.error('Email service error:', error);
      return false;
    }
  }
}

export const emailService = new EmailService();
