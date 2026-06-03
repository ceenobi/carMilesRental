import { rateLimit, ipKeyGenerator } from "express-rate-limit";
import { PenaltyStore } from "../lib/rateLimitStore.js";

// Initialize penalty store with cleanup
const penaltyStore = new PenaltyStore({
  windowMs: 1 * 60 * 1000, // 1 minute window
  max: 10, // 10 tries per minute
  penaltyMs: 5 * 60 * 1000, // 5 minute penalty when exceeded
});
penaltyStore.startCleanup();

// General API rate limiter
export const globalLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  limit: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests, please try again later",
  keyGenerator: (req) => {
    return `${ipKeyGenerator(req.ip as string)}-${
      req.headers["user-agent"] || "unknown-user-agent"
    }`;
  },
});

// Stricter limiter for sensitive routes (Auth, Payments)
// Allows 10 tries per minute, but triggers 5 minute penalty when exceeded
export const strictLimiter = rateLimit({
  store: penaltyStore,
  windowMs: 1 * 60 * 1000, // 1 minute
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many attempts. Please try again in 5 minutes.",
  keyGenerator: (req) => {
    return `${ipKeyGenerator(req.ip as string)}-${
      req.headers["user-agent"] || "unknown-user-agent"
    }`;
  },
  handler: (req, res, _next, options) => {
    res.status(429).json({
      success: false,
      message: options.message,
      retryAfter: 300, // 5 minutes in seconds
    });
  },
});

export const customRateLimiter = (maxRequests: number, windowMinutes: number = 3) =>
  rateLimit({
    windowMs: windowMinutes * 60 * 1000,
    limit: maxRequests,
    message: "Too many requests, please try again later",
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
      return `${ipKeyGenerator(req.ip as string)}-${
        req.headers["user-agent"] || "unknown-user-agent"
      }`;
    },
  });