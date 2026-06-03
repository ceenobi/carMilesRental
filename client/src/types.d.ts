import type { driverSchemaType } from "./lib/schemaTypes";

export interface bookingDataProps {
  [key: string]: unknown;
  _id: string;
  pickUpLocation: string;
  dropOffLocation: string;
  pickUpDate: string;
  pickUpTime: string;
  dropOffDate: string;
  dropOffTime: string;
  addDriver: boolean;
  rentalTotal: number;
  rentalDays: number;
  serviceFee: number;
  grandTotal: number;
  status:
    | "upcoming"
    | "ongoing"
    | "completed"
    | "cancelled"
    | "failed"
    | "pending";
  carId: {
    plateNum: string;
    name: string;
  };
  userId: {
    fullname: string;
  };
  driver: {
    fullname: string;
  };
}

export interface PaymentDetailsProps {
  [key: string]: unknown;
  _id: string;
  bookingId: string;
  carId: string;
  userId: string;
  driverId: string;
  amount: number;
  status: "pending" | "success" | "cancelled" | "failed" | "refunded";
  reference: string;
  paymentMethod: "pay_with_bank" | "paystack";
  paidAt: string;
}

export interface TimelineProps {
  [key: string]: unknown;
  _id: string;
  bookingId: string;
  status: string;
  title: "created" | "paid" | "cancelled" | "completed";
  description: string;
  actor: string;
  createdAt: string;
}

export type DriverRCProps = driverSchemaType & {
  [key: string]: unknown;
  _id: string;
  trips: number;
  rating: number;
};

export interface CustomerRCProps {
  [key: string]: unknown;
  _id: string;
  fullname: string;
  email: string;
  phone: string;
  totalBookings: number;
  totalSpent: number;
  lastBookingDate: string | null;
}
