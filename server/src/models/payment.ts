import mongoose, { Schema, Document } from "mongoose";

export interface IPayment extends Document {
  userId: mongoose.Types.ObjectId;
  carId: mongoose.Types.ObjectId;
  bookingId: mongoose.Types.ObjectId;
  driverId: mongoose.Types.ObjectId;
  status: "pending" | "success" | "cancelled" | "failed" | "refunded";
  reference: string;
  paymentMethod: "pay_with_bank" | "paystack";
  amount: number;
  paidAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    carId: {
      type: Schema.Types.ObjectId,
      ref: "Car",
      required: true,
    },
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    driverId: {
      type: Schema.Types.ObjectId,
      ref: "Driver",
      required: false,
    },
    status: {
      type: String,
      enum: ["pending", "success", "cancelled", "failed", "refunded"],
      default: "pending",
      required: true,
    },
    reference: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["pay_with_bank", "paystack"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    paidAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

const Payment =
  mongoose.models.Payment ||
  mongoose.model<IPayment>("Payment", PaymentSchema, "Payment");

export default Payment;
