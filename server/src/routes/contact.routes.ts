import { Router } from "express";
import { sendContactMail } from "../controllers/contact.controller.js";
import { validateFormData } from "../middleware/formValidate.js";
import { strictLimiter } from "../middleware/rateLimit.middleware.js";
import { contactSchema } from "../lib/schemaValidation.js";

const router = Router();
router.post(
  "/send",
  strictLimiter,
  validateFormData(contactSchema),
  sendContactMail,
);

export default router;
