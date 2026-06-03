import mongoose, { Schema, Document } from "mongoose";

export interface IFailedEmail extends Document {
  userId: mongoose.Types.ObjectId;
  email: string;
  otp: string;
  fullname: string;
  subject: string;
  attempts: number;
  createdAt: Date;
  lastAttemptAt: Date;
  status: "pending" | "sent" | "failed";
}

const FailedEmailSchema = new Schema<IFailedEmail>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    fullname: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    attempts: {
      type: Number,
      default: 0,
      max: 3,
    },
    status: {
      type: String,
      enum: ["pending", "sent", "failed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying by cron job
FailedEmailSchema.index({ status: 1, attempts: 1, createdAt: 1 });

const FailedEmail =
  mongoose.models.FailedEmail ||
  mongoose.model<IFailedEmail>("FailedEmail", FailedEmailSchema, "failedEmails");

export default FailedEmail;
