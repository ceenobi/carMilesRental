import type { BookingCardRCProps } from "@/components/features/booking/bookingCard";
import ActionButton from "@/components/ui/actionButton";
import LazyLoadImageRC from "@/components/ui/lazyLoadImage";
import { Separator } from "@/components/ui/separator";
import { SkeletonTable } from "@/components/ui/skeletonLoader";
import { bookingStatusColors } from "@/lib/constants";
import { formatDate, formatPrice, formatTime } from "@/lib/utils";
import {
  ArrowUpRight,
  Calendar,
  ChevronLeft,
  Clock,
  Mail,
  MapPin,
  Phone,
  ShieldX,
  UserRound,
} from "lucide-react";
import { Suspense } from "react";
import { Link, useLoaderData, Await } from "react-router";
import DataError from "@/components/error/dataError";
import CancelBooking from "@/components/features/booking/cancelBooking";

export default function BookingDetail() {
  const { booking } = useLoaderData();
  return (
    <>
      <Suspense fallback={<SkeletonTable />}>
        <Await
          resolve={booking}
          errorElement={<DataError />}
          children={(resolvedBooking) => (
            <BookingComponent bookingData={resolvedBooking?.data?.body} />
          )}
        />
      </Suspense>
    </>
  );
}

function BookingComponent({ bookingData }) {
  const { booking } =
    (bookingData as {
      booking: BookingCardRCProps["booking"];
    }) ?? {};
  return (
    <>
      <div className="container mx-auto pt-24 pb-10 px-4 space-y-4">
        <div className="mt-5">
          <Link to="/account/bookings">
            <div className="flex gap-2 items-center text-sm">
              <ChevronLeft size={20} />
              <span className="text-SoftBlack">Back to bookings</span>
            </div>
          </Link>
        </div>

        <div className="flex gap-2 items-center">
          <h1 className="text-lg text-DeepOrange">
            {booking?.carId?.plateNum}
          </h1>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${bookingStatusColors[booking?.status as keyof typeof bookingStatusColors] || bookingStatusColors.pending}`}
          >
            {booking?.status}
          </span>
        </div>
        <h2 className="text-lg sm:text-xl xl:text-4xl font-bold text-MainBlack line-clamp-1">
          {booking?.carId?.name}
        </h2>
      </div>
      <div className="bg-white py-10 px-4">
        <div className="container mx-auto grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8 space-y-8">
            <div className="flex gap-4 rounded-xl border border-gray-200 p-4">
              <LazyLoadImageRC
                alt={booking?.carId?.name}
                src={booking?.carId?.media[0].mediaUrl}
                width="100%"
                height="100%"
                className="w-36 sm:w-40 h-36 sm:h-40 object-contain bg-gray-50 rounded-lg"
              />

              <div className="flex flex-col">
                <p className="text-SoftBlack uppercase">
                  {booking?.carId?.type}
                </p>
                <h2 className="text-lg sm:text-xl xl:text-2xl font-bold text-MainBlack line-clamp-1">
                  {booking?.carId?.name}
                </h2>
                <div className="mt-3">
                  <div className="flex gap-2 items-center">
                    <p className="text-SoftBlack">
                      {booking?.rentalDays} days -{" "}
                      {booking?.addDriver ? "Driver included" : "Self drive"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-gray-200 p-4 space-y-6">
              <h1 className="text-2xl text-MainBlack font-bold">
                Trip Details
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2 bg-SoftWhite py-3 px-4 rounded-xl">
                  <MapPin className="text-DeepOrange" size={20} />
                  <p className="text-SoftBlack uppercase">Pick Up</p>
                  <p className="text-MainBlack">{booking?.pickUpLocation}</p>
                  <p className="flex items-center gap-2 text-SoftBlack">
                    <Clock size={20} /> {formatDate(booking?.pickUpDate)} at{" "}
                    {formatTime(booking?.pickUpTime)}
                  </p>
                </div>
                <div className="flex flex-col gap-2 bg-SoftWhite py-3 px-4 rounded-xl">
                  <MapPin className="text-DeepOrange" size={20} />
                  <p className="text-SoftBlack uppercase">Return</p>
                  <p className="text-MainBlack">{booking?.dropOffLocation}</p>
                  <p className="flex items-center gap-2 text-SoftBlack">
                    <Clock size={20} /> {formatDate(booking?.dropOffDate)} at{" "}
                    {formatTime(booking?.dropOffTime)}
                  </p>
                </div>
              </div>
            </div>
            {booking?.addDriver && (
              <div className="rounded-xl border border-gray-200 p-4 space-y-6">
                <h1 className="text-2xl text-MainBlack font-bold">
                  Driver Details
                </h1>
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex gap-2">
                    <UserRound size={20} className="text-DeepOrange" />
                    <div>
                      <p className="text-SoftBlack uppercase">Lead Driver</p>
                      <p className="text-MainBlack">
                        {booking?.driverId?.fullname || "Not assigned"}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Mail size={20} className="text-DeepOrange" />
                    <div>
                      <p className="text-SoftBlack uppercase">Email</p>
                      <p className="text-MainBlack">
                        {booking?.driverId?.email || "Not assigned"}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Phone size={20} className="text-DeepOrange" />
                    <div>
                      <p className="text-SoftBlack uppercase">Phone</p>
                      <p className="text-MainBlack">
                        {booking?.driverId?.phone || "Not assigned"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="col-span-12 lg:col-span-4 space-y-8">
            <div className="rounded-xl border border-gray-200 p-4 space-y-3">
              <p className="text-SoftBlack uppercase">Total paid</p>
              <h1 className="text-MainBlack text-3xl font-bold">
                {formatPrice(booking?.grandTotal)}
              </h1>
              <Separator />
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-SoftBlack">
                    Vehicle {booking?.rentalDays} days
                  </p>
                  <p className="text-SoftBlack">
                    {formatPrice(booking?.rentalTotal)}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-SoftBlack">Service fee</p>
                  <p className="text-SoftBlack">
                    {formatPrice(booking?.serviceFee)}
                  </p>
                </div>
                <ActionButton
                  text={
                    <>
                      <Phone />
                      <a
                        href={`tel:${booking?.driverId?.phone}`}
                        className="text-MainBlack text-sm md:text-base font-normal"
                      >
                        Contact Concierge
                      </a>
                    </>
                  }
                  classname="w-full flex items-center justify-center gap-2 py-5.5 px-4 bg-white border-gray-200 text-MainBlack text-sm md:text-base font-normal hover:bg-SoftWhite/90 transition-all rounded-full"
                  type="button"
                />
                <Link
                  to={`/book-ride/${booking?.carId?.slug}?step=1`}
                  className="w-full sm:w-auto"
                >
                  <ActionButton
                    text={
                      <>
                        Book again
                        <div className="ml-2 p-1 bg-black/20 rounded-full">
                          <ArrowUpRight size={16} />
                        </div>
                      </>
                    }
                    classname="w-full py-5.5 bg-DeepOrange text-white text-sm md:text-base font-semibold hover:bg-DeepOrange/90 transition-all rounded-full"
                  />
                </Link>
                {booking?.status !== "cancelled" &&
                  booking?.status !== "completed" && (
                    <CancelBooking
                      bookingId={booking?._id}
                      plateNum={booking?.carId?.plateNum}
                    />
                  )}
                <p className="flex items-center justify-center mt-6 gap-2 text-xs text-SoftBlack">
                  <ShieldX size={16} />
                  Free cancellation up to 24 hours before pickup.
                </p>
              </div>
            </div>
            <div className="rounded-xl border border-gray-200 bg-DeepBlue p-4 space-y-3 text-white">
              <div className="flex items-center gap-2">
                <Calendar size={20} />
                <h1 className="text-md font-medium uppercase">Booked on</h1>
              </div>
              <p>{formatDate(booking?.createdAt)}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
