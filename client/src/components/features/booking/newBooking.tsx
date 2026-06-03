import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import { cn, formatPrice } from "@/lib/utils";
import { Plus, Check, Loader } from "lucide-react";
import { useEffect, useState } from "react";
import {
  useForm,
  useWatch,
  type SubmitHandler,
  Controller,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  adminNewBookingSchema,
  type adminNewBookingSchemaType,
} from "@/lib/schemaTypes";
import { FormBox } from "@/components/ui/formBox";
import useCalcBookingCost from "@/hooks/useCalcBookingCost";
import { useSuspenseQuery } from "@tanstack/react-query";
import type { CarProduct } from "@/lib/constants";
import { getTrendingCarsQuery } from "@/api/queries/cars";
import { useFetcher, useRevalidator } from "react-router";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import ActionButton from "@/components/ui/actionButton";
import { queryClient } from "@/lib/utils";

export default function NewBooking() {
  const { data: carData } = useSuspenseQuery(
    getTrendingCarsQuery({ limit: 3 }),
  );
  const { cars } =
    carData?.data?.body ||
    ({} as {
      cars: CarProduct[];
    });
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const fetcher = useFetcher();
  const { revalidate } = useRevalidator();
  const {
    register,
    handleSubmit,
    control,
    getValues,
    setValue,
    reset,
    formState: { errors },
  } = useForm<adminNewBookingSchemaType>({
    resolver: zodResolver(adminNewBookingSchema) as never,
    defaultValues: {
      fullname: "",
      phone: "",
      email: "",
      paymentMethod: "pay_with_bank",
      carId: "",
      pickUpLocation: "",
      dropOffLocation: "",
      pickUpDate: "",
      dropOffDate: "",
      pickUpTime: "09:00",
      dropOffTime: "17:00",
      addDriver: false,
    },
    mode: "onChange",
  });

  const pickUpDate = useWatch({ control, name: "pickUpDate" });
  const dropOffDate = useWatch({ control, name: "dropOffDate" });
  const addDriver = useWatch({ control, name: "addDriver" });
  const carId = useWatch({ control, name: "carId" });
  const car = cars.find((car: CarProduct) => car._id === carId);
  const { days, rentalTotal, grandTotal, driverTotal } = useCalcBookingCost({
    pickUpDate,
    dropOffDate,
    car: car,
    SERVICE_FEE: car?.serviceFee,
    addDriver,
  });

  useEffect(() => {
    if (car) {
      setValue("carId", car?._id || "");
    }
  }, [carId, days, rentalTotal, grandTotal, setValue, car]);

  const stepData = [
    { id: 1, title: "Customer details" },
    { id: 2, title: "Pickup details" },
    { id: 3, title: "Confirmation" },
  ];

  const handleNextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handlePreviousStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  useEffect(() => {
    const values = getValues();
    if (currentStep === 2) {
      if (!values.fullname || !values.phone || !values.email) {
        toast.error("Please fill in all customer details in step 1");
      }
    } else if (currentStep === 3) {
      if (
        !values.pickUpDate ||
        !values.dropOffDate ||
        !values.pickUpTime ||
        !values.dropOffTime
      ) {
        toast.error("Please fill in all pickup details in step 2");
      }
    }
  }, [pickUpDate, dropOffDate, currentStep, getValues]);

  useEffect(() => {
    if (!fetcher.data || fetcher.state !== "idle") return;
    const { status, data, body } = fetcher.data;
    if (status !== 201) {
      toast.error(body?.message || "Failed to create booking");
      return;
    } else {
      Promise.all([
        queryClient.removeQueries({ queryKey: ["allBookings"] }),
        queryClient.removeQueries({ queryKey: ["trendingCars"] }),
      ]).then(() => {
        revalidate();
        reset();
        setCurrentStep(1);
        const message = data?.message || "Booking created successfully";
        toast.success(message);
        setIsOpen(false);
      });
    }
  }, [fetcher.data, fetcher.state, reset, revalidate]);

  const onSubmit: SubmitHandler<adminNewBookingSchemaType> = (data) => {
    fetcher.submit(data, {
      method: "post",
      action: "/dashboard/bookings",
    });
  };

  return (
    <>
      <Button
        className="bg-DeepOrange text-white rounded-full p-4 hover:bg-DeepOrange/90"
        size="lg"
        onClick={() => setIsOpen(true)}
      >
        <Plus className="mr-2" /> New Booking
      </Button>
      <Modal isOpen={isOpen} setIsOpen={setIsOpen} classname="sm:max-w-2xl">
        <div className="px-6 py-4 border-b border-gray-100 text-left">
          <h1 className="text-xl font-bold text-MainBlack">New Booking</h1>
          <p className="text-sm text-SoftBlack mt-1">
            Create a reservation on behalf of a customer
          </p>
        </div>

        {/* Horizontal Stepper */}
        <div className="px-6 py-4 bg-gray-50/50">
          <div className="w-full flex items-center justify-between">
            {stepData.map((step, index) => {
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              return (
                <div
                  key={step.id}
                  className="flex flex-col md:flex-row items-center w-full last:w-auto"
                >
                  <div className="flex flex-col md:flex-row items-center gap-2 relative z-10 shrink-0">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 shrink-0",
                        isActive || isCompleted
                          ? "bg-DeepOrange text-white shadow-md shadow-DeepOrange/20"
                          : "bg-gray-200 text-gray-500",
                      )}
                    >
                      {isCompleted ? (
                        <Check size={16} strokeWidth={3} />
                      ) : (
                        step.id
                      )}
                    </div>
                    <span
                      className={cn(
                        "text-xs font-medium whitespace-nowrap transition-colors duration-300",
                        isActive
                          ? "text-DeepOrange font-bold"
                          : isCompleted
                            ? "text-MainBlack"
                            : "text-gray-400",
                      )}
                    >
                      {step.title}
                    </span>
                  </div>

                  {index < stepData.length - 1 && (
                    <div
                      className={cn(
                        "flex-1 h-0.5 mx-4 transition-all duration-300 rounded-full",
                        isCompleted ? "bg-DeepOrange" : "bg-gray-200",
                      )}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="px-6 py-4 max-h-80 sm:max-h-[60vh] overflow-y-auto">
          <fetcher.Form onSubmit={handleSubmit(onSubmit)} id="adminBookingForm">
            {currentStep === 1 && (
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-6">
                  <FormBox
                    label="Customer name"
                    type="text"
                    placeholder="Enter customer full name"
                    id="fullname"
                    register={register}
                    errors={errors?.fullname}
                    name="fullname"
                    classname="rounded-xl"
                  />
                </div>
                <div className="col-span-12 md:col-span-6">
                  <FormBox
                    label="Phone Number"
                    type="tel"
                    placeholder="+2348000000000"
                    id="phone"
                    register={register}
                    errors={errors?.phone}
                    name="phone"
                    classname="rounded-xl"
                  />
                </div>
                <div className="col-span-12">
                  <FormBox
                    label="Email Address"
                    type="email"
                    placeholder="Enter customer email address"
                    id="email"
                    register={register}
                    errors={errors?.email}
                    name="email"
                    classname="rounded-xl"
                  />
                </div>
                <div className="col-span-12">
                  <label className="text-sm text-SoftBlack font-medium">
                    Vehicle
                  </label>
                  <Controller
                    control={control}
                    name="carId"
                    rules={{ required: "Vehicle is required" }}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                      >
                        <SelectTrigger className="mt-2 w-full border-gray-100 focus:ring-DeepOrange/50 focus:border-DeepOrange py-5">
                          <SelectValue placeholder="Select Vehicle" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {cars?.length === 0 ? (
                              <p className="text-xs mx-2">
                                No vehicles available
                              </p>
                            ) : (
                              <div>
                                {cars?.map((item: CarProduct) => (
                                  <SelectItem
                                    key={item._id}
                                    value={item._id}
                                    className="capitalize"
                                  >
                                    {item.name}
                                  </SelectItem>
                                ))}
                              </div>
                            )}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors?.carId && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors?.carId?.message as string}
                    </p>
                  )}
                </div>
              </div>
            )}
            {/* step2 */}
            {currentStep === 2 && (
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-6">
                  <FormBox
                    label="Pickup Location"
                    type="text"
                    placeholder="Enter pickup location"
                    id="pickUpLocation"
                    register={register}
                    errors={errors?.pickUpLocation}
                    name="pickUpLocation"
                    classname="rounded-xl"
                  />
                </div>
                <div className="col-span-12 md:col-span-6">
                  <FormBox
                    label="Return location"
                    type="text"
                    placeholder="e.g Lekki, Lagos"
                    id="dropOffLocation"
                    register={register}
                    errors={errors?.dropOffLocation}
                    name="dropOffLocation"
                    classname="rounded-xl"
                  />
                </div>
                <div className="col-span-12 md:col-span-6">
                  <FormBox
                    label="Pickup date"
                    type="date"
                    id="pickUpDate"
                    register={register}
                    errors={errors?.pickUpDate}
                    name="pickUpDate"
                    classname="rounded-xl w-full"
                  />
                </div>
                <div className="col-span-12 md:col-span-6">
                  <FormBox
                    label="Dropoff date"
                    type="date"
                    id="dropOffDate"
                    register={register}
                    errors={errors?.dropOffDate}
                    name="dropOffDate"
                    classname="rounded-xl w-full"
                  />
                </div>
                <div className="col-span-6">
                  <h1 className="text-sm text-SoftBlack font-medium">
                    Add a professional driver
                  </h1>
                </div>
                <div className="col-span-6 flex items-center justify-end">
                  <FormBox
                    label=""
                    type="checkbox"
                    id="addDriver"
                    register={register}
                    errors={errors?.addDriver}
                    name="addDriver"
                    classname="bg-none"
                    showLabel={false}
                    inputType="switch"
                    control={control}
                  />
                </div>
                <div className="col-span-12">
                  <div className="col-span-12">
                    <label className="text-sm text-SoftBlack font-medium">
                      Payment
                    </label>
                    <Controller
                      control={control}
                      name="paymentMethod"
                      rules={{ required: "Payment method is required" }}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value || ""}
                        >
                          <SelectTrigger className="mt-2 w-full border-gray-100 focus:ring-DeepOrange/50 focus:border-DeepOrange py-5">
                            <SelectValue placeholder="Select Payment Method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem
                                value="pay_with_bank"
                                className="capitalize"
                              >
                                Pay with Bank
                              </SelectItem>
                              <SelectItem
                                value="paystack"
                                className="capitalize"
                              >
                                Pay with Paystack
                              </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors?.paymentMethod && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors?.paymentMethod?.message as string}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="space-y-1">
                  <h1 className="font-semibold uppercase text-md text-MainBlack">
                    Customer
                  </h1>
                  <div className="bg-SoftWhite rounded-xl p-6 text-sm space-y-3">
                    <div className="flex justify-between items-center">
                      <p className="capitalize text-SoftBlack">Name</p>
                      <p className="text-MainBlack">{getValues("fullname")}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="capitalize text-SoftBlack">Email Address</p>
                      <p className="text-MainBlack">{getValues("email")}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="capitalize text-SoftBlack">Phone Number</p>
                      <p className="text-MainBlack">{getValues("phone")}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <h1 className="font-semibold uppercase text-md text-MainBlack">
                    Vehicle
                  </h1>
                  <div className="bg-SoftWhite rounded-xl p-6 text-sm space-y-3">
                    <div className="flex justify-between items-center">
                      <p className="capitalize text-SoftBlack">Vehicle</p>
                      <p className="text-MainBlack">
                        {car?.name}-{car?.plateNum}
                      </p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="capitalize text-SoftBlack">
                        Pickup Location
                      </p>
                      <p className="text-MainBlack">
                        {getValues("pickUpLocation")}
                      </p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="capitalize text-SoftBlack">
                        Dropoff Location
                      </p>
                      <p className="text-MainBlack">
                        {getValues("dropOffLocation")}
                      </p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="capitalize text-SoftBlack">Dates</p>
                      <p className="text-MainBlack">
                        {getValues("pickUpDate")} - {getValues("dropOffDate")} (
                        {days}d)
                      </p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="capitalize text-SoftBlack">Driver</p>
                      <p className="text-MainBlack">
                        {getValues("addDriver") ? "With Driver" : "No Driver"}
                      </p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="capitalize text-SoftBlack">
                        Payment Method
                      </p>
                      <p className="text-MainBlack">
                        {getValues("paymentMethod")}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <h1 className="font-semibold uppercase text-md text-MainBlack">
                    Price breakdown
                  </h1>
                  <div className="bg-SoftWhite rounded-xl p-6 text-sm space-y-3">
                    <div className="flex justify-between items-center">
                      <p className="capitalize text-SoftBlack">
                        {days} * {formatPrice(car?.price)}
                      </p>
                      <p className="text-MainBlack">
                        {formatPrice(rentalTotal)}
                      </p>
                    </div>
                    {getValues("addDriver") && (
                      <div className="flex justify-between items-center">
                        <p className="capitalize text-SoftBlack">
                          Driver Fee ({days} * ₦10,000)
                        </p>
                        <p className="text-MainBlack">
                          {formatPrice(driverTotal)}
                        </p>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <p className="capitalize text-SoftBlack">Service Fee</p>
                      <p className="text-MainBlack">
                        {formatPrice(car?.serviceFee)}
                      </p>
                    </div>
                    <div className="flex justify-between items-center border-t border-gray-100 pt-4">
                      <p className="capitalize font-semibold text-DeepBlue">
                        Total
                      </p>
                      <p className="text-MainBlack font-semibold">
                        {formatPrice(grandTotal)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </fetcher.Form>
        </div>

        {/* Action Buttons */}
        <div className="p-4 border-t border-gray-100 flex justify-between bg-white rounded-b-xl">
          <Button
            variant="outline"
            onClick={handlePreviousStep}
            disabled={currentStep === 1}
            className="h-12 w-37.5 rounded-full"
          >
            Previous
          </Button>
          {currentStep === 3 ? (
            <ActionButton
              text="Create Booking"
              classname="w-fit py-5.5 px-4 bg-DeepOrange text-white text-sm font-normal hover:bg-DeepOrange/90 transition-all rounded-full"
              type="submit"
              form="adminBookingForm"
              loading={fetcher.state === "submitting"}
              children={<Loader className="animate-spin" />}
            />
          ) : (
            <Button
              className="bg-DeepOrange text-white hover:bg-DeepOrange/90 h-12 w-37.5 rounded-full"
              onClick={handleNextStep}
              disabled={currentStep === stepData.length}
            >
              {currentStep === stepData.length
                ? "Confirm Booking"
                : "Next Step"}
            </Button>
          )}
        </div>
      </Modal>
    </>
  );
}
