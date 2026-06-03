import User from "../models/user.js";
import tryCatchWrapper from "../lib/tryCatchWrapper.js";
import { sendTsRestError, sendTsRestSuccess } from "../lib/responseHandler.js";
import { Request, Response } from "express";
import { paystackService } from "../services/paystack.service.js";
import logger from "../config/logger.js";

export const initializePaymentData = tryCatchWrapper(
  async (req: Request, res: Response) => {
    const user = await User.findById(req.session.userId).lean();
    if (!user) {
      return sendTsRestError(res, 404, "User not found");
    }
    const response = await paystackService.initializePayment(req.body, user);
    return sendTsRestSuccess(res, 200, {
      success: true,
      message: "Payment gateway initialized",
      body: response,
    });
  },
);

export const verifyPaymentData = tryCatchWrapper(
  async (req: Request, res: Response) => {
    const response = await paystackService.verifyPayment(req.body);
    return sendTsRestSuccess(res, 200, {
      success: true,
      message: "Payment verified successfully",
      body: response,
    });
  },
);

export const webhookData = tryCatchWrapper(async (req: Request, res: Response) => {
  const signature = req.headers["x-paystack-signature"] as string;
  const rawBody = (req as unknown as { rawBody?: Buffer }).rawBody;
  const payload: string | Buffer = rawBody || JSON.stringify(req.body);

  logger.info(
    `Incoming Paystack Webhook - rawBody: ${!!rawBody}, event: ${req.body?.event}, reference: ${req.body?.data?.reference}`,
  );

  if (!paystackService.verifyWebhookSignature(payload, signature)) {
    logger.error(
      `Paystack Webhook Signature Verification Failed - signature: ${signature ? "exists" : "missing"}`,
    );
    return sendTsRestError(res, 401, "Invalid signature");
  }

  logger.info(`Paystack Webhook Verified: ${req.body?.event}`);
  await paystackService.handleWebhook(req.body);

  return sendTsRestSuccess(res, 200, {
    success: true,
    message: "Webhook processed",
  });
});
