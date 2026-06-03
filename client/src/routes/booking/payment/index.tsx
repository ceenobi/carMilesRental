import ActionButton from "@/components/ui/actionButton";
import { Separator } from "@/components/ui/separator";
import { payOptions } from "@/lib/constants";
import { cn, queryClient } from "@/lib/utils";
import { ArrowUpRight, Dot, Landmark, Loader, Lock } from "lucide-react";
import { useState, useEffect } from "react";
import {
  useParams,
  useNavigate,
  useFetcher,
  useRouteLoaderData,
} from "react-router";
import type { CarProduct } from "@/lib/constants";
import { safeGetItem } from "@/lib/storage";
import useCalcBookingCost from "@/hooks/useCalcBookingCost";
import { toast } from "sonner";

export default function Payment() {
  const { slug } = useParams();
  const { car } = useRouteLoaderData("car") as { car: CarProduct };
  const [selectPayment, setSelectPayment] = useState<
    "pay_with_bank" | "paystack"
  >("paystack");
  const navigate = useNavigate();
  const fetcher = useFetcher();

  const savedBooking = JSON.parse(safeGetItem("bookingData") || "null");
  const { grandTotal } = useCalcBookingCost({
    pickUpDate: savedBooking?.pickUpDate
      ? new Date(savedBooking.pickUpDate)
      : undefined,
    dropOffDate: savedBooking?.dropOffDate
      ? new Date(savedBooking.dropOffDate)
      : undefined,
    car: car,
    SERVICE_FEE: car?.serviceFee,
    addDriver: savedBooking?.addDriver,
  });

  const isSubmitting = fetcher.state === "submitting";

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.body) {
      if (fetcher.data.body.success) {
        const { paymentMethod, authorizationUrl } = fetcher.data.body;
        if (paymentMethod === "paystack" && authorizationUrl) {
          queryClient.invalidateQueries({ queryKey: ["myBookings"] });
          window.location.href = authorizationUrl;
        } else if (paymentMethod === "pay_with_bank") {
          queryClient.invalidateQueries({ queryKey: ["myBookings"] });
          navigate(`/book-ride/${slug}/confirmation?step=3`);
        }
      } else {
        toast.error(fetcher.data.body.message || "Something went wrong");
      }
    }
  }, [fetcher.data, fetcher.state, navigate, slug]);

  return (
    <div className="bg-white rounded-xl p-4 md:col-span-7 space-y-4 h-fit">
      <h1 className="text-2xl font-semibold">Payment method</h1>
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4 lg:gap-8">
        {payOptions.map((option) => (
          <div
            className={cn(
              "border border-SoftBlack/20 rounded-2xl p-6 w-full cursor-pointer",
              selectPayment === option.value && "bg-DeepOrange/10",
            )}
            key={option.id}
            onClick={() =>
              setSelectPayment(option.value as "pay_with_bank" | "paystack")
            }
          >
            <img src={option.icon} alt={option.label} className="mb-2" />
            <h1 className="text-MainBlack text-base">{option.label}</h1>
            <p className="text-SoftBlack text-sm">{option.text}</p>
          </div>
        ))}
      </div>

      <fetcher.Form method="post" id={`/book-ride/${slug}/payment`}>
        {/* Pass extra data as hidden fields */}
        <input type="hidden" name="paymentMethod" value={selectPayment} />
        <input type="hidden" name="amount" value={String(grandTotal)} />
        <input
          type="hidden"
          name="carId"
          value={car?._id || savedBooking?.car?._id || ""}
        />
        <input type="hidden" name="slug" value={slug || ""} />

        {selectPayment === "paystack" ? (
          <>
            <div className="mt-8 bg-SoftWhite rounded-2xl p-6 space-y-4">
              <div className="flex items-start gap-3">
                <img src="/pay.svg" alt="paystack" />
                <div>
                  <h1 className="text-MainBlack text-base font-normal">
                    Paystack Checkout
                  </h1>
                  <p className="text-SoftBlack text-sm">
                    You’ll be redirected to Paystack to complete payment
                    securely
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex gap-2 items-center">
                  <Dot size={28} />
                  <p className="text-SoftBlack text-sm">
                    Pay with debit card, bank transfer, USSD or mobile money
                  </p>
                </div>
                <div className="flex gap-2 items-center">
                  <Dot size={28} />
                  <p className="text-SoftBlack text-sm">
                    Instant confirmation back to miles
                  </p>
                </div>
                <div className="flex gap-2 items-center">
                  <Dot size={28} />
                  <p className="text-SoftBlack text-sm">
                    Refund processed within 3-5 working days
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-8 flex gap-2">
              <Lock className="text-SoftBlack" size={18} />
              <p className="text-SoftBlack text-sm">
                Encrypted & PCI-compliant. We never store your full card number
              </p>
            </div>
            <div className="mt-10 hidden md:flex justify-between items-center">
              <ActionButton
                text="Back"
                classname="w-fit py-5 px-4 bg-white border-SoftBlack/50 text-MainBlack text-sm font-normal hover:bg-SoftWhite/90 transition-all rounded-full"
                onClick={() => navigate(`/book-ride/${slug}?step=1`)}
                type="button"
              />
              <ActionButton
                text={
                  <>
                    Pay with Paystack{" "}
                    <div className="ml-2 p-1 bg-black/20 rounded-full">
                      <ArrowUpRight size={16} />
                    </div>
                  </>
                }
                classname="w-50.75 py-5.5 px-4 bg-DeepOrange text-white text-sm font-medium hover:bg-DeepOrange/90 transition-all rounded-full"
                type="submit"
                loading={isSubmitting}
                children={<Loader className="animate-spin" />}
              />
            </div>
          </>
        ) : (
          <div className="mt-8 bg-SoftWhite rounded-2xl p-6 space-y-4">
            <div className="flex items-start gap-3">
              <Landmark size={28} />
              <div>
                <h1 className="text-MainBlack text-base font-normal">
                  Pay directly to our bank
                </h1>
                <p className="text-SoftBlack text-sm">
                  After payment, send payment receipt to our mail for
                  confirmation and we will book your ride.
                </p>
              </div>
            </div>
            <Separator />
            <h1 className="font-bold">Bank Details</h1>
            <div className="text-medium">
              <p>KUDA BANK</p>
              <p>ACCOUNT NAME: CAR MILES RENTALS</p>
              <p>ACCOUNT NUMBER: 2338898909</p>
            </div>
            <Separator />
            <div className="flex gap-2 items-center text-sm">
              <h1 className="text-sm">Made payment?</h1>
              <a
                href="mailto:milescar.rental@gmail.com"
                target="_blank"
                className="text-DeepOrange font-semibold"
              >
                message us now
              </a>
            </div>
            <div className="pt-4 hidden md:flex justify-between items-center">
              <ActionButton
                text="Back"
                classname="w-fit py-5 px-4 bg-white border-SoftBlack/50 text-MainBlack text-sm md:text-base font-normal hover:bg-SoftWhite/90 transition-all rounded-full"
                onClick={() => navigate(`/book-ride/${slug}?step=1`)}
                type="button"
              />
              <ActionButton
                text="Proceed to confirmation"
                classname="w-55.75 py-5.5 px-4 bg-DeepOrange text-white text-sm font-medium hover:bg-DeepOrange/90 transition-all rounded-full"
                type="submit"
                loading={isSubmitting}
                children={<Loader className="animate-spin" />}
              />
            </div>
          </div>
        )}
      </fetcher.Form>
    </div>
  );
}
