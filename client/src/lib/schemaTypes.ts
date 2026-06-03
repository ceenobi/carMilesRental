import { z } from "zod";

export const registerSchema = z.object({
  fullname: z
    .string({
      message: "Full name is required",
    })
    .min(3, {
      message: "Full name must be at least 3 characters long",
    }),
  email: z.email({
    message: "Email is required",
  }),
  phone: z
    .string({
      message: "Phone is required",
    })
    .refine(
      (num) => /^\+\d{10,15}$/.test(num),
      "Phone number must start with a + and contain 10-15 digits",
    ),
  password: z
    .string({
      message: "Password is required",
    })
    .min(6, {
      message: "Password must be at least 6 characters long",
    })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[!@#$%^&*(),.?":{}|<>]/, {
      message: "Password must contain at least one special character",
    }),
});

export const loginSchema = z.object({
  email: z.email({
    message: "Email is required",
  }),
  password: z
    .string({
      message: "Password is required",
    })
    .min(6, {
      message: "Password must be at least 6 characters long",
    })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[!@#$%^&*(),.?":{}|<>]/, {
      message: "Password must contain at least one special character",
    }),
});

export const verifyEmailSchema = z.object({
  otp: z
    .string({
      message: "OTP is required",
    })
    .min(6, {
      message: "OTP must be at least 6 characters long",
    }),
});

export const resendOtpSchema = z.object({
  email: z.email({
    message: "Email is required",
  }),
});

export const resetPasswordSchema = z.object({
  otp: z
    .string({
      message: "OTP is required",
    })
    .min(6, {
      message: "OTP must be at least 6 characters long",
    }),
  newPassword: z
    .string({
      message: "New password is required",
    })
    .min(6, {
      message: "New password must be at least 6 characters long",
    })
    .regex(/[A-Z]/, {
      message: "New password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "New password must contain at least one lowercase letter",
    })
    .regex(/[!@#$%^&*(),.?":{}|<>]/, {
      message: "New password must contain at least one special character",
    }),
});

export const contactSchema = z.object({
  fullname: z
    .string({
      message: "Full name is required",
    })
    .min(3, {
      message: "Full name must be at least 3 characters long",
    }),
  email: z.email({
    message: "Email is required",
  }),
  phone: z
    .string({
      message: "Phone is required",
    })
    .refine(
      (num) => /^\+\d{10,15}$/.test(num),
      "Phone number must start with a + and contain 10-15 digits",
    ),
  subject: z
    .string({
      message: "Subject is required",
    })
    .min(3, {
      message: "At least 3 characters is needed",
    })
    .max(50, {
      message: "Subject cannot be greater than 50 characters",
    }),
  message: z
    .string({
      message: "Message is required",
    })
    .min(10, {
      message: "At least 10 characters is needed",
    })
    .max(200, {
      message: "Message cannot be greater than 200 characters",
    }),
});

export const quickBookSchema = z.object({
  pickUpLocation: z
    .string({
      message: "Pick up location is required",
    })
    .min(1, {
      message: "Pick up location is required",
    }),
  pickUpDate: z.string().min(1, "Pick up date is required"),
  dropOffDate: z.string().min(1, "Drop off date is required"),
});

export const bookingSchema = z.object({
  carId: z.string(),
  pickUpLocation: z
    .string({
      message: "Pick up location is required",
    })
    .min(3, {
      message: "Pick up location must be at least 3 characters long",
    }),
  dropOffLocation: z
    .string({
      message: "Drop off location is required",
    })
    .min(3, {
      message: "Drop off location must be at least 3 characters long",
    }),
  pickUpDate: z.string().min(1, "Pick up date is required"),
  pickUpTime: z
    .string({
      message: "Pick up time is required",
    })
    .min(3, {
      message: "Pick up time must be at least 3 characters long",
    }),
  dropOffDate: z.string().min(1, "Drop off date is required"),
  dropOffTime: z
    .string({
      message: "Drop off time is required",
    })
    .min(3, {
      message: "Drop off time must be at least 3 characters long",
    }),
  addDriver: z
    .preprocess((val) => val === "true" || val === true, z.boolean())
    .optional(),
});

export const initializePaystackSchema = z.object({
  amount: z.coerce.number().min(1),
  paymentMethod: z.enum(["paystack"]),
  carId: z.string(),
  bookingId: z.string(),
});

export const verifyPaymentSchema = z.object({
  reference: z.string(),
});

export const adminNewBookingSchema = bookingSchema.merge(
  z.object({
    fullname: z.string().min(3, "Full name must be at least 3 characters long"),
    phone: z
      .string()
      .min(1, "Phone is required")
      .refine(
        (num) => /^\+\d{10,15}$/.test(num),
        "Phone number must start with a + and contain 10-15 digits",
      ),
    email: z.email({
      message: "Email is required",
    }),
    paymentMethod: z.enum(["paystack", "pay_with_bank"]),
  }),
);

