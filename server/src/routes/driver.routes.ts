import { Router } from "express";
import {
  createDriver,
  getAllDrivers,
  assignDriver,
} from "../controllers/driver.controller.js";
import { requireAdmin } from "../middleware/auth.middleware.js";
import { validateFormData } from "../middleware/formValidate.js";
import { driverSchema } from "../lib/schemaValidation.js";
import { customRateLimiter } from "../middleware/rateLimit.middleware.js";
import { cacheMiddleware, clearCache } from "../middleware/cache.middleware.js";

const router = Router();

router.post(
  "/register",
  customRateLimiter(5),
  requireAdmin,
  validateFormData(driverSchema),
  clearCache("drivers"),
  createDriver,
);
router.post(
  "/assign",
  requireAdmin,
  clearCache("drivers"),
  clearCache("bookingId"),
  assignDriver,
);
router.get("/", requireAdmin, cacheMiddleware("drivers"), getAllDrivers);

export default router;
