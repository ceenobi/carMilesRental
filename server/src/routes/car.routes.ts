import { Router } from "express";
import { validateFormData } from "../middleware/formValidate.js";
import { carSchema } from "src/lib/schemaValidation.js";
import { customRateLimiter } from "src/middleware/rateLimit.middleware.js";
import { requireAdmin } from "src/middleware/auth.middleware.js";
import { addCar, getCars, getACar, getTrendingCars } from "src/controllers/car.controller.js";
import {
  cacheMiddleware,
  clearCache,
} from "src/middleware/cache.middleware.js";

const router = Router();

router.post(
  "/add",
  customRateLimiter(5),
  requireAdmin,
  validateFormData(carSchema),
  clearCache("cars"),
  addCar,
);

router.get("/get", cacheMiddleware("cars"), getCars);
router.get("/trending", cacheMiddleware("trendingCars"), getTrendingCars);
router.get("/get/:slug", cacheMiddleware("car"), getACar);

export default router;
