import DataError from "@/components/error/dataError";
import AssignDriver from "@/components/features/booking/assignDriver";
import type { BookingCardRCProps } from "@/components/features/booking/bookingCard";
import CancelBooking from "@/components/features/booking/cancelBooking";
import MarkCompleted from "@/components/features/booking/markCompleted";
import LazyLoadImageRC from "@/components/ui/lazyLoadImage";
import { Separator } from "@/components/ui/separator";
import { SkeletonAdminBookDetails } from "@/components/ui/skeletonLoader";
import { bookingStatusColors } from "@/lib/constants";
import { cn, formatDate, formatPrice, formatTime } from "@/lib/utils";
import type { PaymentDetailsProps, TimelineProps } from "@/types";
import {
  ArrowRight,
  Calendar,
  CarFront,
  CheckCircle,
  ChevronLeft,
  CircleX,
  Clock,
  Coins,
  Mail,
  MapPin,
  Phone,
  UserRound,
  UserStar,
} from "lucide-react";
import { Suspense } from "react";
import { Await, useLoaderData, Link } from "react-router";

export default function BookingDetails() {
  const { booking } = useLoaderData<{
    booking: Promise<{ data: { body: BookingCardRCProps["booking"] } }>;
  }>();
  return (
    <Suspense fallback={<SkeletonAdminBookDetails />}>
      <Await
        resolve={booking}
        errorElement={<DataError />}
        children={(resolvedBooking) => (
          <BookingComponent bookingData={resolvedBooking?.data?.body} />
        )}
      />
    </Suspense>
  );
}

