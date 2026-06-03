import { Router } from "express";
import { validateFormData } from "../middleware/formValidate.js";
import {
  adminNewBookingSchema,
  bookingSchema,
} from "../lib/schemaValidation.js";
import { customRateLimiter } from "../middleware/rateLimit.middleware.js";
import { requireAdmin, verifySession } from "../middleware/auth.middleware.js";
import {
  bookRide,
  getABooking,
  getUserBookings,
  getAllBookings,
  adminBookRide,
  cancelBooking,
  markCompleted,
} from "../controllers/booking.controller.js";
import { cacheMiddleware, clearCache } from "../middleware/cache.middleware.js";

const router = Router();

router.post(
  "/create",
  customRateLimiter(5),
  verifySession,
  validateFormData(bookingSchema),
  clearCache("myBookings"),
  bookRide,
);

router.get(
  "/my-bookings",
  verifySession,
  cacheMiddleware("myBookings"),
  getUserBookings,
);


router.get(
  "/get/:bookingId",
  verifySession,
  cacheMiddleware("bookingId"),
  getABooking,
);

router.patch(
  "/cancel/:bookingId",
  customRateLimiter(10),
  verifySession,
  clearCache("bookingId"),
  clearCache("allBookings"),
  clearCache("myBookings"),
  cancelBooking,
);

//admin section
router.get(
  "/all-bookings",
  requireAdmin,
  cacheMiddleware("allBookings"),
  getAllBookings,
);

router.post(
  "/admin-create",
  customRateLimiter(5),
  requireAdmin,
  validateFormData(adminNewBookingSchema),
  clearCache("allBookings"),
  clearCache("trendingCars"),
  adminBookRide,
);

router.patch(
  "/completed/:bookingId",
  customRateLimiter(10),
  requireAdmin,
  clearCache("bookingId"),
  clearCache("allBookings"),
  clearCache("myBookings"),
  markCompleted,
);

export default router;
