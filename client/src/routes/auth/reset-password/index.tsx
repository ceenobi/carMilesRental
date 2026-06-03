import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  resetPasswordSchema,
  type resetPasswordSchemaType,
} from "@/lib/schemaTypes";
import { FormBox } from "@/components/ui/formBox";
import ActionButton from "@/components/ui/actionButton";
import { ArrowLeft, ArrowUpRight, Loader } from "lucide-react";
import {
  Link,
  useSearchParams,
  Form,
  useFetcher,
  useNavigate,
} from "react-router";
import PinField from "react-pin-field";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function ResetPassword() {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<resetPasswordSchemaType>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
  });
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const isSubmitting = fetcher.state === "submitting";

  useEffect(() => {
    if (!fetcher.data || fetcher.state !== "idle") return;
    const { status, data, body } = fetcher.data;
    if (status !== 200) {
      toast.error(body.message || "Failed to reset password");
      return;
    } else {
      const message = data.message || "Password reset successful";
      toast.success(message);
      navigate(`/login`);
    }
  }, [fetcher.data, fetcher.state, navigate]);

  const onFormSubmit: SubmitHandler<resetPasswordSchemaType> = async (data) => {
    fetcher.submit(data, {
      method: "patch",
      action: `/reset-password?email=${email}`,
    });
  };

  return (
    <>
      <div className="space-y-6">
        <Link
          to="/login"
          className="font-semibold flex gap-2 items-center text-xs text-SoftBlack/80 "
        >
          <ArrowLeft size={18} /> Back to Sign In
        </Link>

        <>
          <div className="space-y-2">
            <h1 className="text-[32px] font-bold tracking-tight">
              Reset Password
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
              <FormBox
                label="New Password"
                type="password"
                placeholder="******"
                id="newPassword"
                register={register}
                errors={errors?.newPassword}
                name="newPassword"
                isVisible={isVisible}
                setIsVisible={setIsVisible}
              />
              <ActionButton
                text={
                  <>
                    Reset Password{" "}
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
            </div>
          </Form>
        </>
      </div>
    </>
  );
}
