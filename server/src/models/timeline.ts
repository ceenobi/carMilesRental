import mongoose, { Schema, Document } from "mongoose";

export interface ITimeline extends Document {
  bookingId: mongoose.Types.ObjectId;
  status: "created" | "paid" | "cancelled" | "completed";
  title: string;
  description?: string;
  actor?: string;
  createdAt: Date;
}

const TimelineSchema: Schema = new Schema(
  {
    bookingId: { type: Schema.Types.ObjectId, ref: "Booking", required: true },
    status: {
      type: String,
      required: true,
      enum: ["created", "paid", "cancelled", "completed"],
    },
    title: { type: String, required: true },
    description: { type: String },
    actor: { type: String, default: "System" },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export default mongoose.model<ITimeline>("Timeline", TimelineSchema);