function BookingComponent({ bookingData }) {
  const { booking, payment, timeline } =
    (bookingData as {
      booking: BookingCardRCProps["booking"];
      payment: PaymentDetailsProps;
      timeline: TimelineProps[];
    }) ?? {};
  const statusColor =
    bookingStatusColors[booking?.status as keyof typeof bookingStatusColors] ||
    bookingStatusColors.pending;

  const timelineIcons = (status: string) => {
    switch (status) {
      case "created":
        return (
          <Calendar
            size={36}
            className="bg-yellow-500 p-2 rounded-full text-white"
          />
        );
      case "paid":
        return (
          <Coins
            size={36}
            className="bg-green-500 p-2 rounded-full text-white"
          />
        );
      case "cancelled":
        return (
          <CircleX
            size={36}
            className="bg-red-500 p-2 rounded-full text-white"
          />
        );
      case "completed":
        return (
          <CheckCircle
            size={36}
            className="bg-blue-500 p-2 rounded-full text-white"
          />
        );
      default:
        return (
          <CarFront
            size={36}
            className="bg-MainBlack p-2 rounded-full text-white"
          />
        );
    }
  };

  return (
    <div className="container mx-auto space-y-10 py-6">
      <div className="flex flex-wrap gap-4 md:gap-0 justify-between items-center">
        <div>
          <Link to="/dashboard/bookings">
            <div className="flex gap-2 items-center text-sm">
              <ChevronLeft size={20} />
              <span className="text-SoftBlack">Bookings / </span>
              <span className="text-MainBlack">{booking?.carId?.plateNum}</span>
            </div>
          </Link>
        </div>
        <div className="flex gap-2">
          {booking?.status !== "completed" &&
            booking?.status !== "cancelled" && (
              <MarkCompleted
                bookingId={booking._id}
                plateNum={booking?.carId?.plateNum}
              />
            )}
          {booking?.status !== "cancelled" && (
            <CancelBooking
              bookingId={booking._id}
              plateNum={booking?.carId?.plateNum}
            />
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white rounded-xl p-6 border">
            <div className="flex items-center gap-2">
              <h1 className="text-base text-MainBlack line-clamp-1">
                {booking?.carId?.plateNum}
              </h1>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}
              >
                {booking?.status?.toUpperCase()}
              </span>
            </div>

            <div className="flex flex-col md:flex-row  gap-4 justify-between mt-3">
              <div>
                <h1 className="text-2xl md:text-3xl text-MainBlack font-bold">
                  {formatPrice(booking?.grandTotal)}
                </h1>
                <p className="text-SoftBlack font-light">
                  Created{" "}
                  {booking?.createdAt ? formatDate(booking?.createdAt) : "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm md:text-end text-MainBlack uppercase">
                  PICK UP
                </p>
                <div className="flex items-center gap-2 text-SoftBlack font-light">
                  <Calendar size={18} />
                  <p className="text-sm font-medium">
                    {formatDate(booking?.pickUpDate)}
                  </p>{" "}
                  -<p className="text-sm ">{formatTime(booking?.pickUpTime)}</p>
                </div>
                <div className="flex items-center gap-1 text-SoftBlack font-light">
                  <ArrowRight size={18} />
                  <p className="text-sm">
                    Return {formatDate(booking?.dropOffDate)}
                  </p>{" "}
                  -<p className="text-sm">{booking?.rentalDays} d</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border space-y-6">
            <div className="flex gap-2 items-center">
              <MapPin size={24} />
              <h1 className="text-base text-MainBlack line-clamp-1">Trip</h1>
            </div>
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              <div className="border p-4 rounded-lg w-full bg-gray-100">
                <h2 className="text-base text-MainBlack uppercase mb-2">
                  Pick up
                </h2>
                <h2 className="text-base text-MainBlack font-medium">
                  {booking?.pickUpLocation}
                </h2>
                <div className="flex items-center gap-2 text-SoftBlack font-light">
                  <p className="text-sm">{formatDate(booking?.pickUpDate)}</p> -
                  <p className="text-sm ">{formatTime(booking?.pickUpTime)}</p>
                </div>
              </div>
              <div className="border p-4 rounded-lg w-full bg-gray-100">
                <h2 className="text-base text-MainBlack uppercase mb-2">
                  Return
                </h2>
                <h2 className="text-base text-MainBlack font-medium">
                  {booking?.dropOffLocation}
                </h2>
                <div className="flex items-center gap-2 text-SoftBlack font-light">
                  <p className="text-sm">{formatDate(booking?.dropOffDate)}</p>{" "}
                  -
                  <p className="text-sm ">{formatTime(booking?.dropOffTime)}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border space-y-6">
            <div className="flex gap-2 items-center justify-between">
              <div className="flex gap-2 items-center">
                <CarFront size={24} />
                <h1 className="text-base text-MainBlack line-clamp-1">
                  Vehicle
                </h1>
              </div>
              <Link
                to={`/dashboard/fleet/${booking?.carId?.slug}`}
                className="flex items-center gap-1 text-sm text-DeepOrange font-medium hover:underline"
              >
                View in fleet <ArrowRight size={16} />
              </Link>
            </div>
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
              <div className="flex gap-4 items-center">
                <LazyLoadImageRC
                  alt={booking?.carId?.name}
                  src={booking?.carId?.media[0].mediaUrl}
                  width="100%"
                  height="100%"
                  className="w-36 sm:w-40 h-36 sm:h-40 object-contain bg-gray-50 rounded-lg"
                />

                <div className="flex flex-col">
                  <h2 className="text-lg sm:text-xl font-semibold text-MainBlack line-clamp-1">
                    {booking?.carId?.name}
                  </h2>
                  <p className="text-sm text-SoftBlack uppercase">
                    {booking?.carId?.plateNum}
                  </p>
                  <p className="text-sm text-SoftBlack">
                    {formatPrice(booking?.carId?.price)} / day
                  </p>
                </div>
              </div>
              <div className="font-light bg-DeepOrange/10 px-3 py-1 rounded-full text-xs md:text-sm text-center text-DeepOrange">
                <p>
                  {booking?.driverId && booking?.addDriver
                    ? "Driver added"
                    : "No driver added"}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border space-y-6">
            <div className="flex gap-2 items-center justify-between">
              <div className="flex gap-2 items-center">
                <UserRound size={24} />
                <h1 className="text-base text-MainBlack line-clamp-1">
                  Driver
                </h1>
              </div>
              {booking?.addDriver && !booking?.driverId && (
                <AssignDriver
                  plateNum={booking?.carId?.plateNum}
                  carName={booking?.carId?.name}
                  pickUpDate={booking?.pickUpDate}
                  returnDate={booking?.dropOffDate}
                  bookingId={booking?._id}
                />
              )}
            </div>
            <div
              className={cn(
                booking?.addDriver
                  ? "bg-DeepOrange/10 border-DeepOrange"
                  : "bg-gray-50 border-gray-300",
                "border-dotted border p-6 rounded-lg space-y-3 flex justify-center items-center",
              )}
            >
              {booking?.addDriver ? (
                <p className="text-sm text-DeepOrange">
                  {booking?.driverId
                    ? `Driver assigned: ${booking?.driverId?.fullname}`
                    : "Assign a driver to this booking"}
                </p>
              ) : (
                <p className="text-sm text-SoftBlack">
                  This is a self-drive booking — no driver assignment required.
                </p>
              )}
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border space-y-6">
            <div className="flex gap-2 items-center justify-between">
              <div className="flex gap-2 items-center">
                <UserStar size={24} />
                <h1 className="text-base text-MainBlack line-clamp-1">
                  Customer
                </h1>
              </div>
              <Link
                to={`/dashboard/fleet/${booking?.carId?.slug}`}
                className="flex items-center gap-1 text-sm text-DeepOrange font-medium hover:underline"
              >
                View profile <ArrowRight size={16} />
              </Link>
            </div>
            <div className="flex gap-4 items-center">
              <div
                className="relative h-14 w-14 rounded-full flex items-center justify-center"
                aria-label="Profile menu"
              >
                <span className="w-14 h-14 rounded-full border-2 border-border flex items-center justify-center">
                  {booking?.userId?.fullname
                    ?.split(" ")
                    .map((name) => name[0])
                    .join("")
                    .toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="font-semibold tracking-tighter">
                  {booking?.userId?.fullname}
                </h1>
                <div className="flex flex-col gap-1 md:flex-row md:gap-4">
                  <div className="flex items-center gap-1 text-SoftBlack">
                    <Mail size={16} />
                    <p className="text-sm ">{booking?.userId?.email}</p>
                  </div>
                  <div className="flex items-center gap-1 text-SoftBlack">
                    <Phone size={16} />
                    <p className="text-sm ">{booking?.userId?.phone}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border space-y-6">
            <div className="flex gap-2 items-center">
              <Clock size={24} />
              <h1 className="text-base text-MainBlack line-clamp-1">
                Activity
              </h1>
            </div>
            {timeline.length === 0 ? (
              <div className="flex justify-center items-center h-20">
                <p className="text-sm text-SoftBlack">No activity yet</p>
              </div>
            ) : (
              timeline.map((item: TimelineProps) => (
                <div className="flex gap-3" key={item._id}>
                  <div>{timelineIcons(item.status)}</div>
                  <div>
                    <h1 className="text-base text-MainBlack line-clamp-1 mb-1">
                      {item.title}
                    </h1>
                    <p className="text-sm text-SoftBlack">{item.description}</p>
                    <p className="text-sm text-SoftBlack">
                      {formatDate(item.createdAt)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white rounded-xl p-6 border space-y-3">
            <h1 className="text-base text-MainBlack line-clamp-1 font-semibold">
              Price breakdown
            </h1>
            <div className="flex justify-between items-center text-sm">
              <p className="text-SoftBlack">
                {`${booking?.rentalDays} days`} x{" "}
                {`${formatPrice(booking?.carId?.price)}`}
              </p>
              <p className="text-MainBlack font-medium">
                {formatPrice(booking?.rentalTotal)}
              </p>
            </div>
            <div className="flex justify-between items-center text-sm">
              <p className="text-SoftBlack">Driver Fee</p>
              <p className="text-MainBlack font-medium">
                {formatPrice(10000 * (booking?.rentalDays || 0))}
              </p>
            </div>
            <div className="flex justify-between items-center text-sm">
              <p className="text-SoftBlack">Service Fee</p>
              <p className="text-MainBlack font-medium">
                {formatPrice(booking?.serviceFee)}
              </p>
            </div>
            <Separator />
            <div className="flex justify-between items-center text-sm">
              <p className="text-MainBlack">Total Paid</p>
              <p className="text-MainBlack font-medium">
                {formatPrice(booking?.grandTotal)}
              </p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border space-y-3">
            <h1 className="text-base text-MainBlack line-clamp-1 font-semibold">
              Payment
            </h1>
            <div className="flex justify-between items-center text-sm">
              <p className="text-SoftBlack">Method</p>
              <p className="text-MainBlack font-medium">
                {payment?.paymentMethod}
              </p>
            </div>
            <div className="flex justify-between items-center text-sm">
              <p className="text-SoftBlack">Reference</p>
              <p className="text-MainBlack font-medium">{payment?.reference}</p>
            </div>
            <div className="flex justify-between items-center text-sm">
              <p className="text-SoftBlack">Status</p>
              <div
                className={cn(
                  payment?.status === "success" &&
                    "bg-green-500/10 text-green-600",
                  payment?.status === "failed" && "bg-red-500/10 text-red-600",
                  payment?.status === "pending" &&
                    "bg-yellow-500/10 text-yellow-600",
                  "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                )}
              >
                {payment?.status}
              </div>
            </div>
            <div className="flex justify-between items-center text-sm">
              <p className="text-SoftBlack">Paid At</p>
              <p className="text-MainBlack font-medium">
                {payment?.paidAt ? formatDate(payment?.paidAt) : "Not Paid"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
