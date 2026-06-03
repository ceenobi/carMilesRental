import { Skeleton } from "./skeleton";
import { Separator } from "./separator";

export function CarSkeletonLoader() {
  return (
    <div className="bg-white rounded-2xl shadow border border-gray-100 overflow-hidden">
      {/* Image Skeleton */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        <Skeleton className="w-full h-full" />
        <div className="absolute top-3 left-3">
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="p-5 space-y-4">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-8 w-3/4" />
          </div>
          <div className="text-right shrink-0 space-y-1">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-4 w-12 ml-auto" />
          </div>
        </div>

        <Separator />

        {/* Specs Row */}
        <div className="flex justify-between items-center">
          <div className="flex gap-3 items-center">
            <div className="flex gap-1 items-center">
              <Skeleton className="w-5 h-5 rounded" />
              <Skeleton className="h-4 w-6" />
            </div>
            <div className="flex gap-1 items-center">
              <Skeleton className="w-5 h-5 rounded" />
              <Skeleton className="h-4 w-10" />
            </div>
            <div className="flex gap-1 items-center">
              <Skeleton className="w-5 h-5 rounded" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
          <Skeleton className="h-10 w-17.5 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function CarSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <CarSkeletonLoader key={i} />
      ))}
    </div>
  );
}

export function SkeletonTable() {
  return (
    <>
      <div className="overflow-x-auto shadow rounded-sm">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              {Array.from({ length: 8 }).map((_, index) => (
                <th key={index} className="p-4 font-medium text-gray-500">
                  <Skeleton className="h-4 w-20" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, rowIndex) => (
              <tr key={rowIndex} className="border-b border-gray-100 last:border-0">
                {Array.from({ length: 8 }).map((_, cellIndex) => (
                  <td key={cellIndex} className="p-4">
                    <Skeleton className={`h-5 ${cellIndex === 1 || cellIndex === 3 ? 'w-32' : 'w-24'}`} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export function SkeletonAdminBookDetails() {
  return (
    <div className="container mx-auto space-y-10 py-6 animate-pulse">
      {/* Breadcrumb + action buttons */}
      <div className="flex flex-wrap gap-4 md:gap-0 justify-between items-center">
        <Skeleton className="h-5 w-48" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-40 rounded-xl" />
          <Skeleton className="h-9 w-36 rounded-xl" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column */}
        <div className="lg:col-span-8 space-y-8">
          {/* Summary card */}
          <div className="bg-white rounded-xl p-6 border space-y-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <div className="flex flex-col md:flex-row gap-4 justify-between mt-3">
              <div className="space-y-2">
                <Skeleton className="h-8 w-40" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-16 md:ml-auto" />
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-40" />
              </div>
            </div>
          </div>

          {/* Trip card */}
          <div className="bg-white rounded-xl p-6 border space-y-6">
            <div className="flex gap-2 items-center">
              <Skeleton className="h-6 w-6 rounded" />
              <Skeleton className="h-5 w-12" />
            </div>
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              <div className="border p-4 rounded-lg w-full bg-gray-50 space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-40" />
              </div>
              <div className="border p-4 rounded-lg w-full bg-gray-50 space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-40" />
              </div>
            </div>
          </div>

          {/* Vehicle card */}
          <div className="bg-white rounded-xl p-6 border space-y-6">
            <div className="flex gap-2 items-center justify-between">
              <div className="flex gap-2 items-center">
                <Skeleton className="h-6 w-6 rounded" />
                <Skeleton className="h-5 w-16" />
              </div>
              <Skeleton className="h-4 w-28" />
            </div>
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
              <div className="flex gap-4 items-center">
                <Skeleton className="w-36 sm:w-40 h-36 sm:h-40 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-28" />
                </div>
              </div>
              <Skeleton className="h-7 w-32 rounded-full" />
            </div>
          </div>

          {/* Driver card */}
          <div className="bg-white rounded-xl p-6 border space-y-6">
            <div className="flex gap-2 items-center justify-between">
              <div className="flex gap-2 items-center">
                <Skeleton className="h-6 w-6 rounded" />
                <Skeleton className="h-5 w-14" />
              </div>
            </div>
            <Skeleton className="h-20 w-full rounded-lg" />
          </div>

          {/* Customer card */}
          <div className="bg-white rounded-xl p-6 border space-y-6">
            <div className="flex gap-2 items-center justify-between">
              <div className="flex gap-2 items-center">
                <Skeleton className="h-6 w-6 rounded" />
                <Skeleton className="h-5 w-20" />
              </div>
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="flex gap-4 items-center">
              <Skeleton className="h-14 w-14 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-36" />
                <div className="flex gap-4">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="lg:col-span-4 space-y-8">
          {/* Price breakdown */}
          <div className="bg-white rounded-xl p-6 border space-y-3">
            <Skeleton className="h-5 w-32" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
            <Separator />
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>

          {/* Payment card */}
          <div className="bg-white rounded-xl p-6 border space-y-3">
            <Skeleton className="h-5 w-20" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
