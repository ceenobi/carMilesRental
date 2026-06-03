import ActionButton from "@/components/ui/actionButton";
import LazyLoadImageRC from "@/components/ui/lazyLoadImage";
import { Separator } from "@/components/ui/separator";
import type { CarProduct } from "@/lib/constants";
import { formatDate, formatPrice } from "@/lib/utils";
import {
  ArrowRight,
  ArrowUpRight,
  Calendar,
  MapPin,
  Phone,
} from "lucide-react";
import { Link, useLocation, useParams, useSearchParams } from "react-router";
import { safeRemoveItem } from "@/lib/storage";

type summaryProp = {
  car: CarProduct;
  getValues: (name: string) => string | undefined;
  pickUpDate?: Date | string;
  dropOffDate?: Date | string;
  days?: number;
  rentalTotal?: number;
  grandTotal?: number;
};

export default function Summary({
  car,
  getValues,
  pickUpDate,
  dropOffDate,
  days,
  rentalTotal,
  grandTotal,
}: summaryProp) {
  const [searchParams] = useSearchParams();
  const { slug } = useParams();
  const bookingId = searchParams.get("bookingId");
  const location = useLocation();
  const path = location.pathname === `/book-ride/${slug}/confirmation`;

  const clearBookings = () => {
    safeRemoveItem("bookingData");
  };

  return (
    <>
      {!path ? (
        <div className="bg-white rounded-xl p-4 md:col-span-5 space-y-4">
          <LazyLoadImageRC
            alt={car?.name || "Car"}
            src={car?.media[0]?.mediaUrl || ""}
            width="100%"
            height="300px"
            className="w-full h-75 object-contain"
          />
          <div className="mt-4 space-y-4">
            <p className="text-MainBlack text-sm font-light uppercase">
              {car?.type}
            </p>
            <h1 className="text-MainBlack text-xl md:text-2xl font-bold">
              {car?.name}
            </h1>
          </div>

          {getValues("pickUpLocation") && (
            <>
              <Separator />
              <div className="flex gap-2 items-center">
                <MapPin className="text-DeepOrange" />
                <p className="text-MainBlack text-base font-normal">
                  {getValues("pickUpLocation")}
                </p>
              </div>
            </>
          )}
          {pickUpDate && dropOffDate && (
            <div className="flex gap-2 items-center">
              <Calendar className="text-DeepOrange" />
              <p className="text-MainBlack text-base font-normal">
                {formatDate(pickUpDate as unknown as string)} -{" "}
                {formatDate(dropOffDate as unknown as string)}
              </p>
            </div>
          )}
          <Separator />
          <div className="flex justify-between items-center">
            <p className="text-SoftBlack">
              {formatPrice(car?.price)} x {days ?? 0} days
            </p>
            <p className="text-MainBlack">{formatPrice(rentalTotal ?? 0)}</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-SoftBlack">Service fee</p>
            <p className="text-MainBlack">{formatPrice(car?.serviceFee)}</p>
          </div>
          {getValues("addDriver") && (
            <div className="flex justify-between items-center">
              <p className="text-SoftBlack">Driver fee (10k/day)</p>
              <p className="text-MainBlack">
                {formatPrice((days ?? 0) * 10000)}
              </p>
            </div>
          )}
          <Separator />
          <div className="flex justify-between items-center text-lg">
            <p className="text-MainBlack">Total</p>
            <p className="text-MainBlack">{formatPrice(grandTotal ?? 0)}</p>
          </div>
          <p className="text-xs text-SoftBlack/70">
            Free cancellation up to 24h before pickup
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl p-4 md:col-span-5 space-y-4 flex items-center justify-center">
          <div className="space-y-2 w-full max-w-sm mx-auto">
            <Link
              className="flex items-center justify-center gap-2 text-SoftBlack hover:text-MainBlack transition-all ease-in-out duration-300"
              to="/cars"
            >
              <h1 className=" text-base font-normal">Browse more cars</h1>
              <ArrowRight size={18} />
            </Link>
            <Link
              className="flex items-center justify-center gap-2 text-SoftBlack hover:text-MainBlack transition-all ease-in-out duration-300"
              to="/bookings"
            >
              <Calendar size={18} />
              <h1 className=" text-base font-normal">Manage from bookings</h1>
            </Link>
            <div className="mt-8">
              <h1 className="text-SoftBlack">TOTAL PAID</h1>
              <h1 className="my-4 text-MainBlack text-3xl">
                {formatPrice(grandTotal ?? 0)}
              </h1>
              <Separator />
              <div className="mt-8 space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-SoftBlack">
                    {formatPrice(car?.price)} x {days ?? 0} days
                  </p>
                  <p className="text-MainBlack">{formatPrice(rentalTotal ?? 0)}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-SoftBlack">Service fee</p>
                  <p className="text-MainBlack">
                    {formatPrice(car?.serviceFee)}
                  </p>
                </div>
                {getValues("addDriver") && (
                  <div className="flex justify-between items-center">
                    <p className="text-SoftBlack">Driver fee (10k/day)</p>
                    <p className="text-MainBlack">
                      {formatPrice((days ?? 0) * 10000)}
                    </p>
                  </div>
                )}
                <ActionButton
                  text={
                    <>
                      <Phone />
                      <p className="text-MainBlack text-sm md:text-base font-normal">
                        Contact Concierge
                      </p>
                    </>
                  }
                  classname="w-full flex items-center justify-center gap-2 py-5.5 px-4 bg-white border-gray-300 text-MainBlack text-sm md:text-base font-normal hover:bg-SoftWhite/90 transition-all rounded-full"
                  type="button"
                />
                <Link
                  to={`/account/bookings/${slug}/${bookingId}`}
                  className="w-full sm:w-auto"
                >
                  <ActionButton
                    text={
                      <>
                        View booking
                        <div className="ml-2 p-1 bg-black/20 rounded-full">
                          <ArrowUpRight size={16} />
                        </div>
                      </>
                    }
                    classname="w-full py-5.5 bg-DeepOrange text-white text-sm md:text-base font-semibold hover:bg-DeepOrange/90 transition-all rounded-full"
                    onClick={clearBookings}
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
