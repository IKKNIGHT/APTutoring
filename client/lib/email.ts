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

      // Handle different response scenarios
      let result: any;
      
      try {
        // Try to parse JSON response
        const responseText = await response.text();
        if (responseText) {
          result = JSON.parse(responseText);
        } else {
          result = { success: false, message: 'Empty response' };
        }
      } catch (parseError) {
        console.error('Failed to parse response:', parseError);
        return false;
      }

      if (!response.ok) {
        console.error('Email API failed:', {
          status: response.status,
          statusText: response.statusText,
          result
        });
        return false;
      }

      if (result && result.success) {
        console.log('Email sent successfully:', result.emailId);
        return true;
      } else {
        console.error('Email sending failed:', result?.message || 'Unknown error');
        return false;
      }
    } catch (error) {
      console.error('Email service error:', error);
      return false;
    }
  }
}

export const emailService = new EmailService();
