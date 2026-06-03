import ActionButton from "@/components/ui/actionButton";
import { ArrowUpRight, CreditCard, Loader } from "lucide-react";
import { useEffect } from "react";
import { Link, useFetcher, useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";

export default function VerifyPayment() {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get("reference");
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const isSubmitting =
    fetcher.state === "submitting" || fetcher.state === "loading";
  const data = fetcher.data;

  useEffect(() => {
    if (reference && !data && !isSubmitting) {
      fetcher.submit(
        { reference },
        { method: "POST", action: `/verify-payment?reference=${reference}` },
      );
    }
  }, [reference, data, isSubmitting, fetcher]);

  useEffect(() => {
    if (!fetcher.data || fetcher.state !== "idle") return;
    const { status, body } = fetcher.data;
    if (status !== 200 || !body.success) {
      toast.error(body.message || "Failed to verify payment");
      return;
    } else {
      const paystackData = body.body?.data;
      const slug = paystackData?.slug;
      const bookingId = paystackData?.bookingId;

      toast.success("Payment verified successfully");
      if (slug) {
        navigate(
          `/book-ride/${slug}/confirmation?step=3&bookingId=${bookingId}`,
        );
      }
    }
  }, [fetcher.data, fetcher.state, navigate]);

  return (
    <div className="container mx-auto py-24 px-4 flex items-center justify-center h-full">
      {isSubmitting ? (
        <div className="mt-10 flex flex-col items-center gap-4">
          <Loader className="w-4 h-4 animate-spin text-DeepOrange" />
          <p className="text-MainBlack text-md animate-pulse font-medium">
            Verifying your transaction...
          </p>
        </div>
      ) : (
        <div className="w-full max-w-lg mx-auto">
          {fetcher.data?.status !== 200 && (
            <div className="mt-10 bg-muted/30 rounded-sm">
              <div className="pt-10 pb-10 flex flex-col items-center text-center">
                <CreditCard className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
                <h2 className="text-xl font-semibold mb-2">OOPS!</h2>
                <p className="text-muted-foreground mb-6">
                  We couldn't process your payment. Please check your payment
                  method or contact support for assistance.
                </p>
                <Link to={`/cars`} className="w-full sm:w-auto">
                  <ActionButton
                    text={
                      <>
                        Explore cars
                        <div className="ml-2 p-1 bg-black/20 rounded-full">
                          <ArrowUpRight size={16} />
                        </div>
                      </>
                    }
                    classname="w-50 py-5.5 bg-DeepOrange text-white text-sm md:text-base font-semibold hover:bg-DeepOrange/90 transition-all rounded-full"
                  />
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
