import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  verifyEmailSchema,
  type resendOtpSchemaType,
  type verifyEmailSchemaType,
} from "@/lib/schemaTypes";
import ActionButton from "@/components/ui/actionButton";
import { ArrowUpRight, Loader } from "lucide-react";
import { useSearchParams, Form, useFetcher, useNavigate } from "react-router";
import PinField from "react-pin-field";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { resendOtpApi } from "@/api/actions/auth";

export default function VerifyAccount() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<verifyEmailSchemaType>({
    resolver: zodResolver(verifyEmailSchema),
    mode: "onChange",
  });
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const isSubmitting = fetcher.state === "submitting";

  const mutation = useMutation({
    mutationFn: resendOtpApi,
    onSuccess: (response) => {
      if ("body" in response) {
        toast.error(response.body?.message || "Failed to resend OTP");
        return;
      }
      const message = response?.data?.message || "OTP resent successfully";
      toast.success(message);
    },
    onError: () => {
      toast.error("Failed to resend OTP");
    },
  });

  useEffect(() => {
    if (!fetcher.data || fetcher.state !== "idle") return;
    const { status, data, body } = fetcher.data;
    if (status !== 200) {
      toast.error(body.message || "Failed to verify your account");
      return;
    } else {
      const message = data.message || "Account verified successfully";
      toast.success(message);
      navigate(`/`);
    }
  }, [fetcher.data, fetcher.state, navigate]);

  const retryOtp = async (data: resendOtpSchemaType) => {
    mutation.mutate(data);
  };

  const onFormSubmit: SubmitHandler<verifyEmailSchemaType> = async (data) => {
    fetcher.submit(data, {
      method: "post",
      action: `/verify-account?email=${email}`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-[32px] font-bold tracking-tight">
          Verify your account
        </h1>
        <p className="text-sm text-SoftBlack">
          Enter the otp code you received in your email.
        </p>
      </div>
      <Form onSubmit={handleSubmit(onFormSubmit)}>
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "text-sm text-SoftBlack font-semibold",
                  errors?.otp && "text-red-600",
                )}
              >
                OTP Code:
              </span>
            </div>
            <Controller
              name="otp"
              control={control}
              render={({ field: { onChange } }) => (
                <PinField
                  autoFocus
                  length={6}
                  placeholder=""
                  onChange={onChange}
                  className={cn(
                    "max-w-[30%] sm:w-[14.5%] text-center border border-gray-300 rounded-md p-2 font-bold m-1",
                    errors?.otp && "border-red-500",
                  )}
                />
              )}
            />
            {errors?.otp && (
              <p className="text-xs text-red-600">{errors?.otp?.message}</p>
            )}
          </div>
          <ActionButton
            text={
              <>
                Verify{" "}
                <div className="ml-2 p-1 bg-black/20 rounded-full">
                  <ArrowUpRight size={16} />
                </div>
              </>
            }
            type="submit"
            loading={isSubmitting}
            children={<Loader className="animate-spin" />}
            classname="mt-4 w-full py-5.5 bg-DeepOrange text-white text-base font-semibold hover:bg-DeepOrange/90 rounded-full"
          />
          <p className="text-center text-sm text-SoftBlack">
            Did not receive the code?{" "}
            <a
              href="#"
              className="text-DeepOrange"
              onClick={(e) => {
                e.preventDefault();
                retryOtp({ email });
              }}
            >
              {mutation.isPending ? "Resending..." : "Resend"}
            </a>
          </p>
        </div>
      </Form>
    </div>
  );
}
