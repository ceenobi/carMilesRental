import type { CarProduct } from "@/lib/constants";
import { Button } from "../ui/button";
import { Link } from "react-router";
import { Separator } from "../ui/separator";
import LazyLoadImageRC from "../ui/lazyLoadImage";
import { formatPrice } from "@/lib/utils";

export default function ProductCard({ car }: { car: CarProduct }) {
  return (
    <div className="bg-white rounded-2xl shadow border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
      <Link to={`/cars/explore/${car.slug}`}>
        <div className="relative h-48 bg-gray-50 overflow-hidden">
          <LazyLoadImageRC
            alt={car.name}
            src={car.media[0].mediaUrl}
            width="100%"
            height="100%"
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700 uppercase">
              {car.category}
            </span>
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-5 space-y-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`py-1 rounded-md text-xs font-light text-SoftBlack uppercase
                `}
              >
                {car?.type}
              </span>
            </div>
            <h3 className="font-semibold text-2xl text-gray-900 line-clamp-1">
              {car.name}
            </h3>
          </div>
          <div className="text-right shrink-0">
            <span className="font-bold text-2xl text-gray-900">
              {formatPrice(car.price)}
            </span>
            <br />
            <span className="text-gray-500">/Day</span>
          </div>
        </div>
        <Separator />

        {/* Book Now Button */}
        <div className="flex justify-between items-center capitalize">
          <div className="flex gap-3 items-center">
            <div className="flex gap-1 items-center">
              <img src="/usersGroup.svg" alt="users" className="w-5 h-5" />
              <span className="text-sm text-gray-600">{car?.info?.seats}</span>
            </div>
            <div className="flex gap-1 items-center">
              <img src="/gasStation.svg" alt="users" className="w-5 h-5" />
              <span className="text-sm text-gray-600">{car?.info?.fuel}</span>
            </div>
            <div className="flex gap-1 items-center">
              <img src="/filter.svg" alt="users" className="w-5 h-5" />
              <span className="text-sm text-gray-600">
                {car?.info?.transmission}
              </span>
            </div>
          </div>
          <Link to={`/book-ride/${car.slug}?step=1`}>
            <Button className="w-17.5 ml-auto bg-DeepOrange hover:bg-DeepOrange/90 text-white font-medium rounded-lg py-5 mt-2 group/btn">
              Book
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
