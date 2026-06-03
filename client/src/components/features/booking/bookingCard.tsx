import LazyLoadImageRC from "@/components/ui/lazyLoadImage";
import { bookingStatusColors } from "@/lib/constants";
import type { bookingSchemaType, driverSchemaType, UserSession } from "@/lib/schemaTypes";
import { formatDate, formatPrice } from "@/lib/utils";
import { Calendar, MapPin } from "lucide-react";
import type { CarProduct } from "@/lib/constants";
import { Link } from "react-router";

export type BookingCardRCProps = {
  booking: Omit<bookingSchemaType, "carId"> & {
    carId: CarProduct;
    status: string;
    _id: string;
    rentalDays: number;
    grandTotal: number;
    rentalTotal: number;
    serviceFee: number;
    createdAt?: string;
    driverId?: driverSchemaType;
    userId?: UserSession
  };
};

export default function BookingCard({ booking }: BookingCardRCProps) {
  const statusColor =
    bookingStatusColors[booking.status as keyof typeof bookingStatusColors] ||
    bookingStatusColors.pending;
  return (
    <Link
      to={`/account/bookings/${booking.carId?.slug}/${booking._id}`}
      className="shrink-0 hover:opacity-90 transition-opacity duration-300"
    >
      <div className="grid grid-cols-12 gap-6 border-b border-gray-200 pt-6 pb-6 hover:bg-gray-50 transition-colors duration-300 hover:rounded-md">
        <div className="col-span-12 md:col-span-8 lg:col-span-5">
          <div className="flex gap-4">
            <LazyLoadImageRC
              alt={booking.carId?.name}
              src={booking.carId?.media[0].mediaUrl}
              width="100%"
              height="100%"
              className="w-36 sm:w-40 h-36 sm:h-40 object-contain bg-gray-50 rounded-lg"
            />

            <div className="flex flex-col">
              <p className="text-sm text-SoftBlack uppercase">
                {booking.carId?.plateNum}
              </p>
              <h2 className="text-lg sm:text-xl xl:text-2xl font-bold text-MainBlack line-clamp-1">
                {booking.carId?.name}
              </h2>
              <div className="mt-3">
                <div className="flex gap-2 items-center">
                  <Calendar className="text-DeepOrange" />
                  <p className="text-sm text-SoftBlack font-light">
                    {formatDate(booking.pickUpDate)} -{" "}
                    {formatDate(booking.dropOffDate)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-12 md:col-span-4 lg:col-span-3">
          <div className="flex gap-2">
            <div>
              <MapPin className="text-DeepOrange" />
            </div>

            <p className="text-sm text-SoftBlack font-light">
              {booking.pickUpLocation} - {booking.dropOffLocation}
            </p>
          </div>
        </div>
        <div className="col-span-4 lg:col-span-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}
          >
            {booking.status}
          </span>
        </div>
        <div className="col-span-8 lg:col-span-2">
          <div className="flex lg:flex-col-reverse justify-end gap-4 lg:gap-0">
            <p className="text-sm text-SoftBlack font-light">
              {booking?.rentalDays} days
            </p>
            <div>
              <p className="text-sm text-SoftBlack uppercase">Total</p>
              <h1 className="text-base text-MainBlack font-bold">
                {formatPrice(booking.grandTotal)}
              </h1>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
