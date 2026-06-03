import { Router } from "express";
import {
  initializePaymentData,
  verifyPaymentData,
  webhookData,
} from "src/controllers/paystack.controller.js";
import {
  initializePaystackSchema,
  verifyPaymentSchema,
} from "src/lib/schemaValidation.js";
import { verifySession } from "src/middleware/auth.middleware.js";
import { validateFormData } from "src/middleware/formValidate.js";
import { customRateLimiter } from "src/middleware/rateLimit.middleware.js";

const router = Router();

router.post(
  "/initialize",
  customRateLimiter(5),
  verifySession,
  validateFormData(initializePaystackSchema),
  initializePaymentData,
);

router.post(
  "/verify-payment",
  customRateLimiter(5),
  verifySession,
  validateFormData(verifyPaymentSchema),
  verifyPaymentData,
);

router.post("/webhook", webhookData);

export default router;
