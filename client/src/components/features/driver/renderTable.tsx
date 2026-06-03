import { useCallback } from "react";
import { Star } from "lucide-react";
import usePaginate from "@/hooks/usePaginate";
import { useSearchParams } from "react-router";
import type { DriverRCProps } from "@/types";
import type { UsePaginateProps } from "@/hooks/usePaginate";
import { cn, formatDate } from "@/lib/utils";
import TableView from "@/components/ui/tableView";
import Paginate from "@/components/ui/paginate";
import NotFound from "@/components/features/notFound";
import { driverStatusColors } from "@/lib/constants";

export default function RenderTable({ resolvedDrivers }) {
  const { drivers, stats, meta } =
    (resolvedDrivers as {
      drivers: DriverRCProps[];
      stats: Record<string, number>;
      meta: UsePaginateProps;
    }) ?? {};
  const [searchParams, setSearchParams] = useSearchParams();
  const status =
    (searchParams.get("status") as
      | "active"
      | "inactive"
      | "available"
      | "off-duty") || "all";
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
    (item: DriverRCProps, columnKey: React.Key) => {
      const cellValue = item[columnKey as keyof DriverRCProps];
      switch (columnKey) {
        case "fullname":
          return (
            <p className="text-sm font-normal truncate max-w-44">
              {item?.fullname}
            </p>
          );
        case "phone":
          return (
            <p className="text-sm font-normal truncate max-w-44">
              {item?.phone}
            </p>
          );
        case "license":
          return (
            <div className="max-w-44">
              <p className="text-sm font-normal truncate">{item?.license}</p>
              <p className="text-xs font-normal truncate text-red-600">
                Exp: {formatDate(item?.licenseExpiryDate as unknown as string)}
              </p>
            </div>
          );
        case "language":
          return (
            <p className="text-sm font-normal truncate max-w-44">
              {item?.language?.join(", ")}
            </p>
          );
        case "rating":
          return (
            <div className="flex gap-1 items-center">
              <Star className="text-DeepOrange" size={14} />
              <p className="text-sm font-normal truncate max-w-44">
                {item?.rating}
              </p>
            </div>
          );
        case "trips":
          return <p className="text-sm font-normal">{item?.trips}</p>;
        case "status":
          return (
            <div className="text-sm font-normal">
              <span
                className={`px-3 py-1 rounded-full text-xs capitalize ${
                  driverStatusColors[
                    item?.status as keyof typeof driverStatusColors
                  ]
                }`}
              >
                {item?.status}
              </span>
            </div>
          );
        default:
          return cellValue as React.ReactNode;
      }
    },
    [],
  );

  const driverStatus = ["all", "active", "inactive", "available", "off-duty"];

  const getDriversByStatus = (item: string) => {
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
        {driverStatus.map((item: string) => (
          <div
            key={item}
            className={cn(
              "px-4 py-3 cursor-pointer transition-all duration-300 relative group",
              item === status
                ? "text-MainBlack"
                : "text-SoftBlack hover:text-MainBlack",
            )}
            onClick={() => getDriversByStatus(item)}
          >
            <p className="text-sm font-medium capitalize flex items-center gap-2">
              {item}
              <span
                className={cn(
                  "px-1.5 py-0.5 rounded-md text-[10px] font-bold transition-colors",
                  item === status
                    ? "bg-DeepOrange/10 text-DeepOrange"
                    : "bg-gray-100 text-SoftBlack group-hover:bg-gray-200",
                )}
              >
                {stats?.[item] || 0}
              </span>
            </p>
            {item === status && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-DeepOrange rounded-t-full" />
            )}
          </div>
        ))}
      </div>
      {drivers?.length > 0 ? (
        <>
          <TableView
            tableColumns={[
              { name: "DRIVER", uid: "fullname" },
              { name: "PHONE", uid: "phone" },
              { name: "LICENSE", uid: "license" },
              { name: "LANGUAGES", uid: "language" },
              { name: "RATE", uid: "rating" },
              { name: "TRIPS", uid: "trips" },
              { name: "STATUS", uid: "status" },
            ]}
            tableData={drivers}
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
        <NotFound
          image="/fileSearch.svg"
          title="No bookings found"
          description="You have no bookings yet."
        />
      )}
    </>
  );
}
