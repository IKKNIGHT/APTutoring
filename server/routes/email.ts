import { RequestHandler } from "express";
import { z } from "zod";

// Validation schema for email request
const emailRequestSchema = z.object({
  toEmail: z.string().email(),
  studentName: z.string().min(1),
  userTimezone: z.string().optional(),
  event: z.object({
    id: z.number(),
    datetime: z.string(),
    description: z.string(),
    class: z
      .object({
        name: z.string(),
        meet_link: z.string(),
      })
      .optional(),
  }),
});

export const sendRSVPEmail: RequestHandler = async (req, res) => {
  try {
    // Validate request body
    const { toEmail, studentName, event } = emailRequestSchema.parse(req.body);

    const resendApiKey = process.env.VITE_RESEND_API_KEY;
    const fromEmail = process.env.VITE_FROM_EMAIL;

    if (!resendApiKey) {
      console.warn("Resend API key not configured");
      return res.status(200).json({
        success: false,
        message: "Email service not configured",
      });
    }

    // Format date and time
    const eventDate = new Date(event.datetime);
    const formattedDate = eventDate.toLocaleDateString("en-US", {
      timeZone: "UTC",
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const formattedTime =
      eventDate.toLocaleTimeString("en-US", {
        timeZone: "UTC",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }) + " UTC";

    // Create email HTML
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="x-apple-disable-message-reformatting">
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
              <p><strong>Class:</strong> ${event.class?.name || "AP Class"}</p>
              <p><strong>Session:</strong> ${event.description}</p>
              <p><strong>Date:</strong> ${formattedDate}</p>
              <p><strong>Time:</strong> ${formattedTime}</p>
              <p style="font-size: 12px; color: #666; margin-top: 8px;">
                <em>Note: Times are shown in UTC. Please convert to your local timezone.</em>
              </p>
            </div>
            
            <div style="text-align: center;">
              <a href="${event.class?.meet_link || "#"}" class="meet-link">
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

    // Send email via Resend API
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "X-Entity-Ref-ID": `${Date.now()}`, // Unique identifier for email
        Precedence: "bulk", // Prevents threading
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        subject: `AP Tutoring Session Confirmation ${event.id}`,
        html: emailHtml,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Resend API error:", errorData);

      // Handle specific Resend errors
      if (
        response.status === 403 &&
        errorData.error?.includes("testing emails")
      ) {
        return res.status(200).json({
          success: false,
          message:
            "Email service is in testing mode. Only the account owner can receive emails.",
          error: "resend_testing_mode",
        });
      }

      return res.status(500).json({
        success: false,
        message: "Failed to send email",
        error: errorData,
      });
    }

    const result = await response.json();
    console.log("Email sent successfully:", result.id);

    res.json({
      success: true,
      message: "Email sent successfully",
      emailId: result.id,
    });
  } catch (error) {
    console.error("Email service error:", error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Invalid request data",
        errors: error.errors,
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
