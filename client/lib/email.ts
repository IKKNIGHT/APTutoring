import { Event } from "./supabase";

// Email service that calls our server API
class EmailService {
  async sendRSVPConfirmation(
    toEmail: string,
    studentName: string,
    event: Event,
    userTimezone: string,
  ): Promise<boolean> {
    try {
      const response = await fetch("/api/send-rsvp-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          toEmail,
          studentName,
          event,
          userTimezone,
        }),
      });

      // Simply check the response status without reading the body
      if (response.ok) {
        console.log(
          "Email API request successful (status:",
          response.status,
          ")",
        );
        return true;
      } else {
        console.error(
          "Email API failed with status:",
          response.status,
          response.statusText,
        );
        return false;
      }
    } catch (error) {
      console.error("Email service error:", error);
      return false;
    }
  }
}

export const emailService = new EmailService();
