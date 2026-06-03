import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ArrowUpRight, CalendarDays, Car, Eraser, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { safeGetItem, safeRemoveItem, safeSetItem } from "@/lib/storage";
import type { CarProduct } from "@/lib/constants";

export default function Filter({ cars }: { cars: CarProduct[] }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const savedBookingData = safeGetItem("bookingData");
  const initialFilters = savedBookingData ? JSON.parse(savedBookingData) : {};

  const [filters, setFilters] = useState({
    pickUpLocation:
      initialFilters.pickUpLocation || searchParams.get("pickUpLocation") || "",
    pickUpDate:
      initialFilters.pickUpDate || searchParams.get("pickUpDate") || "",
    dropOffDate:
      initialFilters.dropOffDate || searchParams.get("dropOffDate") || "",
    carType: initialFilters.carType || searchParams.get("carType") || "",
  });
  const navigate = useNavigate();

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    safeSetItem("bookingData", JSON.stringify(filters));
    navigate(`/book-ride/${filters.carType}?step=1`);
  };

  const handleClearFilters = () => {
    setFilters({
      pickUpLocation: "",
      pickUpDate: "",
      dropOffDate: "",
      carType: "",
    });
    safeRemoveItem("bookingData");
    const params = new URLSearchParams(searchParams);
    params.delete("pickUpLocation");
    params.delete("pickUpDate");
    params.delete("dropOffDate");
    params.delete("carType");
    setSearchParams(params);
  };

  return (
    <div className="relative z-10">
      <form
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[1.5fr_1fr_1fr_1.2fr_auto_auto] gap-6 items-end w-full"
        onSubmit={handleSubmit}
        id="filter"
      >
        <div className="space-y-2">
          <label className="text-SoftWhite text-sm font-medium flex gap-2 items-center">
            <MapPin size={16} /> Pickup Location
          </label>
          <Input
            type="text"
            value={filters.pickUpLocation}
            placeholder="eg. Lekki, Lagos"
            onChange={(e) =>
              handleFilterChange("pickUpLocation", e.target.value)
            }
            className="w-full bg-white/10 border-white/20 text-white placeholder:text-SoftWhite/60 h-11 focus:ring-DeepOrange/50 focus:border-DeepOrange"
          />
        </div>

        <div className="space-y-2">
          <label className="text-SoftWhite text-sm font-medium flex gap-2 items-center">
            <CalendarDays size={16} /> Pickup Date
          </label>
          <Input
            type="date"
            value={filters.pickUpDate}
            onChange={(e) => handleFilterChange("pickUpDate", e.target.value)}
            className="w-full bg-white/10 border-white/20 text-white h-11 focus:ring-DeepOrange/50 focus:border-DeepOrange scheme-dark"
          />
        </div>

        <div className="space-y-2">
          <label className="text-SoftWhite text-sm font-medium flex gap-2 items-center">
            <CalendarDays size={16} /> Return Date
          </label>
          <Input
            type="date"
            value={filters.dropOffDate}
            onChange={(e) => handleFilterChange("dropOffDate", e.target.value)}
            className="w-full bg-white/10 border-white/20 text-white h-11 focus:ring-DeepOrange/50 focus:border-DeepOrange scheme-dark"
          />
        </div>

        <div className="space-y-2">
          <label className="text-SoftWhite text-sm font-medium flex gap-2 items-center">
            <Car size={16} /> Car Type
          </label>
          <Select
            value={filters.carType}
            onValueChange={(value) => handleFilterChange("carType", value)}
          >
            <SelectTrigger className="w-full bg-white/10 border-white/20 text-white focus:ring-DeepOrange/50 focus:border-DeepOrange py-4">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {cars?.map((item) => (
                  <SelectItem
                    key={item._id}
                    value={item.slug}
                    className="capitalize"
                  >
                    {item.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex xl:flex-row gap-3 mt-2 md:mt-0 xl:mb-0.5">
          <Button
            onClick={handleClearFilters}
            variant="ghost"
            type="button"
            className="h-11 cursor-pointer text-SoftWhite hover:bg-white/5 hover:text-white transition-colors flex-1 xl:flex-none"
            disabled={
              !filters.pickUpLocation &&
              !filters.pickUpDate &&
              !filters.dropOffDate &&
              !filters.carType
            }
          >
            <Eraser size={18} />
            <span className="xl:hidden 2xl:inline">Clear</span>
          </Button>

          <Button
            type="submit"
            className="h-11 px-6 cursor-pointer bg-DeepOrange text-white hover:bg-DeepOrange/90 transition-all shadow-lg shadow-DeepOrange/20 font-semibold flex-1 xl:flex-none whitespace-nowrap rounded-full"
            disabled={
              !filters.pickUpLocation &&
              !filters.pickUpDate &&
              !filters.dropOffDate &&
              !filters.carType
            }
          >
            Find Car
            <div className="ml-2 p-1 bg-black/20 rounded-full">
              <ArrowUpRight size={16} />
            </div>
          </Button>
        </div>
      </form>
    </div>
  );
}
