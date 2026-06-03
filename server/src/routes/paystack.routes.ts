import { Router } from "express";
import {
  initializePaymentData,
  verifyPaymentData,
  webhookData,
} from "../controllers/paystack.controller.js";
import {
  initializePaystackSchema,
  verifyPaymentSchema,
} from "../lib/schemaValidation.js";
import { verifySession } from "../middleware/auth.middleware.js";
import { validateFormData } from "../middleware/formValidate.js";
import { customRateLimiter } from "../middleware/rateLimit.middleware.js";

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
