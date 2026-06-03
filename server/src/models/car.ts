import mongoose, { Schema, Document } from "mongoose";

export interface ICar extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  brand: string;
  type: "sedan" | "suv" | "truck" | "bus";
  rating: number;
  trips: number;
  summary: string;
  media: {
    mediaUrl: string;
    publicId: string;
  }[];
  slug: string;
  price: number;
  info: {
    seats: number;
    transmission: "manual" | "automatic" | "hybrid";
    fuel: "petrol" | "diesel" | "electric";
    year: string;
  };
  specs: {
    engine: string;
    mileage: string;
    topSpeed: string;
    boot: string;
  };
  status: "booked" | "unavailable" | "open" | "reserved";
  category:
    | "executive"
    | "premium"
    | "logistics"
    | "city"
    | "family"
    | "economy";
  plateNum: string;
}

const CarSchema = new Schema<ICar>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: [50, "Car Name cannot be more than 50 characters"],
    },
    slug: {
      type: String,
      required: true,
      trim: true,
    },
    brand: {
      type: String,
      required: true,
      trim: true,
      maxlength: [50, "Brand cannot be more than 50 characters"],
    },
    type: {
      type: String,
      required: true,
      enum: ["sedan", "suv", "truck", "bus"],
    },
    media: {
      type: [
        {
          mediaUrl: String,
          publicId: String,
        },
      ],
      required: true,
      maxlength: 10,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
    },
    trips: {
      type: Number,
      required: true,
      default: 0,
    },
    summary: {
      type: String,
      required: true,
      trim: true,
      maxlength: [300, "Summary cannot be more than 300 characters"],
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    info: {
      seats: {
        type: Number,
        required: true,
        min: 1,
      },
      transmission: {
        type: String,
        required: true,
        enum: ["manual", "automatic", "hybrid"],
      },
      fuel: {
        type: String,
        required: true,
        enum: ["petrol", "diesel", "electric"],
      },
      year: {
        type: String,
        required: true,
        trim: true,
        maxlength: [4, "Year cannot be more than 4 characters"],
      },
    },
    specs: {
      engine: {
        type: String,
        required: true,
        trim: true,
        maxlength: [50, "Engine cannot be more than 50 characters"],
      },
      mileage: {
        type: String,
        required: true,
        trim: true,
        maxlength: [50, "Mileage cannot be more than 50 characters"],
      },
      topSpeed: {
        type: String,
        required: true,
        trim: true,
        maxlength: [50, "Top Speed cannot be more than 50 characters"],
      },
      boot: {
        type: String,
        required: true,
        trim: true,
        maxlength: [50, "Boot cannot be more than 50 characters"],
      },
    },
    status: {
      type: String,
      required: true,
      enum: ["booked", "unavailable", "open", "reserved"],
      default: "open",
    },
    category: {
      type: String,
      required: true,
      enum: ["executive", "premium", "logistics", "city", "family", "economy"],
    },
    plateNum: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

CarSchema.index({ name: 1 });
CarSchema.index({ brand: 1 });
CarSchema.index({ status: 1 });
CarSchema.index({ category: 1 });
CarSchema.index({ "info.transmission": 1, "info.fuel": 1 });
CarSchema.index({ type: 1 });

const Car =
  mongoose.models.Car || mongoose.model<ICar>("Car", CarSchema, "car");

export default Car;
