import { whatsIncluded, type CarProduct } from "@/lib/constants";
import {
  ArrowUpRight,
  CalendarDays,
  ChevronLeft,
  Fuel,
  Loader,
  ShieldCogCorner,
  UsersRound,
  Workflow,
} from "lucide-react";
import {
  Link,
  useLoaderData,
  useFetcher,
  useNavigate,
  useParams,
  useRouteLoaderData,
} from "react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import LazyLoadImageRC from "@/components/ui/lazyLoadImage";
import { formatPrice } from "@/lib/utils";
import { useForm, useWatch, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { quickBookSchema, type quickBookSchemaType } from "@/lib/schemaTypes";
import { FormBox } from "@/components/ui/formBox";
import ActionButton from "@/components/ui/actionButton";
import { Separator } from "@/components/ui/separator";
import TrendingCars from "@/components/features/trendingCars";
import { safeSetItem } from "@/lib/storage";
import useCalcBookingCost from "@/hooks/useCalcBookingCost";
import { getRating } from "@/components/features/explore/rating";

export default function CarDetail() {
  const [isDriver, setIsDriver] = useState<boolean>(false);
  const { slug } = useParams();
  const { car } = useLoaderData() as {
    car: CarProduct;
  };
  const { cars } = useRouteLoaderData("cars") as {
    cars: { cars: CarProduct[] } | null;
  };
  const { cars: resolvedCars } = cars || {};
  const [selectedImage, setSelectedImage] = useState(0);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<quickBookSchemaType>({
    resolver: zodResolver(quickBookSchema),
    mode: "onBlur",
  });
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const isSubmitting = fetcher.state === "submitting";

  const media = car?.media || [];

  const pickUpDate = useWatch({ control, name: "pickUpDate" });
  const dropOffDate = useWatch({ control, name: "dropOffDate" });

  const SERVICE_FEE = 20000;

  const { days, rentalTotal, grandTotal } = useCalcBookingCost({
    pickUpDate,
    dropOffDate,
    car: car as CarProduct,
    SERVICE_FEE: car?.serviceFee || SERVICE_FEE,
  });

  const driverOptions = () => {
    setIsDriver((prev) => !prev);
    const serializedData = {
      addDriver: isDriver,
    };
    safeSetItem("bookingData", JSON.stringify(serializedData));
  };

  const onFormSubmit: SubmitHandler<quickBookSchemaType> = async (data) => {
    const serializedData = {
      ...data,
      car: {
        price: car?.price,
        image: car?.media[0]?.mediaUrl,
        serviceFee: car.serviceFee,
        carType: car?.type,
        name: car?.name,
      },
      pickUpDate: new Date(data.pickUpDate).toISOString(),
      dropOffDate: new Date(data.dropOffDate).toISOString(),
      addDriver: isDriver,
    };
    safeSetItem("bookingData", JSON.stringify(serializedData));
    navigate(`/book-ride/${slug}?step=1`);
  };

  return (
    <div className="container mx-auto py-24 px-4">
      <div className="mt-10">
        <Link to="/cars">
          <div className="flex gap-2 items-center">
            <ChevronLeft size={20} />
            <span className="text-SoftBlack text-lg">Back to fleet</span>
          </div>
        </Link>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <div className="space-y-4">
          <div className="relative aspect-16/10 rounded-2xl overflow-hidden bg-gray-100">
            {media[selectedImage] ? (
              <LazyLoadImageRC
                alt={car.name}
                src={media[selectedImage].mediaUrl}
                width="100%"
                height="100%"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No image available
              </div>
            )}
          </div>
          {media.length > 1 && (
            <div className="flex gap-2 overflow-x-auto p-2">
              {media.map((item, index) => (
                <button
                  key={item.publicId}
                  onClick={() => setSelectedImage(index)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden shrink-0 transition-all ${
                    selectedImage === index
                      ? "ring-2 ring-DeepOrange"
                      : "ring-1 ring-gray-200 hover:ring-gray-300"
                  }`}
                >
                  <LazyLoadImageRC
                    src={item.mediaUrl}
                    alt={`${car.name} - ${index + 1}`}
                    width="100%"
                    height="100%"
                    className="w-full h-full object-cover text-sm"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="space-y-6">
          <div>
            <span className="inline-block px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700 uppercase">
              {car.category}
            </span>
            <h1 className="mt-3 text-[20px] font-medium text-DeepOrange">
              {car.brand}
            </h1>
            <h1 className="mt-2 text-3xl md:text-4xl font-semibold text-MainBlack">
              {car.name}
            </h1>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1">
                {getRating(car.rating || 0)}
                <span className="ml-1 text-sm font-medium text-gray-600">
                  {car.rating || 0}
                </span>
              </div>
              <span className="text-gray-300">|</span>
              <div className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">
                  {car.trips || 0}
                </span>{" "}
                trips
              </div>
            </div>
            <p className="mt-4 text-sm text-SoftBlack">{car.summary}</p>
            <p className="mt-2 text-2xl xl:text-[70px] font-semibold text-MainBlack">
              {formatPrice(car.price)}
              <span className="text-SoftBlack text-base font-normal">/day</span>
            </p>
          </div>
          <div className="flex gap-6">
            <Link to={`/book-ride/${car.slug}?step=1`}>
              <Button className="rounded-full bg-DeepOrange hover:bg-DeepOrange/90 text-white py-6 px-4 transition-colors">
                Book this car{" "}
                <ArrowUpRight className="ml-2 flex p-1.5 bg-black/20 rounded-full size-7" />
              </Button>
            </Link>
            <Button
              variant="outline"
              className="w-33.75 py-6 px-4 border-MainBlack/30 bg-gray-50 hover:bg-SoftWhite/90 text-MainBlack font-medium rounded-full transition-colors"
              onClick={driverOptions}
            >
              {isDriver ? "Remove driver" : "Add a driver"}
            </Button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-20">
        <div className="space-y-8 lg:col-span-7">
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-MainBlack">At a glance</h1>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 uppercase">
              <div className="bg-white border rounded-xl p-4">
                <UsersRound className="text-DeepOrange mb-2" />
                <p className="text-base text-gray-500">Seats</p>
                <p className="text-lg font-semibold text-gray-900">
                  {car.info?.seats}{" "}
                </p>{" "}
              </div>
              <div className="bg-white border rounded-xl p-4">
                <Workflow className="text-DeepOrange mb-2" />
                <p className="text-base text-gray-500">Trans</p>
                <p className="text-lg font-semibold text-gray-900">
                  {car.info?.transmission}{" "}
                </p>{" "}
              </div>
              <div className="bg-white border rounded-xl p-4">
                <Fuel className="text-DeepOrange mb-2" />
                <p className="text-base text-gray-500">Fuel</p>
                <p className="text-lg font-semibold text-gray-900">
                  {car.info?.fuel}{" "}
                </p>{" "}
              </div>
              <div className="bg-white border rounded-xl p-4">
                <CalendarDays className="text-DeepOrange mb-2" />
                <p className="text-base text-gray-500">Year</p>
                <p className="text-lg font-semibold text-gray-900">
                  {car.info?.year}{" "}
                </p>{" "}
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-MainBlack">
              Specifications
            </h1>
            <div className="rounded-xl grid grid-cols-1 md:grid-cols-2 gap-6 bg-DeepBlue text-SoftWhite text-sm lg:text-base p-6">
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-SoftWhite/30">
                  <span className="font-light">Engine</span>
                  <span>{car.specs?.engine}</span>
                </div>
                <div className="flex justify-between items-center border-b border-SoftWhite/30">
                  <span className="font-light">Mileage</span>
                  <span>{car.specs?.mileage}</span>
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-SoftWhite/30">
                  <span className="font-light">Top Speed</span>
                  <span>{car.specs?.topSpeed}</span>
                </div>
                <div className="flex justify-between items-center border-b border-SoftWhite/30">
                  <span className="font-light">Boot</span>
                  <span>{car.specs?.boot}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white border rounded-xl p-4 lg:col-span-5 space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">{formatPrice(car.price)}</h1>
            <p className="text-base text-gray-500">per day</p>
          </div>
          <fetcher.Form onSubmit={handleSubmit(onFormSubmit)}>
            <div className="space-y-4">
              <FormBox
                label="PICKUP LOCATION"
                type="text"
                placeholder="e.g Lekki, Lagos"
                id="pickUpLocation"
                register={register}
                errors={errors?.pickUpLocation}
                name="pickUpLocation"
                classname="p-3 rounded-xl bg-SoftWhite"
                showLabel={false}
              />
              <div className="flex justify-between gap-4">
                <FormBox
                  label="PICKUP DATE"
                  type="date"
                  id="pickUpDate"
                  register={register}
                  errors={errors?.pickUpDate}
                  name="pickUpDate"
                  classname="w-full p-3 rounded-xl bg-SoftWhite"
                  showLabel={false}
                  // registerOptions={{ valueAsDate: true }}
                />
                <FormBox
                  label="RETURN DATE"
                  type="date"
                  id="dropOffDate"
                  register={register}
                  errors={errors?.dropOffDate}
                  name="dropOffDate"
                  classname="w-full p-3 rounded-xl bg-SoftWhite"
                  showLabel={false}
                  // registerOptions={{ valueAsDate: true }}
                />
              </div>
              <Separator />
              <div className="flex justify-between items-center py-2">
                <div>
                  <p className="text-sm text-gray-500">Rental Duration</p>
                  <p className="text-lg font-semibold text-MainBlack">
                    {days} {days === 1 ? "day" : "days"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Total Cost</p>
                  <p className="text-sn font-medium text-DeepOrange">
                    {formatPrice(rentalTotal)}
                  </p>
                </div>
              </div>
              <div className="flex justify-between items-center py-2">
                <p className="text-sm text-gray-500">Service fee</p>
                <p className="text-sm font-medium text-SoftBlack">
                  {formatPrice(car?.serviceFee)}
                </p>
              </div>
              <Separator />
              <div className="flex justify-between items-center py-2">
                <p className="text-base text-MainBlack">Total</p>
                <p className="text-lg font-medium text-MainBlack">
                  {formatPrice(grandTotal)}
                </p>
              </div>
              <ActionButton
                text={
                  <>
                    Book Now{" "}
                    <div className="ml-2 p-1 bg-black/20 rounded-full">
                      <ArrowUpRight size={16} />
                    </div>
                  </>
                }
                type="submit"
                loading={isSubmitting}
                children={<Loader className="animate-spin" />}
                classname="rounded-full w-full py-6 px-4 bg-DeepOrange hover:bg-DeepOrange/90 text-white text-sm font-medium"
              />
              <div className="flex justify-center items-center gap-2 text-SoftBlack">
                <ShieldCogCorner size={18} />
                <p className="text-sm">Free cancellation up to 24h</p>
              </div>
            </div>
          </fetcher.Form>
        </div>
      </div>
      <div className="mt-20 space-y-6">
        <h1 className="text-3xl font-bold text-MainBlack">Whats included</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {whatsIncluded.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-2 p-4 bg-SoftWhite rounded-xl"
            >
              <img src={item.icon} alt={item.text} className="size-6" />
              <p className="text-sm text-MainBlack">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-20">
        <TrendingCars cars={resolvedCars || []} />
      </div>
    </div>
  );
}
