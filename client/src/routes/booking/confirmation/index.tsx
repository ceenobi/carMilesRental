import LazyLoadImageRC from "@/components/ui/lazyLoadImage";
import { Separator } from "@/components/ui/separator";
import type { CarProduct } from "@/lib/constants";
import type { bookingSchemaType } from "@/lib/schemaTypes";
import { formatDate, formatTime } from "@/lib/utils";
import { MapPin, Sparkles } from "lucide-react";
import { useOutletContext } from "react-router";

export default function Confirmation() {
  const { car, days, savedBooking } = useOutletContext() as {
    car: CarProduct;
    days: number;
    savedBooking: bookingSchemaType;
  };

  const bookingSummary = [
    {
      id: 1,
      icon: MapPin,
      pickUp: savedBooking?.pickUpLocation || "N/A",
      date: savedBooking?.pickUpDate || "",
      time: savedBooking?.pickUpTime || "",
    },
    {
      id: 2,
      icon: MapPin,
      pickUp: savedBooking?.dropOffLocation || "N/A",
      date: savedBooking?.dropOffDate || "",
      time: savedBooking?.dropOffTime || "",
    },
  ];

  return (
    <div className="bg-white rounded-xl p-4 md:col-span-7 space-y-8 h-fit">
      <div className="flex gap-4 items-center">
        <LazyLoadImageRC
          alt={car?.name || "Car"}
          src={car?.media[0]?.mediaUrl || ""}
          width="150px"
          height="100px"
          className="h-20 object-contain"
        />
        <div>
          <p className="text-MainBlack text-sm font-light uppercase">
            {car?.type}
          </p>
          <h1 className="text-MainBlack text-xl md:text-2xl font-bold">
            {car?.name}
          </h1>
          {savedBooking?.addDriver && (
            <p className="text-SoftBlack">{days} days with Driver</p>
          )}
        </div>
      </div>
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4 lg:gap-8">
        {bookingSummary.map((option) => (
          <div
            className={
              "border border-SoftBlack/20 rounded-2xl p-6 w-full lg:h-40"
            }
            key={option.id}
          >
            <option.icon className="text-DeepOrange mb-2" size={24} />
            <div>
              <h1 className="text-MainBlack text-base tracking-tight">
                {option.pickUp}
              </h1>
              <div className="flex items-center">
                <span className="text-SoftBlack text-sm">
                  {formatDate(option.date as unknown as string)} -{" "}
                  {formatTime(option.time)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Separator />
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="text-DeepOrange" />
          <h1 className="text-MainBlack text-base font-normal">What's next</h1>
        </div>
        <div className="text-sm text-SoftBlack space-y-2">
          <p>
            1. A concierge will call you within 30 minutes to confirm pickup
            details
          </p>
          <p>2. Bring your driver’s licence and a valid ID at pickup</p>
          <p>
            3. Free cancellation until 24hours before{" "}
            {formatDate(savedBooking?.pickUpDate as unknown as string)}.
          </p>
        </div>
      </div>
    </div>
  );
}
