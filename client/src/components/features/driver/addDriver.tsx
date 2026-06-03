import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useFetcher, useRevalidator } from "react-router";
import ActionButton from "@/components/ui/actionButton";
import { Button } from "@/components/ui/button";
import { FormBox } from "@/components/ui/formBox";
import Modal from "@/components/ui/modal";
import { driverSchema, type driverSchemaType } from "@/lib/schemaTypes";
import { cn, queryClient } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Loader, Plus } from "lucide-react";

export default function AddDriver() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [languages, setLanguages] = useState(["English"]);
  const [status, setStatus] = useState("available");
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
  } = useForm<driverSchemaType>({
    resolver: zodResolver(driverSchema) as never,
    defaultValues: {
      fullname: "",
      phone: "",
      email: "",
      license: "",
      licenseExpiryDate: "",
      language: [],
      status: "available",
      baseCity: "",
      yearsOfExperience: "",
      isVerified: false,
    },
    mode: "onChange",
  });

  const stepData = [
    { id: 1, title: "Identity" },
    { id: 2, title: "License" },
    { id: 3, title: "Assignment" },
  ];

  const handleNextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handlePreviousStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  useEffect(() => {
    if (status) {
      setValue(
        "status",
        status as "available" | "active" | "inactive" | "off-duty",
      );
    }
  }, [status, setValue]);

  useEffect(() => {
    const values = getValues();
    if (currentStep === 2) {
      if (
        !values.fullname ||
        !values.phone ||
        !values.email ||
        !values.baseCity ||
        !values.yearsOfExperience
      ) {
        toast.error("Please fill in all required details in step 1");
      }
    } else if (currentStep === 3) {
      if (!values.license || !values.licenseExpiryDate) {
        toast.error("Please fill in all required details in step 2");
      }
    }
  }, [currentStep, getValues]);

  useEffect(() => {
    if (!fetcher.data || fetcher.state !== "idle") return;
    const { status, data, body } = fetcher.data;
    if (status !== 201) {
      toast.error(body?.message || "Failed to add a new driver");
      return;
    } else {
      queryClient.removeQueries({ queryKey: ["drivers"] });
      revalidate();
      reset();
      const message = data?.message || "Driver added successfully";
      toast.success(message, { id: "driver" });
      const timer = setTimeout(() => {
        setCurrentStep(1);
        setIsOpen(false);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [fetcher.data, fetcher.state, reset, revalidate]);

  const selectLanguages = ["English", "Yoruba", "Hausa", "Igbo", "Pidgin"];
  const selectStatus = ["available", "active", "inactive", "off-duty"];

  const insertLanguages = (item: string) => {
    const updated = languages.includes(item)
      ? languages.filter((l) => l !== item)
      : [...languages, item];
    setLanguages(updated);
    setValue("language", updated as driverSchemaType["language"]);
  };

  const onSubmit: SubmitHandler<driverSchemaType> = (data) => {
    fetcher.submit(data, {
      method: "post",
      action: "/dashboard/drivers",
      encType: "application/json",
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
          <h1 className="text-xl font-bold text-MainBlack">Add a driver</h1>
          <p className="text-sm text-SoftBlack mt-1">
            Onboard a professional driver to your roster in three quick steps.
          </p>
        </div>
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
        <div className="px-6 py-4 max-h-80 sm:max-h-[60vh] overflow-y-auto">
          <fetcher.Form onSubmit={handleSubmit(onSubmit)} id="adminDriverForm">
            {currentStep === 1 && (
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12">
                  <h1 className="text-xl font-semibold mb-4">
                    Personal Information
                  </h1>
                  <FormBox
                    label="Fullname"
                    type="text"
                    placeholder="Enter driver fullname"
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
                <div className="col-span-12 md:col-span-6">
                  <FormBox
                    label="Email Address"
                    type="email"
                    placeholder="Enter email address"
                    id="email"
                    register={register}
                    errors={errors?.email}
                    name="email"
                    classname="rounded-xl"
                  />
                </div>
                <div className="col-span-12 md:col-span-6">
                  <FormBox
                    label="Base City"
                    type="text"
                    placeholder="city residence"
                    id="baseCity"
                    register={register}
                    errors={errors?.baseCity}
                    name="baseCity"
                    classname="rounded-xl"
                  />
                </div>
                <div className="col-span-12 md:col-span-6">
                  <FormBox
                    label="Experience"
                    type="number"
                    placeholder="0"
                    id="yearsOfExperience"
                    register={register}
                    errors={errors?.yearsOfExperience}
                    name="yearsOfExperience"
                    classname="rounded-xl"
                  />
                </div>
                <div className="col-span-12">
                  <h1 className="text-base font-semibold mb-2">
                    Languages spoken
                  </h1>
                  <div className="flex gap-3 flex-wrap items-center">
                    {selectLanguages.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => insertLanguages(item)}
                        className={cn(
                          "px-3 py-2 rounded-full text-xs font-medium transition-colors duration-200",
                          languages.includes(item)
                            ? "bg-DeepOrange text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300",
                        )}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {currentStep === 2 && (
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12">
                  <h1 className="text-xl font-semibold mb-4">
                    License Information
                  </h1>
                  <FormBox
                    label="License Number"
                    type="text"
                    placeholder="Enter license number"
                    id="licenseNumber"
                    register={register}
                    errors={errors?.license}
                    name="license"
                    classname="rounded-xl"
                  />
                </div>
                <div className="col-span-12">
                  <FormBox
                    label="License Expiry Date"
                    type="date"
                    placeholder="Enter license expiry date"
                    id="licenseExpiryDate"
                    register={register}
                    errors={errors?.licenseExpiryDate}
                    name="licenseExpiryDate"
                    classname="rounded-xl"
                  />
                </div>
                <div className="col-span-12 flex items-center justify-between border p-3 rounded-xl">
                  <div>
                    <h1 className="text-sm text-MainBlack font-medium">
                      Background check verified
                    </h1>
                    <p className="text-xs text-SoftBlack font-medium">
                      Toggle once compliance approves
                    </p>
                  </div>
                  <FormBox
                    label=""
                    type="checkbox"
                    id="isVerified"
                    register={register}
                    errors={errors?.isVerified}
                    name="isVerified"
                    classname="bg-none"
                    showLabel={false}
                    inputType="switch"
                    control={control}
                  />
                </div>
              </div>
            )}
            {currentStep === 3 && (
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12">
                  <h1 className="text-lg font-semibold mb-4">
                    Initial Assignment
                  </h1>
                  <p className="text-sm text-SoftBlack">Set status</p>
                  <div className="mt-2 grid grid-cols-4 gap-2 items-center">
                    {selectStatus.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setStatus(item)}
                        className={cn(
                          "px-3 py-2 rounded-full text-xs font-medium transition-colors duration-200",
                          status === item
                            ? "bg-DeepOrange/10 text-DeepOrange border border-DeepOrange"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300",
                        )}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="col-span-12">
                  <h1 className="my-4 text-sm text-SoftBlack font-base">
                    Summary
                  </h1>
                  <div className="bg-SoftWhite p-4 rounded-xl space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <h1 className="text-sm text-SoftBlack font-base">Name</h1>
                      <p className="text-end text-sm text-MainBlack font-base">
                        {getValues().fullname}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <h1 className="text-sm text-SoftBlack font-base">
                        Phone
                      </h1>
                      <p className="text-end text-sm text-MainBlack font-base">
                        {getValues().phone}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <h1 className="text-sm text-SoftBlack font-base">
                        Language
                      </h1>
                      <p className="text-end text-sm text-MainBlack font-base">
                        {getValues()
                          .language?.map((lang) => lang)
                          .join(", ")}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <h1 className="text-sm text-SoftBlack font-base">
                        License
                      </h1>
                      <p className="text-end text-sm text-MainBlack font-base">
                        {getValues().license}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <h1 className="text-sm text-SoftBlack font-base">
                        Status
                      </h1>
                      <p className="text-end text-sm text-MainBlack font-base">
                        {getValues().status}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <h1 className="text-sm text-SoftBlack font-base">
                        Verified
                      </h1>
                      <p className="text-end text-sm text-MainBlack font-base">
                        {getValues().isVerified ? "Verified" : "Not Verified"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </fetcher.Form>
        </div>
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
              text="Add driver"
              classname="w-fit py-5.5 px-4 bg-DeepOrange text-white text-sm md:text-base font-normal hover:bg-DeepOrange/90 transition-all rounded-full"
              type="submit"
              form="adminDriverForm"
              loading={fetcher.state === "submitting"}
              children={<Loader className="animate-spin" />}
            />
          ) : (
            <Button
              className="bg-DeepOrange text-white hover:bg-DeepOrange/90 h-12 w-37.5 rounded-full"
              onClick={handleNextStep}
              disabled={currentStep === stepData.length}
            >
              {currentStep === stepData.length ? "Confirm Driver" : "Next Step"}
            </Button>
          )}
        </div>
      </Modal>
    </>
  );
}
