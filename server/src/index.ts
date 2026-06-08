import { env } from "./config/keys.js";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";
import { connectDB, gracefulShutdown } from "./config/database.js";
import logger, { logError } from "./config/logger.js";
import {
  setupGlobalErrorHandlers,
  createExpressLogger,
  notFoundRoutes,
  appErrorHandler,
} from "./middleware/error.middleware.js";
import { createSessionMiddleware } from "./config/session.js";
import { globalLimiter } from "./middleware/rateLimit.middleware.js";
import { startEmailRetryJob, stopEmailRetryJob } from "./jobs/emailRetry.js";
import { startCleanupPendingBookingsJob } from "./jobs/cleanupPendingBookings.js";
//routes import
import authRoutes from "./routes/auth.routes.js";
import carRoutes from "./routes/car.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import paystackRoutes from "./routes/paystack.routes.js";
import driverRoutes from "./routes/driver.routes.js";
import customerRoutes from "./routes/customer.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";

declare global {
  namespace Express {
    interface Request {
      requestTime?: string;
      rawBody?: Buffer;
    }
  }
}

// Extend express-session SessionData interface
declare module "express-session" {
  interface SessionData {
    userId?: string;
    role?: "customer" | "admin";
  }
}
const app = express();
// Trust first proxy (for production/ngrok)
app.set("trust proxy", 1);
//global error handler
setupGlobalErrorHandlers();

// CORS configuration
const allowedOrigins = [env.CLIENT_URL];
if (env.NODE_ENV === "production" && env.CLIENT_URL) {
  allowedOrigins.push(env.CLIENT_URL);
}

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  optionsSuccessStatus: 200,
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Access-Control-Allow-Origin",
    "Access-Control-Allow-Credentials",
  ],
  exposedHeaders: [
    "Content-Range",
    "X-Content-Range",
    "x-refresh-token",
    "set-cookie",
  ],
};

//Pino HTTP middleware for request logging
app.use(createExpressLogger());
app.use(cors(corsOptions));
app.use((req: Request, res: Response, next: NextFunction) => {
  // Allow credentials
  res.header("Access-Control-Allow-Origin", "https://carmiles-rental.vercel.app");
  res.header("Access-Control-Allow-Credentials", "true");
  // Handle preflight
  if (req.method === "OPTIONS") {
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PATCH, DELETE, OPTIONS",
    );
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return res.status(204).end();
  }
  next();
});

app.use(globalLimiter);
// Session middleware (after CORS, before body parsers)
app.use(createSessionMiddleware());

app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));
app.disable("x-powered-by");

if (env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
// Request time middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Health check route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    message: "Server is running",
    environment: env.NODE_ENV,
    timestamp: req.requestTime,
    uptime: process.uptime(),
  });
});

//api routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/cars", carRoutes);
app.use("/api/v1/upload", uploadRoutes);
app.use("/api/v1/contact", contactRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/paystack", paystackRoutes);
app.use("/api/v1/drivers", driverRoutes);
app.use("/api/v1/customers", customerRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

// Handle 404
app.use(notFoundRoutes);
// Global error handler
app.use(appErrorHandler);

// Server configuration
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3500;

const startServer = async (): Promise<void> => {
  let server: any;
  try {
    await connectDB();

    // Start email retry cron job
    startEmailRetryJob();

    // Start booking cleanup job
    startCleanupPendingBookingsJob();

    server = app.listen(PORT, "0.0.0.0", () => {
      logger.info(
        `\n✅ Server running in ${env.NODE_ENV} mode on port ${PORT}`,
      );
      logger.info(`🌐 http://localhost:${PORT}\n`);
    });
    // Handle unhandled promise rejections
    process.on("unhandledRejection", (reason: unknown) => {
      console.error("\n❌ UNHANDLED REJECTION! Shutting down...");

      const error =
        reason instanceof Error
          ? `${reason.name}: ${reason.message}`
          : String(reason);

      logger.error({ reason: error }, "Unhandled rejection");

      // Close server gracefully
      server.close(() => {
        logger.info("💥 Process terminated due to unhandled rejection");
        logger.info("✅ Server shutdown complete");
        // Stop cron jobs
        stopEmailRetryJob();
        process.exit(0);
      });
    });

    // Handle termination signals
    process.on("SIGTERM", gracefulShutdown);
    process.on("SIGINT", gracefulShutdown);

    // Handle any other errors
    server.on("error", (error: NodeJS.ErrnoException) => {
      if (error.syscall !== "listen") throw error;

      switch (error.code) {
        case "EACCES":
          logger.error(`Port ${PORT} requires elevated privileges`);
          process.exit(1);
        case "EADDRINUSE":
          logger.error(`Port ${PORT} is already in use`);
          process.exit(1);
        default:
          throw error;
      }
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    logError(`\n❌ Failed to start server: ${errorMessage}`);
    process.exit(1);
  }
};

if (!process.env.VERCEL) {
  startServer();
} else {
  connectDB().catch((err) => {
    console.error("Serverless DB connection failed:", err);
  });
}

export default app;
