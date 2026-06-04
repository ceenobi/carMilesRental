import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { driverSchema, type driverSchemaType } from "@/lib/schemaTypes";
import { FormBox } from "@/components/ui/formBox";
import ActionButton from "@/components/ui/actionButton";
import { useParams, useNavigate } from "react-router";
import { ArrowUpRight } from "lucide-react";
import { safeGetItem, safeSetItem } from "@/lib/storage";

export default function Driver() {
  const { slug } = useParams();
  const driverData = JSON.parse(safeGetItem("driverDetail") || "null");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<driverSchemaType>({
    resolver: zodResolver(driverSchema),
    defaultValues: {
      fullname: driverData?.fullname || "",
      email: driverData?.email || "",
      phone: driverData?.phone || "",
      license: driverData?.license || "",
      licenseExpiryDate: driverData?.licenseExpiryDate || "",
      language: driverData?.language || [],
      status: driverData?.status || "available",
      baseCity: driverData?.baseCity || "",
      yearsOfExperience: driverData?.yearsOfExperience || "",
      isVerified: driverData?.isVerified ?? false,
    } as driverSchemaType,
  });
  const navigate = useNavigate();

  const onFormSubmit: SubmitHandler<driverSchemaType> = async (data) => {
    const serializedData = {
      ...data,
    };
    safeSetItem("driverDetail", JSON.stringify(serializedData));
    navigate(`/book-ride/${slug}/payment?step=3`);
  };

  return (
    <div className="bg-white rounded-xl p-4 md:col-span-7 space-y-4 h-fit">
      <h1 className="text-2xl font-semibold">Who's driving?</h1>
      <form
        onSubmit={handleSubmit(onFormSubmit)}
        id={`/book-ride/${slug}/driver`}
      >
        <div className="space-y-4">
          <FormBox
            label="Fullname"
            type="text"
            placeholder="Driver's name"
            id="fullname"
            register={register}
            errors={errors}
            name="fullname"
            classname="rounded-xl"
          />
          <div className="flex justify-between gap-4">
            <FormBox
              label="Email"
              type="email"
              id="email"
              placeholder="email@example.com"
              register={register}
              errors={errors}
              name="email"
              classname="rounded-xl w-full"
            />
            <FormBox
              label="Phone"
              type="tel"
              id="phone"
              placeholder="+234-80000"
              register={register}
              errors={errors}
              name="phone"
              classname="rounded-xl w-full"
            />
          </div>
          <div>
            <FormBox
              label="Drivers license"
              type="text"
              placeholder="license number"
              id="license"
              register={register}
              errors={errors}
              name="license"
              classname="rounded-xl"
            />
            <p className="text-xs text-SoftBlack/80">
              Required for verification. Bring it at pickup
            </p>
          </div>
          <div className="mt-10 hidden md:flex justify-between items-center">
            <ActionButton
              text="Back"
              classname="w-fit py-5 px-4 bg-white border-gray-500 text-MainBlack text-sm md:text-base font-normal hover:bg-SoftWhite/90 transition-all rounded-full"
              onClick={() => navigate(`/book-ride/${slug}?step=1`)}
              type="button"
            />
            <ActionButton
              text={
                <>
                  Continue to payment{" "}
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
  );
}
