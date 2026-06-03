import NotFound from "@/components/features/notFound";
import Paginate from "@/components/ui/paginate";
import TableView from "@/components/ui/tableView";
import usePaginate, { type UsePaginateProps } from "@/hooks/usePaginate";
import { bookingStatusColors } from "@/lib/constants";
import { cn, formatDate, formatPrice } from "@/lib/utils";
import type { bookingDataProps } from "@/types";
import { useCallback } from "react";
import { Link } from "react-router";
import { useSearchParams } from "react-router";

export default function RenderTable({ resolvedBookings }) {
  const { bookings, stats, meta } =
    (resolvedBookings as {
      bookings: bookingDataProps[];
      stats: Record<string, number>;
      meta: UsePaginateProps;
    }) ?? {};

  const [searchParams, setSearchParams] = useSearchParams();
  const status = (searchParams.get("status") as
    | "all"
    | "upcoming"
    | "ongoing"
    | "completed"
    | "cancelled"
    | "failed"
    | "pending") || "all";
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

  const renderCell = useCallback(
    (item: bookingDataProps, columnKey: React.Key) => {
      const cellValue = item[columnKey as keyof bookingDataProps];
      switch (columnKey) {
        case "plateNum":
          return (
            <p className="text-sm font-normal truncate max-w-44">{item?.carId?.plateNum}</p>
          );
        case "customer":
          return (
            <p className="text-sm font-normal truncate max-w-44">{item?.userId?.fullname}</p>
          );
        case "vehicle":
          return (
            <p className="text-sm font-normal truncate max-w-44">{item?.carId?.name}</p>
          );
        case "pickUpReturn":
          return (
            <div className="flex flex-col text-left text-sm font-normal">
              <span>{formatDate(item?.pickUpDate)}</span>
              <span>{formatDate(item?.dropOffDate)}</span>
            </div>
          );
        case "pickUpLocation":
          return (
            <p className="text-sm font-normal truncate max-w-44">{item?.pickUpLocation}</p>
          );
        case "addDriver":
          return (
            <p className="text-sm font-normal truncate max-w-44">{item?.addDriver ? "With Driver" : "No Driver"}</p>
          );
        case "grandTotal":
          return (
            <p className="text-sm font-normal">{formatPrice(item?.grandTotal)}</p>
          );
        case "status":
          return (
            <div className="text-sm font-normal">
              <span
                className={`px-3 py-1 rounded-full text-xs capitalize ${bookingStatusColors[
                  item?.status as keyof typeof bookingStatusColors
                ] || bookingStatusColors.pending
                  }`}
              >
                {item?.status}
              </span>
            </div>
          );
        case "actions":
          return (
            <Link to={`/dashboard/bookings/${item?._id}`} className="text-sm text-DeepOrange hover:underline">
              View
            </Link>
          );
        default:
          return cellValue as React.ReactNode;
      }
    },
    [],
  );

  const bookingStatus = [
    "all",
    "upcoming",
    "ongoing",
    "completed",
    "cancelled",
    "failed",
    "pending",
  ];

  const getBookingsByStatus = (item: string) => {
    const params = new URLSearchParams(searchParams);
    if (item === "all") {
      params.delete("status");
    } else {
      params.set("status", item);
    }
    setSearchParams(params);
  };

  return (
    <>
      <div className="hidden md:flex gap-4 items-center border-b">
        {bookingStatus.map((item: string) => (
          <div
            key={item}
            className={cn(
              "px-4 py-3 cursor-pointer transition-all duration-300 relative group",
              item === status ? "text-MainBlack" : "text-SoftBlack hover:text-MainBlack",
            )}
            onClick={() => getBookingsByStatus(item)}
          >
            <p className="text-sm font-medium capitalize flex items-center gap-2">
              {item}
              <span className={cn(
                "px-1.5 py-0.5 rounded-md text-[10px] font-bold transition-colors",
                item === status ? "bg-DeepOrange/10 text-DeepOrange" : "bg-gray-100 text-SoftBlack group-hover:bg-gray-200"
              )}>
                {stats?.[item] || 0}
              </span>
            </p>
            {item === status && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-DeepOrange rounded-t-full" />
            )}
          </div>
        ))}
      </div>
      {bookings?.length > 0 ? (
        <>
          <TableView
            tableColumns={[
              { name: "REF", uid: "plateNum" },
              { name: "CUSTOMER", uid: "customer" },
              { name: "VEHICLE", uid: "vehicle" },
              { name: "PICKUP-RETURN", uid: "pickUpReturn" },
              { name: "LOCATION", uid: "pickUpLocation" },
              { name: "DRIVER", uid: "addDriver" },
              { name: "TOTAL", uid: "grandTotal" },
              { name: "STATUS", uid: "status" },
              { name: "ACTION", uid: "actions" },
            ]}
            tableData={bookings}
            renderCell={renderCell}
          />
          <Paginate
            totalPages={totalPages}
            hasMore={hasMore}
            handlePageChange={handlePageChange}
            currentPage={currentPage}
            limit={pageLimit}
          />
        </>
      ) : (
        <NotFound image="/fileSearch.svg" title="No bookings found" description="You have no bookings yet." />
      )}
    </>
  );
}
