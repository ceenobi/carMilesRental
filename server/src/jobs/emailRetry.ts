import cron from "node-cron";
import emailService from "../email/send-email.js";
import logger from "../config/logger.js";

let isRunning = false;

export const startEmailRetryJob = (): void => {
  // Run every 15 minutes
  cron.schedule("*/15 * * * *", async () => {
    if (isRunning) {
      logger.warn("Email retry job already running, skipping...");
      return;
    }

    isRunning = true;

    try {
      logger.info("Starting email retry job...");

      const result = await emailService.retryFailedEmails();

      if (result.processed > 0) {
        logger.info(
          `Email retry complete: ${result.succeeded} succeeded, ${result.failed} failed (out of ${result.processed} processed)`
        );
      }
    } catch (error) {
      logger.error({ error }, "Email retry job failed");
    } finally {
      isRunning = false;
    }
  });

  logger.info("Email retry cron job scheduled (runs every 15 minutes)");
};

export const stopEmailRetryJob = (): void => {
  cron.getTasks().forEach((task) => task.stop());
  logger.info("Email retry cron job stopped");
};
