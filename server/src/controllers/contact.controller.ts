import { Request, Response } from "express";
import tryCatchWrapper from "../lib/tryCatchWrapper.js";
import { sendEmail } from "../config/email.js";
import { env } from "../config/keys.js";
import {
  contactOwnerTemplate,
  contactUsTemplate,
} from "../email/templates.js";
import { sendTsRestSuccess } from "../lib/responseHandler.js";
import logger from "../config/logger.js";

export const sendContactMail = tryCatchWrapper(
  async (req: Request, res: Response) => {
    const { fullname, email, phone, message, subject } = req.body;

    // 1. Send notification to the app owner with client's message
    const ownerEmail = env.EMAIL_OWNER;
    if (ownerEmail) {
      await sendEmail({
        email: ownerEmail,
        subject: `Contact Form: ${subject}`,
        message: contactOwnerTemplate(fullname, email, phone, subject, message),
      });
    }

    // 2. Send confirmation to the client
    await sendEmail({
      email,
      subject: "We've received your message - MILES",
      message: contactUsTemplate(fullname),
    }).catch((err) => {
      logger.error(
        { err },
        "Failed to send contact confirmation email",
      );
    });

    return sendTsRestSuccess(res, 200, {
      success: true,
      message: "Your message has been sent successfully.",
      emailPending: true,
    });
  },
);