export const driverSchema = z.object({
  fullname: z
    .string({ message: "Full name is required" })
    .min(3, { message: "Full name must be at least 3 characters long" }),
  email: z.email({ message: "Email is required" }),
  phone: z
    .string({ message: "Phone is required" })
    .refine((num) => /^\+\d{10,15}$/.test(num), "Invalid phone number"),
  license: z
    .string({ message: "Driver license is required" })
    .min(3, { message: "Driver license must be at least 3 characters long" }),
  licenseExpiryDate: z.string({
    message: "License expiry date is required",
  }),
  language: z
    .array(z.enum(["English", "Igbo", "Hausa", "Yoruba", "Pidgin"]))
    .min(1, { message: "At least one language is required" }),
  status: z.enum(["active", "inactive", "available", "off-duty", "booked"]),
  baseCity: z.string({ message: "Base city is required" }),
  yearsOfExperience: z.string({ message: "Years of experience is required" }),
  isVerified: z.boolean({ message: "Driver verified status is required" }).default(false),
});

export const carSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Car name is required")
    .max(50, "Car name cannot be more than 50 characters"),
  brand: z
    .string()
    .trim()
    .min(1, "Brand is required")
    .max(50, "Brand cannot be more than 50 characters"),
  type: z.enum(["sedan", "suv", "truck", "bus"]),
  media: z
    .array(
      z.object({
        mediaUrl: z.string().min(1, "Media URL is required"),
        publicId: z.string().min(1, "Public ID is required"),
      }),
    )
    .min(1, "At least one media item is required")
    .max(10, "Cannot have more than 10 media items"),
  rating: z.number().min(0).max(5).optional(),
  trips: z.number().min(0).default(0),
  summary: z
    .string()
    .trim()
    .min(1, "Summary is required")
    .max(300, "Summary cannot be more than 300 characters"),
  price: z.number().min(0, "Price must be a positive number"),
  info: z.object({
    seats: z.number().min(1, "At least 1 seat required"),
    transmission: z.enum(["manual", "automatic", "hybrid"]),
    fuel: z.enum(["petrol", "diesel", "electric"]),
    year: z.string().trim().max(4, "Year cannot be more than 4 characters"),
  }),
  specs: z.object({
    engine: z
      .string()
      .trim()
      .max(50, "Engine cannot be more than 50 characters"),
    mileage: z
      .string()
      .trim()
      .max(50, "Mileage cannot be more than 50 characters"),
    topSpeed: z
      .string()
      .trim()
      .max(50, "Top speed cannot be more than 50 characters"),
    boot: z.string().trim().max(50, "Boot cannot be more than 50 characters"),
  }),
  status: z.enum(["booked", "unavailable", "open"]).default("open"),
  category: z.enum([
    "executive",
    "premium",
    "logistics",
    "city",
    "family",
    "economy",
  ]),
});

export const UploadSchema = z.object({
  files: z.array(z.string()).min(1, {
    message: "At least one file is required",
  }),
  folder: z.string().min(1, {
    message: "Folder is required",
  }),
});

export const DeleteMediaSchema = z.object({
  mediaIds: z.array(z.string()),
});

export type loginSchemaType = z.infer<typeof loginSchema>;
export type registerSchemaType = z.infer<typeof registerSchema>;
export type verifyEmailSchemaType = z.infer<typeof verifyEmailSchema>;
export type resendOtpSchemaType = z.infer<typeof resendOtpSchema>;
export type contactSchemaType = z.infer<typeof contactSchema>;
export type resetPasswordSchemaType = z.infer<typeof resetPasswordSchema>;
export type quickBookSchemaType = z.infer<typeof quickBookSchema>;
export type bookingSchemaType = z.infer<typeof bookingSchema>;
export type initializePaystackSchemaType = z.infer<
  typeof initializePaystackSchema
>;
export type verifyPaymentSchemaType = z.infer<typeof verifyPaymentSchema>;
export type adminNewBookingSchemaType = z.infer<typeof adminNewBookingSchema>;
export type driverSchemaType = z.infer<typeof driverSchema>;
export type carSchemaType = z.infer<typeof carSchema>;
export type uploadSchemaType = z.infer<typeof UploadSchema>;
export type deleteMediaSchemaType = z.infer<typeof DeleteMediaSchema>;


export type DashboardStatsData = {
  summary: {
    totalRevenue: number;
    totalBookings: number;
    totalCars: number;
    totalDrivers: number;
    totalCustomers: number;
  };
  revenueOverview: { month: string; revenue: number }[];
  fleetStatus: Record<string, number>;
  topVehicles: { name: string; revenue: number; trips: number }[];
  recentBookings: {
    id: string;
    customer: string;
    car: string;
    amount: number;
    status: string;
    date: string;
  }[];
};

export type UserSession = {
  _id: string;
  email: string;
  fullname: string;
  role: string;
  phone: string;
  emailVerfied: boolean;
  createdAt: string;
  updatedAt: string;
};
