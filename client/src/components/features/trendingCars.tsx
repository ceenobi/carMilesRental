import { ArrowRight } from "lucide-react";
import { Suspense, lazy } from "react";
import { Link } from "react-router";
import type { CarProduct } from "@/lib/constants";

const ProductCard = lazy(() => import("@/components/features/productCard"));

export default function TrendingCars({ cars }: { cars: CarProduct[] }) {
  return (
    <>
      <div className="mb-10">
        <div className="space-y-4">
          <p className="text-sm">
            <span className="w-2 h-2 bg-DeepOrange rounded-full inline-block mr-2" />
            Our diverse fleet for comfort and performance
          </p>
          <div className="flex justify-between items-center">
            <h1 className="font-medium text-[40px] text-MainBlack">
              Trending <span className="text-DeepOrange">cars </span> for The
              Week
            </h1>
            <Link
              to="/cars"
              className="font-semibold flex gap-2 items-center text-sm text-DeepOrange"
            >
              Explore full fleet <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
      <Suspense
        fallback={
          <div className="flex justify-center text-center">Loading...</div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars?.slice(0, 3)?.map((car: CarProduct) => (
            <ProductCard key={car._id} car={car} />
          ))}
        </div>
      </Suspense>
    </>
  );
}
