import axios from "axios";
import { env } from "./keys.js";
import logger, { logError } from "./logger.js";

interface SendEmailOptions {
  email: string;
  subject: string;
  message: string;
  attachments?: {
    filename: string;
    content: Buffer | string;
  }[];
}

interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

const sendEmail = async (options: SendEmailOptions): Promise<EmailResult> => {
  try {
    // Generate text fallback by removing HTML tags
    const textFallback = options.message
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/\s+/g, " ")
      .trim();

    let recipient = options.email;

    const payload = {
      sender: {
        name: "Car Ride",
        email: env.EMAIL_OWNER || "onboarding@carride.com",
      },
      to: [{ email: recipient }],
      subject: options.subject,
      htmlContent: options.message,
      textContent: textFallback,
      ...(options.attachments &&
        options.attachments.length > 0 && {
          attachments: options.attachments.map((att) => ({
            name: att.filename,
            content:
              typeof att.content === "string"
                ? Buffer.from(att.content).toString("base64")
                : att.content.toString("base64"),
          })),
        }),
    };

    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      payload,
      {
        headers: {
          "api-key": env.BREVO_API_KEY,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
    );

    if (env.NODE_ENV === "development") {
      logger.info(
        `Email sent successfully via Brevo! Message ID: ${response.data.messageId}`,
      );
    }

    return { success: true, messageId: response.data.messageId };
  } catch (error: any) {
    // Log the detailed error from Brevo if available
    const errorData = error.response?.data;
    logError(error, "Brevo email sending failed", {
      message: error.message,
      details: errorData || "No additional details",
    });

    return { success: false, error: error.message };
  }
};

export { sendEmail };
