import { useLoaderData, Await } from "react-router";
import NewBooking from "../../../components/features/booking/newBooking";
import { Suspense } from "react";
import { SkeletonTable } from "@/components/ui/skeletonLoader";
import RenderTable from "../../../components/features/booking/renderTable";
import Search from "@/components/nav/search";
import DataError from "@/components/error/dataError";
import Filter from "@/components/features/booking/filter";
import type { BookingCardRCProps } from "@/components/features/booking/bookingCard";
import type { UsePaginateProps } from "@/hooks/usePaginate";

export default function DasboardBookings() {
  const { bookings } = useLoaderData<{ bookings: Promise<{ data: { body: BookingCardRCProps["booking"][], meta: UsePaginateProps } }> }>();

  return (
    <div className="container mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-medium text-MainBlack tracking-tighter">
            Bookings
          </h1>
          <p className="text-sm md:text-base text-SoftBlack">
            Manage all reservations across your fleet
          </p>
        </div>
        <NewBooking />
      </div>
      <div className="flex items-center gap-4 justify-end">
        <Search id="search bookings" placeholder="Search by ref, customer, location" />
        <Filter />
      </div>
      <Suspense fallback={<SkeletonTable />}>
        <Await
          resolve={bookings}
          errorElement={<DataError />}
          children={(resolvedBookings) => (
            <RenderTable resolvedBookings={{
              bookings: resolvedBookings?.data?.body || [],
              stats: {},
              meta: resolvedBookings?.data?.meta || { totalPages: 1, hasMore: false, currentPage: 1 }
            }} />
          )}
        />
      </Suspense>
    </div>
  );
}
