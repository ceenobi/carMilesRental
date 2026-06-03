import { Router } from "express";
import { uploadFile, deleteFile } from "src/controllers/upload.controller.js";
import { validateFormData } from "../middleware/formValidate.js";
import { UploadSchema, DeleteMediaSchema } from "src/lib/schemaValidation.js";
import { customRateLimiter } from "src/middleware/rateLimit.middleware.js";
import { requireAdmin } from "src/middleware/auth.middleware.js";

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
