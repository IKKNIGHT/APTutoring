import { Event } from './supabase';

// Email service using Resend
class EmailService {
  private resendApiKey: string;
  private fromEmail: string;

  constructor() {
    this.resendApiKey = import.meta.env.VITE_RESEND_API_KEY || '';
    this.fromEmail = import.meta.env.VITE_FROM_EMAIL || 'noreply@aptutoring.com';
  }

  async sendRSVPConfirmation(
    toEmail: string,
    studentName: string,
    event: Event
  ): Promise<boolean> {
    if (!this.resendApiKey) {
      console.warn('Resend API key not configured - email not sent');
      return false;
    }

    try {
      const eventDate = new Date(event.datetime);
      const formattedDate = eventDate.toLocaleDateString('en-US', {
        timeZone: 'UTC',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      const formattedTime = eventDate.toLocaleTimeString('en-US', {
        timeZone: 'UTC',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }) + ' UTC';

      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>AP Tutoring Session Confirmation</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #8B5CF6; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .meet-link { background: #8B5CF6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 10px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎓 AP Tutoring Session Confirmed!</h1>
            </div>
            <div class="content">
              <p>Hello ${studentName},</p>
              
              <p>You're confirmed for your AP tutoring session! Here are the details:</p>
              
              <div class="details">
                <h3>📚 Session Details</h3>
                <p><strong>Class:</strong> ${event.class?.name || 'AP Class'}</p>
                <p><strong>Session:</strong> ${event.description}</p>
                <p><strong>Date:</strong> ${formattedDate}</p>
                <p><strong>Time:</strong> ${formattedTime}</p>
              </div>
              
              <div style="text-align: center;">
                <a href="${event.class?.meet_link || '#'}" class="meet-link">
                  🎥 Join Google Meet
                </a>
              </div>
              
              <p><strong>What to expect:</strong></p>
              <ul>
                <li>Expert tutoring tailored to your needs</li>
                <li>Review of key concepts and problem-solving strategies</li>
                <li>Q&A time for your specific questions</li>
                <li>Additional resources and practice materials</li>
              </ul>
              
              <p><strong>Before the session:</strong></p>
              <ul>
                <li>Have your questions and materials ready</li>
                <li>Test your Google Meet connection</li>
                <li>Find a quiet study space</li>
              </ul>
              
              <p>We're excited to help you succeed in your AP class!</p>
              
              <div class="footer">
                <p>Questions? Reply to this email or contact our support team.</p>
                <p>AP Tutoring Hub - Empowering Students to Excel</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `;

      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: this.fromEmail,
          to: [toEmail],
          subject: 'AP Tutoring Session Confirmation',
          html: emailHtml,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Email send failed:', errorData);
        return false;
      }

      const result = await response.json();
      console.log('Email sent successfully:', result.id);
      return true;
    } catch (error) {
      console.error('Email service error:', error);
      return false;
    }
  }
}

export const emailService = new EmailService();
