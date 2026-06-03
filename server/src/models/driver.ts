import mongoose, { Schema, Document } from "mongoose";

export interface IDriver extends Document {
  fullname: string;
  email: string;
  phone: string;
  license: string;
  licenseExpiryDate: Date;
  status: "active" | "inactive" | "available" | "off-duty" | "booked";
  language: Array<"English" | "Igbo" | "Hausa" | "Yoruba" | "Pidgin">;
  rating: number;
  trips: number;
  isVerified: boolean;
  baseCity: string;
  yearsOfExperience: string;
}

const DriverSchema = new Schema<IDriver>(
  {
    fullname: {
      type: String,
      required: true,
      trim: true,
      maxlength: [50, "Name cannot be more than 50 characters"],
    },
    email: {
      type: String,
      required: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please provide a valid email address",
      ],
    },
    phone: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    license: {
      type: String,
      trim: true,
      required: true,
      maxlength: [20, "License cannot be more than 20 characters"],
      unique: true,
    },
    licenseExpiryDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "available", "off-duty", "booked"],
      default: "available",
    },
    language: {
      type: [String],
      enum: ["English", "Igbo", "Hausa", "Yoruba", "Pidgin"],
      default: ["English"],
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    trips: {
      type: Number,
      required: true,
      default: 0,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    baseCity: {
      type: String,
      required: true,
    },
    yearsOfExperience: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

DriverSchema.index({ email: 1 });
DriverSchema.index({ status: 1 });
DriverSchema.index({ isVerified: 1 });
DriverSchema.index({ rating: 1 });
DriverSchema.index({ trips: 1 });
DriverSchema.index({ language: 1 });
DriverSchema.index({ licenseExpiryDate: 1 });

const Driver =
  mongoose.models.Driver ||
  mongoose.model<IDriver>("Driver", DriverSchema, "Driver");

export default Driver;
