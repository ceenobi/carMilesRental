import mongoose, { ConnectOptions } from "mongoose";
import { env } from "./keys.js";
import logger, { logError } from "./logger.js";

// Database connection state
interface DBConnection {
  isConnected: boolean;
  retryCount: number;
  maxRetries: number;
}

const dbConnection: DBConnection = {
  isConnected: false,
  retryCount: 0,
  maxRetries: 5,
};

const connectionOptions: ConnectOptions = {
  dbName: env.DATABASE_NAME,
  serverSelectionTimeoutMS: 45000,
  socketTimeoutMS: 5000,
  retryWrites: true,
  retryReads: true,
  maxPoolSize: 50,
  minPoolSize: 1,
  monitorCommands: env.NODE_ENV === "development",
};

export const connectDB = async (): Promise<void> => {
  if (dbConnection.isConnected) {
    logger.info("✅ Using existing MongoDB connection");
    return;
  }

  if (dbConnection.retryCount >= dbConnection.maxRetries) {
    logger.error("❌ Max MongoDB connection retries reached");
    process.exit(1);
  }
  try {
    const conn = await mongoose.connect(env.DATABASE_URL, connectionOptions);
    dbConnection.isConnected = conn.connections[0].readyState === 1;
    dbConnection.retryCount = 0; // Reset retry count on successful connection

    if (dbConnection.isConnected) {
      logger.info(`✅ MongoDB Connected: ${conn.connection.host}`);

      // Connection event handlers
      mongoose.connection.on("error", (err) => {
        logger.error("❌ MongoDB connection error:", err);
        dbConnection.isConnected = false;
      });

      mongoose.connection.on("disconnected", () => {
        logger.info("ℹ️  MongoDB disconnected");
        dbConnection.isConnected = false;
        // Attempt to reconnect
        if (dbConnection.retryCount < dbConnection.maxRetries) {
          dbConnection.retryCount++;
          logger.info(
            `ℹ️  Attempting to reconnect (${dbConnection.retryCount}/${dbConnection.maxRetries})...`,
          );
          setTimeout(connectDB, 5000);
        }
      });
    }
  } catch (error: unknown) {
    dbConnection.retryCount++;
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    logError(
      `❌ MongoDB connection failed (attempt ${dbConnection.retryCount}/${dbConnection.maxRetries}):`,
      errorMessage,
    );

    if (dbConnection.retryCount < dbConnection.maxRetries) {
      logger.info(`ℹ️  Retrying in 5 seconds...`);
      setTimeout(connectDB, 5000);
    } else {
      logger.error("❌ Max retries reached. Exiting...");
      process.exit(1);
    }
  }
};

// Handle graceful shutdown
export const gracefulShutdown = async (): Promise<void> => {
  try {
    logger.info("\n🛑 Received shutdown signal. Closing server...");

    // Close MongoDB connection
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      logger.info("✅ MongoDB connection closed");
    }

    logger.info("✅ Server shutdown complete");
    process.exit(0);
  } catch (error) {
    logError(error, "❌ Error during shutdown:");
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on("uncaughtException", (error: Error) => {
  logger.error(
    { err: { name: error.name, message: error.message } },
    "❌ UNCAUGHT EXCEPTION! Shutting down...",
  );
  // Attempt to close server gracefully
  gracefulShutdown().finally(() => process.exit(1));
});
