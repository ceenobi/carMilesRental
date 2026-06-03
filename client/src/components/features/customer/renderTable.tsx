import type { UsePaginateProps } from "@/hooks/usePaginate";
import usePaginate from "@/hooks/usePaginate";
import type { CustomerRCProps } from "@/types";
import NotFound from "../notFound";
import Paginate from "@/components/ui/paginate";
import TableView from "@/components/ui/tableView";
import { useCallback } from "react";
import { formatDate, formatPrice } from "@/lib/utils";

export default function RenderTable({ resolvedCustomers }) {
  const { customers, meta } =
    (resolvedCustomers as {
      customers: CustomerRCProps[];
      meta: UsePaginateProps;
    }) ?? {};
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
    (item: CustomerRCProps, columnKey: React.Key) => {
      const cellValue = item[columnKey as keyof CustomerRCProps];
      switch (columnKey) {
        case "fullname":
          return (
            <p className="text-sm font-normal truncate max-w-44">
              {item?.fullname}
            </p>
          );
        case "email":
          return (
            <p className="text-sm font-normal truncate max-w-44">
              {item?.email}
            </p>
          );
        case "phone":
          return (
            <p className="text-sm font-normal truncate max-w-44">
              {item?.phone}
            </p>
          );
        case "totalBookings":
          return (
            <p className="text-sm font-normal truncate max-w-44">
              {item?.totalBookings}
            </p>
          );
        case "totalSpent":
          return (
            <p className="text-sm font-normal truncate max-w-44">
              {formatPrice(item?.totalSpent)}
            </p>
          );
        case "lastBookingDate":
          return (
            <p className="text-sm font-normal truncate max-w-44">
              {formatDate(item?.lastBookingDate as unknown as string)}
            </p>
          );
        default:
          return cellValue as React.ReactNode;
      }
    },
    [],
  );

  return (
    <>
      {customers?.length > 0 ? (
        <>
          <TableView
            tableColumns={[
              { name: "CUSTOMER", uid: "fullname" },
              { name: "EMAIL ADDRESS", uid: "email" },
              { name: "PHONE", uid: "phone" },
              { name: "BOOKINGS", uid: "totalBookings" },
              { name: "TOTAL SPENT", uid: "totalSpent" },
              { name: "LAST BOOKING", uid: "lastBookingDate" },
            ]}
            tableData={customers}
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
          title="No customers found"
          description="You have no customers yet."
        />
      )}
    </>
  );
}
