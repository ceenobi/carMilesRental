import Filter from "@/components/features/explore/filter";
import NotFound from "@/components/features/notFound";
import Search from "@/components/nav/search";
import { Button } from "@/components/ui/button";
import Paginate from "@/components/ui/paginate";
import { CarSkeletonGrid } from "@/components/ui/skeletonLoader";
import useMetaArgs from "@/hooks/useMeta";
import type { UsePaginateProps } from "@/hooks/usePaginate";
import usePaginate from "@/hooks/usePaginate";
import type { CarProduct } from "@/lib/constants";
import React, { lazy } from "react";
import {
  useLoaderData,
  useSearchParams,
  Outlet,
  useLocation,
} from "react-router";

const ProductCard = lazy(() => import("@/components/features/productCard"));

export default function Explore() {
  useMetaArgs({
    title: "Explore cars",
    description: "Explore cars for rent",
    keywords: "car rentals, car miles, car miles calculator",
  });
  const { cars } = useLoaderData() as {
    cars: { cars: CarProduct[]; meta: UsePaginateProps } | null;
  };
  const { cars: resolvedCars, meta } = cars || {};
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
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
  const path = location.pathname;

  const searchType = (p: string) => {
    if (p === "all") {
      const params = new URLSearchParams(searchParams);
      params.delete("type");
      setSearchParams(params);
      return;
    }
    setSearchParams({ type: p });
  };

  return (
    <>
      {path === "/cars" ? (
        <>
          <div className="relative min-h-screen">
            <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/50 to-black/70 z-10" />
            <img
              src="https://res.cloudinary.com/ceenobi/image/upload/f_auto,q_auto/v1777546727/explore_t9iasd.png"
              alt="exploreBackground"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="relative z-20 min-h-screen flex items-center">
              <div className="container mx-auto px-4 py-20 text-center">
                <div className="space-y-6">
                  <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-tight">
                    Find your{" "}
                    <span className="text-DeepOrange">perfect ride.</span>
                  </h1>
                  <p className="text-sm sm:text-base md:text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
                    From economy sedans to head-turning luxury SUVs and
                    heavy-duty trucks — every vehicle inspected, insured and
                    ready.
                  </p>
                </div>
              </div>
            </div>
            <div className="py-8 px-4 md:px-8 bg-white container mx-auto absolute top-[93%] left-0 right-0 z-30 rounded-2xl">
              <div className="flex flex-col md:flex-row justify-between gap-10 items-center">
                <Search
                  id="searchCars"
                  placeholder="Search by name or brand..."
                />
                <div>
                  <div className="flex gap-2">
                    {["all", "sedan", "suv", "truck", "bus"].map((p) => (
                      <Button
                        key={p}
                        onClick={() => searchType(p)}
                        className={`px-4 py-2 md:w-20 h-auto text-sm rounded-lg transition-colors capitalize ${(p === "all" && !searchParams.get("type")) ||
                          searchParams.get("type") === p
                          ? "bg-DeepOrange hover:bg-DeepOrange/90 text-white font-medium"
                          : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                          }`}
                        size="lg"
                      >
                        {p === "all"
                          ? "all"
                          : p === "sedan"
                            ? "sedan"
                            : p === "suv"
                              ? "suv"
                              : p === "truck"
                                ? "truck"
                                : p === "bus"
                                  ? "bus"
                                  : "all"}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="container mx-auto py-24 px-4">
            <div className="mt-20 md:mt-0 space-y-10">
              <div className="flex justify-between items-center">
                <h1 className="font-medium text-MainBlack text-lg md:text-2xl">
                  {resolvedCars?.length || 0}{" "}
                  <span className="text-SoftBlack">vehicles available</span>
                </h1>
                <Filter />
              </div>
              <React.Suspense fallback={<CarSkeletonGrid />}>
                <>
                  {resolvedCars?.length > 0 ? (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {resolvedCars?.map((car) => (
                          <ProductCard key={car._id} car={car} />
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
                    <NotFound image="/fileSearch.svg" title="No cars found" description="No cars found matching your criteria." />
                  )}
                </>
              </React.Suspense>
            </div>
          </div>
        </>
      ) : (
        <Outlet />
      )}
    </>
  );
}
