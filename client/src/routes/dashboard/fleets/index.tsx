import DataError from "@/components/error/dataError";
import AddFleet from "@/components/features/fleets/addFleet";
import RenderTable from "@/components/features/fleets/renderTable";
import StatsCard from "@/components/features/fleets/statsCard";
import { SkeletonTable } from "@/components/ui/skeletonLoader";
import type { UsePaginateProps } from "@/hooks/usePaginate";
import type { CarProduct } from "@/lib/constants";
import { Suspense } from "react";
import { Await, useLoaderData } from "react-router";

interface StatsCardProps {
    totalBooked: number;
    totalOpen: number;
    totalUnavailable: number;
    totalReserved: number;
}

export default function FleetsPage() {
  const { cars } = useLoaderData() as {
    cars: {
      cars: CarProduct[];
      meta: UsePaginateProps;
      stats: StatsCardProps;
    } | null;
  };
  const { cars: resolvedCars, meta, stats } = cars || {};

  return (
    <div className="container mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-medium text-MainBlack tracking-tighter">
            Fleets
          </h1>
          <p className="text-sm md:text-base text-SoftBlack">
            Track availability, utilization and revenue per vehicle.
          </p>
        </div>
        <AddFleet />
      </div>
      <Suspense fallback={<SkeletonTable />}>
        <StatsCard stats={stats} />
        <Await
          resolve={resolvedCars}
          errorElement={<DataError />}
          children={(resolvedCars) => (
            <>
              <RenderTable resolvedCars={resolvedCars} meta={meta} />
            </>
          )}
        />
      </Suspense>
    </div>
  );
}
