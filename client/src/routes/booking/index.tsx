import { safeGetItem, safeSetItem } from "@/lib/storage";
import { ChevronLeft, Check, ArrowUpRight } from "lucide-react";
import {
  Link,
  useLocation,
  useParams,
  useNavigate,
  Outlet,
  useSearchParams,
  useRouteLoaderData,
  useOutletContext,
  useFetcher,
} from "react-router";
import { bookingSteps, type CarProduct } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useForm, useWatch, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  bookingSchema,
  type bookingSchemaType,
  type UserSession,
} from "@/lib/schemaTypes";
import { FormBox } from "@/components/ui/formBox";
import ActionButton from "@/components/ui/actionButton";
import useCalcBookingCost from "@/hooks/useCalcBookingCost";
import Summary from "@/components/features/booking/summary";

export default function BookRide() {
  const { car } = useRouteLoaderData("car") as {
    car: CarProduct;
  };
  const { user } = useOutletContext() as { user: UserSession };
  const [searchParams] = useSearchParams();
  const { slug } = useParams();
  const location = useLocation();
  const savedBooking = JSON.parse(safeGetItem("bookingData") || "null");
  const step = searchParams.get("step");
  const {
    register,
    handleSubmit,
    control,
    getValues,
    formState: { errors },
  } = useForm<bookingSchemaType>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      pickUpLocation: savedBooking?.pickUpLocation || "",
      dropOffLocation: savedBooking?.dropOffLocation || "",
      pickUpDate: savedBooking?.pickUpDate
        ? new Date(savedBooking.pickUpDate).toISOString().split("T")[0]
        : "",
      dropOffDate: savedBooking?.dropOffDate
        ? new Date(savedBooking.dropOffDate).toISOString().split("T")[0]
        : "",
      pickUpTime: savedBooking?.pickUpTime || "",
      dropOffTime: savedBooking?.dropOffTime || "",
      addDriver: savedBooking?.addDriver || false,
      carId: car?._id || "",
    },
    mode: "onChange",
  });
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const path = location.pathname === `/book-ride/${slug}`;

  const activeStepIndex = bookingSteps.findIndex(
    (item) => item.id.toString() === step,
  );

  const pickUpDate = useWatch({ control, name: "pickUpDate" });
  const dropOffDate = useWatch({ control, name: "dropOffDate" });
  const addDriver = useWatch({ control, name: "addDriver" });

  const { days, rentalTotal, grandTotal } = useCalcBookingCost({
    pickUpDate,
    dropOffDate,
    car: car,
    SERVICE_FEE: car?.serviceFee,
    addDriver,
  });

  const bookingPage = `/book-ride/${slug}`;
  const paymentPage = `/book-ride/${slug}/payment`;
  const confirmationPage = `/book-ride/${slug}/confirmation`;

  // useEffect(() => {
  //   setValue("rentalDays", days);
  //   setValue("rentalTotal", rentalTotal);
  //   setValue("grandTotal", grandTotal);
  // }, [days, rentalTotal, grandTotal, setValue]);

  const onFormSubmit: SubmitHandler<bookingSchemaType> = async (data) => {
    const serializedData = {
      ...data,
      pickUpDate: new Date(data.pickUpDate).toISOString(),
      dropOffDate: new Date(data.dropOffDate).toISOString(),
    };
    safeSetItem("bookingData", JSON.stringify(serializedData));
    navigate(`/book-ride/${slug}/payment?step=2`);
  };

  return (
    <>
      <div className="container mx-auto py-24 px-4">
        {step === "3" && (
          <div className="max-w-md mx-auto py-10 flex flex-col items-center space-y-2 text-center">
            <div className="bg-DeepOrange text-white flex items-center justify-center size-14 rounded-full">
              <Check size={32} />
            </div>
            <h1 className="text-DeepOrange">BOOKING CONFIRMED</h1>
            <h1 className="text-MainBlack text-2xl md:text-4xl font-bold">
              You’re all set, {user?.fullname || "user"}!
            </h1>
            <p className="text-sm text-SoftBlack">
              We’ve sent a confirmation to {user?.email}. <br />
              Show this reference at pickup.
            </p>
          </div>
        )}

        {location.pathname !== confirmationPage && (
          <>
            <div className="mt-10 mb-5">
              <Link to="/cars">
                <div className="flex gap-2 items-center">
                  <ChevronLeft size={20} />
                  <span className="text-SoftBlack text-lg">Back to fleet</span>
                </div>
              </Link>
            </div>
            <h1 className="text-2xl md:text-4xl font-semibold text-MainBlack px-1">
              {step === "2" ? "Secure payment" : "Book your trip"}
            </h1>
          </>
        )}

        <nav className="mt-8">
          <ol className="flex items-center max-w-4xl mx-auto">
            {bookingSteps.map((step, index) => {
              const isCompleted = index < activeStepIndex;
              const isActive = index === activeStepIndex;
              const isLast = index === bookingSteps.length - 1;

              return (
                <li
                  key={step.id}
                  className={cn("flex items-center", !isLast && "flex-1")}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "flex items-center justify-center size-7 rounded-full text-sm font-medium transition-colors",
                        isCompleted && "bg-DeepOrange text-white",
                        isActive &&
                        "bg-DeepOrange text-white ring-2 ring-DeepOrange/30",
                        !isCompleted &&
                        !isActive &&
                        "bg-gray-200 text-gray-500",
                      )}
                    >
                      {isCompleted ? <Check className="size-3" /> : step.id}
                    </div>
                    <span
                      className={cn(
                        "text-xs font-medium whitespace-nowrap truncate",
                        isActive && "text-DeepOrange",
                        isCompleted && "text-DeepOrange",
                        !isCompleted && !isActive && "text-gray-400",
                      )}
                    >
                      {step.label}
                    </span>
                  </div>
                  {!isLast && (
                    <div
                      className={cn(
                        "flex-1 h-0.5 mx-3",
                        index < activeStepIndex
                          ? "bg-DeepOrange"
                          : "bg-gray-200",
                      )}
                    />
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-12 gap-4">
          {path ? (
            <div className="bg-white rounded-xl p-4 md:col-span-7 space-y-4 h-fit">
              <h1 className="text-2xl font-semibold">Book Details</h1>
              <form
                onSubmit={handleSubmit(onFormSubmit)}
                id={`/book-ride/${slug}`}
              >
                <div className="space-y-4">
                  {/* hidden required fields autoset */}
                  <FormBox
                    label="Car"
                    type="hidden"
                    defaultValue={car?._id}
                    id="carId"
                    register={register}
                    errors={errors?.carId}
                    name="carId"
                    classname="hidden"
                  />
                  {/* <FormBox
                    label="Service Fee"
                    type="hidden"
                    defaultValue={car?.serviceFee}
                    id="serviceFee"
                    register={register}
                    errors={errors?.serviceFee}
                    name="serviceFee"
                    classname="hidden"
                  />
                  <FormBox
                    label="Rental Days"
                    type="hidden"
                    defaultValue={days}
                    id="rentalDays"
                    register={register}
                    errors={errors?.rentalDays}
                    name="rentalDays"
                    classname="hidden"
                  />
                  <FormBox
                    label="Rental Total"
                    type="hidden"
                    defaultValue={rentalTotal}
                    id="rentalTotal"
                    register={register}
                    errors={errors?.rentalTotal}
                    name="rentalTotal"
                    classname="hidden"
                  />
                  <FormBox
                    label="Grand Total"
                    type="hidden"
                    defaultValue={grandTotal}
                    id="grandTotal"
                    register={register}
                    errors={errors?.grandTotal}
                    name="grandTotal"
                    classname="hidden"
                  /> */}
                  {/* client inputed fields */}
                  <FormBox
                    label="Pickup location"
                    type="text"
                    placeholder="e.g Lekki, Lagos"
                    id="pickUpLocation"
                    register={register}
                    errors={errors?.pickUpLocation}
                    name="pickUpLocation"
                    classname="rounded-xl"
                    defaultValue={savedBooking?.pickUpLocation}
                  />
                  <FormBox
                    label="Return location"
                    type="text"
                    placeholder="e.g Lekki, Lagos"
                    id="dropOffLocation"
                    register={register}
                    errors={errors?.dropOffLocation}
                    name="dropOffLocation"
                    classname="rounded-xl"
                    defaultValue={savedBooking?.dropOffLocation}
                  />
                  <div className="flex justify-between gap-4">
                    <FormBox
                      label="Pickup date"
                      type="date"
                      id="pickUpDate"
                      register={register}
                      errors={errors?.pickUpDate}
                      name="pickUpDate"
                      classname="rounded-xl w-full"
                      defaultValue={
                        savedBooking?.pickUpDate
                          ? new Date(savedBooking.pickUpDate)
                            .toISOString()
                            .split("T")[0]
                          : ""
                      }
                    />
                    <FormBox
                      label="Pickup time"
                      type="time"
                      id="pickUpTime"
                      register={register}
                      errors={errors?.pickUpTime}
                      name="pickUpTime"
                      classname="rounded-xl w-full"
                      defaultValue={savedBooking?.pickUpTime}
                    />
                  </div>
                  <div className="flex justify-between gap-4">
                    <FormBox
                      label="Dropoff date"
                      type="date"
                      id="dropOffDate"
                      register={register}
                      errors={errors?.dropOffDate}
                      name="dropOffDate"
                      classname="rounded-xl w-full"
                      defaultValue={
                        savedBooking?.dropOffDate
                          ? new Date(savedBooking.dropOffDate)
                            .toISOString()
                            .split("T")[0]
                          : ""
                      }
                    />
                    <FormBox
                      label="Dropoff time"
                      type="time"
                      id="dropOffTime"
                      register={register}
                      errors={errors?.dropOffTime}
                      name="dropOffTime"
                      classname="rounded-xl w-full"
                      defaultValue={savedBooking?.dropOffTime}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <h1 className="text-MainBlack font-medium">
                        Add a driver
                      </h1>
                      <p className="text-SoftBlack text-sm font-light">
                        + 10000/day vetted, English-speaking
                      </p>
                    </div>
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
                  <div className="pt-4 hidden md:flex justify-end">
                    <ActionButton
                      text={
                        <>
                          Continue{" "}
                          <div className="ml-2 p-1 bg-black/20 rounded-full">
                            <ArrowUpRight size={16} />
                          </div>
                        </>
                      }
                      classname="w-fit py-5.5 px-4 bg-DeepOrange text-white text-sm md:text-base font-normal hover:bg-DeepOrange/90 transition-all rounded-full"
                      type="submit"
                    />
                  </div>
                </div>
              </form>
            </div>
          ) : (
            <Outlet context={{ car, days, savedBooking }} />
          )}
          <Summary
            car={car}
            getValues={getValues}
            pickUpDate={pickUpDate}
            dropOffDate={dropOffDate}
            days={days}
            rentalTotal={rentalTotal}
            grandTotal={grandTotal}
          />
        </div>
        {location.pathname !== confirmationPage && (
          <div
            className={cn(
              "mt-10 md:hidden flex items-center",
              location.pathname === bookingPage
                ? "justify-end"
                : "justify-between",
            )}
          >
            {location.pathname !== bookingPage && (
              <ActionButton
                text="Back"
                classname="w-fit py-5 px-4 bg-white border-gray-500 text-MainBlack text-sm md:text-base font-normal hover:bg-SoftWhite/90 transition-all rounded-full"
                onClick={() => navigate(-1)}
                type="button"
              />
            )}
            <ActionButton
              text={
                <>
                  {location.pathname === bookingPage
                    ? "Continue"
                    : location.pathname === paymentPage
                      ? "Continue to payment"
                      : "Pay with Paystack"}{" "}
                  <div className="ml-2 p-1 bg-black/20 rounded-full">
                    <ArrowUpRight size={16} />
                  </div>
                </>
              }
              classname="w-fit py-5.5 px-4 bg-DeepOrange text-white text-sm md:text-base font-normal hover:bg-DeepOrange/90 transition-all rounded-full"
              type="submit"
              loading={fetcher.state === "submitting"}
              form={location.pathname}
            />
          </div>
        )}
      </div>
    </>
  );
}
