import { Router } from "express";
import {
  createUser,
  loginUser,
  getUser,
  logoutUser,
  verifyEmail,
  resendOTP,
  requestForgotPassword,
  resetPassword
} from "../controllers/auth.controller.js";
import { validateFormData } from "../middleware/formValidate.js";
import {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  resendOtpSchema,
  resetPasswordSchema
} from "../lib/schemaValidation.js";
import { strictLimiter } from "../middleware/rateLimit.middleware.js";
import { verifySession } from "../middleware/auth.middleware.js";

const router = Router();

router.post(
  "/register",
  strictLimiter,
  validateFormData(registerSchema),
  createUser,
);
router.post(
  "/verify-email",
  strictLimiter,
  validateFormData(verifyEmailSchema),
  verifyEmail,
);
router.post(
  "/resend-otp",
  strictLimiter,
  validateFormData(resendOtpSchema),
  resendOTP,
);
router.post("/login", strictLimiter, validateFormData(loginSchema), loginUser);
router.get("/me", verifySession, getUser);
router.post("/logout", verifySession, logoutUser);
router.post(
  "/request-password-reset",
  strictLimiter,
  validateFormData(resendOtpSchema),
  requestForgotPassword,
);
router.patch(
  "/reset-password",
  strictLimiter,
  validateFormData(resetPasswordSchema),
  resetPassword,
);

export default router;
