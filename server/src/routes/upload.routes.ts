import { Router } from "express";
import { uploadFile, deleteFile } from "../controllers/upload.controller.js";
import { validateFormData } from "../middleware/formValidate.js";
import { UploadSchema, DeleteMediaSchema } from "../lib/schemaValidation.js";
import { customRateLimiter } from "../middleware/rateLimit.middleware.js";
import { requireAdmin } from "../middleware/auth.middleware.js";

const router = Router();

router.post(
  "/",
  customRateLimiter(5),
  requireAdmin,
  validateFormData(UploadSchema),
  uploadFile,
);
router.delete(
  "/delete",
  customRateLimiter(5),
  requireAdmin,
  validateFormData(DeleteMediaSchema),
  deleteFile,
);

export default router;
