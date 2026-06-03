import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader, Star, UserPlus, Search, X } from "lucide-react";
import { useFetcher, Form, useRevalidator } from "react-router";
import { useDebouncedCallback } from "use-debounce";
import { getAllDriversQuery } from "@/api/queries/drivers";
import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import { cn, formatDate, queryClient } from "@/lib/utils";
import type { DriverRCProps } from "@/types";
import { Separator } from "@/components/ui/separator";
import ActionButton from "@/components/ui/actionButton";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface AssignDriverProps {
  bookingId: string;
  plateNum?: string;
  carName?: string;
  pickUpDate?: string;
  returnDate?: string;
}

export default function AssignDriver({
  plateNum,
  carName,
  pickUpDate,
  returnDate,
  bookingId,
}: AssignDriverProps) {
  const [searchValue, setSearchValue] = useState<string>("");
  const { data, isLoading } = useQuery(
    getAllDriversQuery({ page: 1, limit: 10, query: searchValue }),
  );
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [driverId, setDriverId] = useState<string>("");
  const fetcher = useFetcher();
  const { revalidate } = useRevalidator();
  const { drivers } =
    (data?.data?.body as {
      drivers: DriverRCProps[];
    }) ?? {};
  const availableDrivers = drivers?.filter(
    (driver) => driver.status === "available",
  );
  const activeDrivers = drivers?.filter((driver) => driver.status === "active");

  const debouncedSubmit = useDebouncedCallback((value: string) => {
    setSearchValue(value);
  }, 500);

  useEffect(() => {
    if (!fetcher.data || fetcher.state !== "idle") return;
    const { status, data, body } = fetcher.data;
    if (status !== 200) {
      toast.error(body?.message || "Failed to assign driver");
      return;
    } else {
      Promise.all([
        queryClient.removeQueries({ queryKey: ["booking", bookingId] }),
        queryClient.removeQueries({ queryKey: ["drivers"] }),
      ]).then(() => {
        revalidate();
        const message = data?.message || "Driver assigned successfully";
        toast.success(message);
        setIsOpen(false);
      });
    }
  }, [fetcher.data, fetcher.state, revalidate, bookingId]);

  const handleAssign = async () => {
    fetcher.submit(
      { bookingId, driverId },
      {
        action: `/dashboard/bookings/${bookingId}`,
        method: "post",
        encType: "application/json",
      },
    );
  };

  return (
    <>
      <Button
        className="bg-gray-50 text-MainBlack hover:bg-white/90 border"
        onClick={() => setIsOpen(true)}
      >
        <UserPlus size={24} />
        <span>Assign Driver</span>
      </Button>
      <Modal isOpen={isOpen} setIsOpen={setIsOpen} classname="sm:max-w-xl">
        <div className="px-6 py-4 border-b border-gray-100 text-left">
          <h1 className="text-xl font-bold text-MainBlack">Assign Driver</h1>
          <p className="text-sm text-SoftBlack mt-1">
            For booking{" "}
            {plateNum && carName
              ? `${carName} (${plateNum} - ${formatDate(pickUpDate)} to ${formatDate(returnDate)})`
              : plateNum}
          </p>
        </div>
        <div className="px-6 py-4">
          <Form
            className="relative w-full bg-SoftWhite/60 py-1.5 px-3.5 rounded-full group border-gray-200  hover:border-DeepOrange transition-all duration-300 outline-none flex items-center ring-1 ring-DeepOrange/20"
            role="search"
          >
            {isLoading ? (
              <Loader className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
            ) : (
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            )}
            {searchValue && (
              <X
                className="absolute right-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground cursor-pointer"
                onClick={() => setSearchValue("")}
              />
            )}
            <Input
              placeholder="Search drivers..."
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
                debouncedSubmit(e.target.value);
              }}
              name="query"
              aria-label="Search"
              className="w-full pl-6 placeholder:text-[14px] border-transparent bg-inherit focus:ring-0 focus:border-none focus:outline-0 focus:ring-offset-0"
              type="search"
            />
          </Form>
          <h1 className="text-sm text-MainBlack mt-6 uppercase">
            Available Now ({availableDrivers?.length})
          </h1>
          <div
            className={cn(
              "mt-4",
              availableDrivers?.length > 0 && "h-50 overflow-y-auto",
            )}
          >
            {availableDrivers?.length === 0 && (
              <p className="mt-2 text-xs text-SoftBlack">
                No available drivers
              </p>
            )}
            {availableDrivers?.map((driver: DriverRCProps) => (
              <div
                key={driver._id}
                className={cn(
                  "mb-2 flex justify-between items-center hover:bg-SoftWhite px-4 py-2 rounded-xl cursor-pointer",
                  driver?._id === driverId && "bg-SoftWhite",
                )}
                onClick={() => setDriverId(driver._id)}
              >
                <div className="flex items-center gap-4">
                  <span className="w-10 h-10 rounded-full border-2 border-border hover:border-primary transition-colors flex items-center justify-center">
                    {driver?.fullname
                      ?.split(" ")
                      .map((name) => name[0])
                      .join("")
                      .toUpperCase()}
                  </span>

                  <div className="flex-1 ml-4">
                    <h2 className="text-sm font-bold text-MainBlack">
                      {driver?.fullname}
                    </h2>
                    <p className="text-xs text-SoftBlack">
                      {driver?.license.split("").slice(0, 4).join("")} -{" "}
                      {driver?.phone} - {driver?.trips} trips
                    </p>
                  </div>
                </div>
                <div className="flex gap-1 items-center">
                  <Star size={16} className="text-DeepOrange" />
                  <span>{driver?.rating}</span>
                </div>
              </div>
            ))}
          </div>
          <div
            className={cn(
              "mt-4",
              activeDrivers?.length > 0 && "h-50 overflow-y-auto",
            )}
          >
            <h1 className="text-sm text-MainBlack mt-6 uppercase">
              Currently active ({activeDrivers?.length})
            </h1>
            {activeDrivers?.length === 0 && (
              <p className="mt-2 text-xs text-SoftBlack">No active drivers</p>
            )}
            {activeDrivers?.map((driver: DriverRCProps) => (
              <div
                key={driver._id}
                className="mb-4 flex justify-between items-center"
              >
                <div className="flex items-center gap-4">
                  <span className="w-10 h-10 rounded-full border-2 border-border hover:border-primary transition-colors flex items-center justify-center">
                    {driver?.fullname
                      ?.split(" ")
                      .map((name) => name[0])
                      .join("")
                      .toUpperCase()}
                  </span>

                  <div className="flex-1 ml-4">
                    <h2 className="text-sm font-bold text-MainBlack">
                      {driver?.fullname}
                    </h2>
                    <p className="text-xs text-SoftBlack">
                      {driver?.license.split("").slice(0, 4).join("")} -{" "}
                      {driver?.phone} - {driver?.trips} trips
                    </p>
                  </div>
                </div>
                <div className="flex gap-1 items-center">
                  <Star size={16} className="text-DeepOrange" />
                  <span>{driver?.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Separator />
        <div className="flex justify-end items-center gap-4 p-4">
          <Button variant="ghost" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <ActionButton
            text="Assign Driver"
            classname="w-fit py-5 px-4 bg-DeepOrange text-white text-sm font-normal hover:bg-DeepOrange/90 transition-all rounded-full"
            onClick={handleAssign}
            loading={fetcher.state === "submitting"}
            children={<Loader className="animate-spin" />}
          />
        </div>
      </Modal>
    </>
  );
}
