import type { CarProduct } from "@/lib/constants";
import { toast } from "sonner";

export default function useCalcBookingCost({
  pickUpDate,
  dropOffDate,
  car,
  SERVICE_FEE,
  addDriver = false,
}: {
  pickUpDate: Date | string;
  dropOffDate: Date | string;
  car: CarProduct;
  SERVICE_FEE: number;
  addDriver?: boolean;
}) {
  const DRIVER_FEE_PER_DAY = 10000;
  if (!pickUpDate || !dropOffDate)
    return { days: 0, rentalTotal: 0, grandTotal: 0, driverTotal: 0 };

  const pickup = new Date(pickUpDate);
  const dropoff = new Date(dropOffDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check for past dates
  if (pickup < today) {
    toast.error("Pick-up date cannot be in the past", { id: "bookingDate" });
    return { days: 0, rentalTotal: 0, grandTotal: 0, driverTotal: 0 };
  }

  // Ensure valid dates and dropoff is after pickup
  if (isNaN(pickup.getTime()) || isNaN(dropoff.getTime())) {
    return { days: 0, rentalTotal: 0, grandTotal: 0, driverTotal: 0 };
  }

  const diffTime = dropoff.getTime() - pickup.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Min 1 day, no negative days
  const days = Math.max(1, diffDays);
  const rentalTotal = car?.price ? days * car.price : 0;
  const driverTotal = addDriver ? days * DRIVER_FEE_PER_DAY : 0;
  const grandTotal = rentalTotal + driverTotal + SERVICE_FEE;

  return { days, rentalTotal, grandTotal, driverTotal };
}
