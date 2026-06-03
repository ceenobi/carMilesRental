import mongoose, { Schema, Document } from "mongoose";

export interface IBooking extends Document {
  userId: mongoose.Types.ObjectId;
  carId: mongoose.Types.ObjectId;
  driverId?: mongoose.Types.ObjectId;
  pickUpLocation: string;
  dropOffLocation: string;
  pickUpDate: Date;
  pickUpTime: string;
  dropOffDate: Date;
  dropOffTime: string;
  addDriver: boolean;
  status: "pending" | "upcoming" | "ongoing" | "completed" | "cancelled" | "failed";
  rentalDays: number;
  serviceFee: number;
  rentalTotal: number;
  grandTotal: number;
}

const BookingSchema = new Schema<IBooking>(
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
    driverId: {
      type: Schema.Types.ObjectId,
      ref: "Driver",
      required: false,
    },
    pickUpLocation: {
      type: String,
      required: true,
    },
    dropOffLocation: {
      type: String,
      required: true,
    },
    pickUpDate: {
      type: Date,
      required: true,
    },
    pickUpTime: {
      type: String,
      required: true,
    },
    dropOffDate: {
      type: Date,
      required: true,
    },
    dropOffTime: {
      type: String,
      required: true,
    },
    addDriver: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["pending", "upcoming", "ongoing", "completed", "cancelled", "failed"],
      default: "pending",
    },
    rentalDays: {
      type: Number,
      required: true,
    },
    serviceFee: {
      type: Number,
      required: true,
      default: 10000,
    },
    rentalTotal: {
      type: Number,
      required: true,
    },
    grandTotal: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

BookingSchema.index({ status: 1, createdAt: 1 });
BookingSchema.index({ userId: 1, status: 1 });
BookingSchema.index({ pickUpDate: 1, dropOffDate: 1 });

const Booking =
  mongoose.models.Booking ||
  mongoose.model<IBooking>("Booking", BookingSchema, "Booking");

export default Booking;
