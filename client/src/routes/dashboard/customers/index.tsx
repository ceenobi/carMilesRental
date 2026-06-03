import { Suspense } from "react";
import { Await, useLoaderData } from "react-router";
import DataError from "@/components/error/dataError";
import RenderTable from "@/components/features/customer/renderTable";
import Search from "@/components/nav/search";
import { SkeletonTable } from "@/components/ui/skeletonLoader";
import type { UsePaginateProps } from "@/hooks/usePaginate";
import type { CustomerRCProps } from "@/types";

export default function Customers() {
  const { customers } = useLoaderData<{
    customers: Promise<{
      data: { body: CustomerRCProps["customer"][]; meta: UsePaginateProps };
    }>;
  }>();

  return (
    <div className="container mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-medium text-MainBlack tracking-tighter">
            Customers
          </h1>
          <p className="text-sm md:text-base text-SoftBlack">
            Verifications, lifetime spend and booking history for everyone who
            rents from you.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4 justify-end">
        <Search id="search customers" placeholder="Search by name, phone" />
      </div>
      <Suspense fallback={<SkeletonTable />}>
        <Await
          resolve={customers}
          errorElement={<DataError />}
          children={(resolvedCustomers) => (
            <RenderTable resolvedCustomers={resolvedCustomers?.data?.body} />
          )}
        />
      </Suspense>
    </div>
  );
}
