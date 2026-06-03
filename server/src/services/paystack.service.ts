import crypto from "crypto";
import { env } from "src/config/keys.js";
import logger from "src/config/logger.js";
import { getPaystack } from "src/config/paystack.js";
import { IUser } from "src/models/user.js";
import emailService from "src/email/send-email.js";

export interface InitializePaymentData {
  amount: number;
  paymentMethod: "paystack";
  bookingId: string;
  carId: string;
  slug: string;
}

export interface VerifyPaymentData {
  reference: string;
}

export interface PaystackSubscriptionResponse {
  status: boolean;
  message: string;
  body: {
    id: string;
    customer: string;
    plan: string;
    amount: number;
    status: string;
    created_at: string;
  };
}

export interface PaystackCreateResponse {
  status: boolean;
  message: string;
  body: {
    authorization_url: string;
    reference: string;
    access_code: string;
  };
}

export class PaystackService {
  async initializePayment(
    data: InitializePaymentData,
    user: IUser,
  ): Promise<PaystackCreateResponse> {
    try {
      const amountInKobo = data.amount * 100;
      const reference = `RF-${crypto.randomBytes(4).toString("hex").toUpperCase()}-${Date.now().toString().slice(-4)}`;
      const response = await getPaystack().post("/transaction/initialize", {
        email: user.email,
        amount: amountInKobo,
        reference,
        metadata: {
          userId: user._id,
          paymentMethod: data.paymentMethod,
          bookingId: data.bookingId,
          carId: data.carId,
        },
        callback_url: `${env.CLIENT_URL}/verify-payment?reference=${reference}`,
      });
      return response.data;
    } catch (error: any) {
      logger.error(error.message, "Failed to initialize Paystack payment");
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to initialize payment",
      );
    }
  }
  async verifyPayment(data: VerifyPaymentData): Promise<any> {
    try {
      const response = await getPaystack().get(
        `/transaction/verify/${data.reference}`,
      );
      if (response.data.status && response.data.data.status === "success") {
        const tx = response.data.data;
        const metadata = tx.metadata;

        const Payment = (await import("../models/payment.js")).default;
        const paymentUpdate = {
          userId: metadata.userId,
          bookingId: metadata.bookingId,
          carId: metadata.carId,
          paymentMethod: metadata.paymentMethod,
          amount: tx.amount / 100,
          status: "success" as const,
          reference: tx.reference,
          paidAt: new Date(),
        };

        const payment = await Payment.findOneAndUpdate(
          { reference: tx.reference },
          paymentUpdate,
          {
            upsert: true,
            returnDocument: "after",
          },
        );
        if (payment) {
          await this._triggerPaymentConfirmation(
            payment.userId.toString(),
            tx.amount / 100,
            tx.reference,
          );
        }

        const Car = (await import("../models/car.js")).default;
        const car = await Car.findByIdAndUpdate(
          metadata.carId,
          { status: "booked" },
          { returnDocument: "after" },
        ).lean();
        const Timeline = (await import("../models/timeline.js")).default;
        await Timeline.create({
          bookingId: metadata.bookingId,
          status: "paid",
          title: "Booking Paid",
          description: "The booking has been paid successfully.",
          actor: "System",
        });

        return {
          status: true,
          message: "Payment verified and recorded",
          data: {
            ...payment.toJSON(),
            slug: car?.slug,
          },
        };
      }
    } catch (error: any) {
      logger.error(error.message, "Failed to verify Paystack payment");
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to verify payment",
      );
    }
  }
  verifyWebhookSignature(payload: string | Buffer, signature: string): boolean {
    const secret = env.PAYSTACK_SECRET_KEY;
    if (!secret) {
      throw new Error("Paystack secret key not configured");
    }

    const hash = crypto
      .createHmac("sha512", secret)
      .update(payload)
      .digest("hex");

    return hash === signature;
  }

  async handleWebhook(event: any): Promise<void> {
    const { event: eventType, data } = event;
    const Payment = (await import("../models/payment.js")).default;

    try {
      switch (eventType) {
        case "charge.success":
          logger.info(
            `Webhook charge.success: ${data.reference} (${data.amount})`,
          );

          const metadata = data.metadata;
          const chargeUpdate = {
            userId: metadata?.userId,
            bookingId: metadata?.bookingId,
            carId: metadata?.carId,
            paymentMethod: metadata?.paymentMethod || "paystack",
            amount: data.amount / 100,
            status: "success" as const,
            paidAt: new Date(),
          };

          // Use reference to find the specific initial payment attempt
          const payment = await Payment.findOneAndUpdate(
            { reference: data.reference },
            chargeUpdate,
            { upsert: true, returnDocument: "after" },
          );

          //Trigger workflow for successful charge
          if (payment && payment.userId) {
            await this._triggerPaymentConfirmation(
              payment.userId.toString(),
              data.amount / 100,
              data.reference,
            );
          } else if (payment && !payment.userId) {
            logger.warn(
              `Payment found but missing userId for reference: ${data.reference}`,
            );
          }
          break;

        case "charge.failed":
          logger.info(`Webhook charge.failed: ${data.reference}`);
          await Payment.findOneAndUpdate(
            { reference: data.reference },
            { status: "failed" },
          );
          break;

        case "refund.processed":
          logger.info(`Webhook refund.processed: ${data.reference}`);
          const refundedPayment = await Payment.findOneAndUpdate(
            { reference: data.reference },
            { status: "refunded" },
            { returnDocument: "after" },
          );

          if (refundedPayment && refundedPayment.bookingId) {
            const Booking = (await import("../models/booking.js")).default;
            await Booking.findByIdAndUpdate(refundedPayment.bookingId, {
              status: "cancelled",
            });
            logger.info(
              `Booking ${refundedPayment.bookingId} cancelled due to refund`,
            );
          }
          break;

        default:
          logger.info("Unhandled webhook event:", eventType);
      }
    } catch (error) {
      logger.error(error, "Error handling webhook:");
      throw error;
    }
  }

  private async _triggerPaymentConfirmation(
    userId: string,
    amount: number,
    reference: string,
  ): Promise<void> {
    try {
      const User = (await import("../models/user.js")).default;
      const user = await User.findById(userId).lean();

      if (!user) {
        logger.error(`User not found for payment confirmation: ${userId}`);
        return;
      }

      await emailService.sendPaymentConfirmationEmail({
        email: user.email,
        fullname: user.fullname,
        amount: amount.toLocaleString("en-NG", {
          style: "currency",
          currency: "NGN",
        }),
        reference,
        paymentMethod: "Paystack",
        paidAt: new Date().toLocaleDateString("en-NG", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      });

      logger.info(`Payment confirmation email sent to ${user.email}`);

      // Update Booking status to upcoming
      const Payment = (await import("../models/payment.js")).default;
      const payment = await Payment.findOne({ reference }).lean();
      if (payment && payment.bookingId) {
        const Booking = (await import("../models/booking.js")).default;
        await Booking.findByIdAndUpdate(payment.bookingId, {
          status: "upcoming",
        });
        logger.info(`Booking ${payment.bookingId} status updated to upcoming`);

        // Update Car status to booked
        const Car = (await import("../models/car.js")).default;
        await Car.findByIdAndUpdate(payment.carId, {
          status: "booked",
        });
        logger.info(`Car ${payment.carId} status updated to booked`);
      }
    } catch (error: any) {
      logger.error(
        error.message,
        "Failed to update booking status or send email",
      );
    }
  }
}

export const paystackService = new PaystackService();
