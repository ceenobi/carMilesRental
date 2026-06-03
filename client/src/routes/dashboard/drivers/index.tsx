import DataError from "@/components/error/dataError";
import Search from "@/components/nav/search";
import { SkeletonTable } from "@/components/ui/skeletonLoader";
import { Suspense } from "react";
import { useLoaderData, Await } from "react-router";
import RenderTable from "../../../components/features/driver/renderTable";
import type { driverSchemaType } from "@/lib/schemaTypes";
import type { UsePaginateProps } from "@/hooks/usePaginate";
import StatsCard from "../../../components/features/driver/statsCard";
import AddDriver from "@/components/features/driver/addDriver";

export default function Drivers() {
  const { drivers } = useLoaderData<{
    drivers: Promise<{
      data: {
        body: {
          drivers: driverSchemaType[];
          meta: UsePaginateProps;
          stats: {
            all?: number;
            active: number;
            inactive?: number;
            available?: number;
            "off-duty": number;
            averageRating: number;
            availableToday: number;
          };
        };
      };
    }>;
  }>();
  return (
    <div className="container mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-medium text-MainBlack tracking-tighter">
            Drivers
          </h1>
          <p className="text-sm md:text-base text-SoftBlack">
            Your professional driver roster - assignments, ratings and document
            expiry.
          </p>
        </div>
        <AddDriver />
      </div>
      <div className="flex items-center gap-4 justify-end">
        <Search
          id="search drivers"
          placeholder="Search by name, phone, license"
        />
      </div>
      <Suspense fallback={<SkeletonTable />}>
        <Await
          resolve={drivers}
          errorElement={<DataError />}
          children={(resolvedDrivers) => (
            <>
              <StatsCard stats={resolvedDrivers?.data?.body?.stats} />
              <RenderTable resolvedDrivers={resolvedDrivers?.data?.body} />
            </>
          )}
        />
      </Suspense>
    </div>
  );
}
