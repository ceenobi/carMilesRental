import { Router } from "express";
import { sendContactMail } from "src/controllers/contact.controller.js";
import { validateFormData } from "../middleware/formValidate.js";
import { strictLimiter } from "src/middleware/rateLimit.middleware.js";
import { contactSchema } from "src/lib/schemaValidation.js";

const router = Router();
router.post(
  "/send",
  strictLimiter,
  validateFormData(contactSchema),
  sendContactMail,
);

export default router;
