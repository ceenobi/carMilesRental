import { useLoaderData, Outlet, useLocation } from "react-router";
import { lazy, Suspense } from "react";
import { CarSkeletonGrid } from "@/components/ui/skeletonLoader";
import Paginate from "@/components/ui/paginate";
import usePaginate from "@/hooks/usePaginate";
import type { BookingCardRCProps } from "@/components/features/booking/bookingCard";

const BookingCard = lazy(
  () => import("@/components/features/booking/bookingCard"),
);

export default function Bookings() {
  const { bookings } = useLoaderData();
  const location = useLocation();
  const path = location.pathname === "/account/bookings";

  const { bookings: resolvedBookings, meta } = bookings || {};
  const {
    handlePageChange,
    totalPages,
    hasMore,
    currentPage,
    limit: pageLimit,
  } = usePaginate({
    totalPages: meta?.totalPages || 1,
    hasMore: meta?.hasMore || false,
    currentPage: meta?.currentPage || 1,
  });

  return (
    <>
      {path ? (
        <>
          <div className="container mx-auto pt-24 pb-10 px-4 space-y-4">
            <div className="mt-5 flex flex-col gap-y-4">
              <h1 className="text-base font-normal text-DeepOrange uppercase">
                account
              </h1>
              <h1 className="text-MainBlack text-3xl sm:text-4xl xl:text-5xl font-bold">
                My bookings
              </h1>
              <p className="text-sm text-SoftBlack">
                Track upcoming trips, review past rides and manage everything in
                one place.
              </p>
            </div>
          </div>
          <div className="bg-white py-10 md:py-20">
            <div className="container mx-auto px-4">
              <Suspense fallback={<CarSkeletonGrid />}>
                <>
                  {resolvedBookings?.length > 0 ? (
                    <>
                      <div className="grid grid-cols-1 gap-6 mb-6">
                        {resolvedBookings?.map((booking: BookingCardRCProps["booking"]) => (
                          <BookingCard key={booking._id} booking={booking} />
                        ))}
                      </div>
                      <Paginate
                        totalPages={totalPages}
                        hasMore={hasMore}
                        handlePageChange={handlePageChange}
                        currentPage={currentPage}
                        limit={pageLimit}
                      />
                    </>
                  ) : (
                    <div className="flex flex-col justify-center items-center">
                      <img
                        src="/fileSearch.svg"
                        alt="notfound"
                        className="w-56 h-56"
                      />
                      <p className="text-base text-SoftBlack">
                        No bookings found. Check back later!
                      </p>
                    </div>
                  )}
                </>
              </Suspense>
            </div>
          </div>
        </>
      ) : (
        <Outlet />
      )}
    </>
  );
}
