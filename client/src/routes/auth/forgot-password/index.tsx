import { useForm, type SubmitHandler } from "react-hook-form";
import { Form, Link, useFetcher } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { resendOtpSchema, type resendOtpSchemaType } from "@/lib/schemaTypes";
import { FormBox } from "@/components/ui/formBox";
import ActionButton from "@/components/ui/actionButton";
import { ArrowLeft, ArrowUpRight, CircleCheck, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { toast } from "sonner";

export default function ForgotPassword() {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<resendOtpSchemaType>({
    resolver: zodResolver(resendOtpSchema),
    mode: "onChange",
  });
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";
  const success = fetcher.data?.status === 200;

  useEffect(() => {
    if (!fetcher.data || fetcher.state !== "idle") return;
    const { status, data, body } = fetcher.data;
    if (status !== 200) {
      toast.error(body.message || "Failed to send reset code");
      return;
    } else {
      const message = data.message || "Password reset successful";
      toast.success(message);
    }
  }, [fetcher.data, fetcher.state]);

  const onFormSubmit: SubmitHandler<resendOtpSchemaType> = async (data) => {
    fetcher.submit(data, {
      method: "post",
      action: `/forgot-password`,
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
        {!success ? (
          <>
            <div className="space-y-2">
              <h1 className="text-[32px] font-bold tracking-tight">
                Forgot password
              </h1>
              <p className="text-sm text-SoftBlack">
                Enter the email associated with your account and we'll send you
                a code to reset your password.
              </p>
            </div>
            <Form onSubmit={handleSubmit(onFormSubmit)}>
              <div className="space-y-1">
                <FormBox
                  label="Email"
                  type="email"
                  placeholder="email@example.com"
                  id="email"
                  register={register}
                  errors={errors?.email}
                  name="email"
                />
                <ActionButton
                  text={
                    <>
                      Send Reset Code{" "}
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
        ) : (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="bg-DeepOrange/10 text-white p-3 rounded-lg inline-flex">
                <CircleCheck className="w-9 h-9 text-DeepOrange" />
              </div>
              <h1 className="text-lg text-DeepOrange font-medium">
                CHECK YOUR INBOX
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <h1 className="text-4xl font-bold">Code sent</h1>
              <img src="/mail.svg" alt="mail" />
            </div>
            <p className="text-MainBlack text-sm">
              We’ve sent an otp code to{" "}
              <span className="font-medium">{getValues("email")}</span>. It may
              take a minute to arrive.
            </p>
            <div className="p-4 bg-SoftWhite rounded-lg">
              <p className="text-SoftBlack text-sm">
                Didn’t get the email? Check your spam folder or <br />{" "}
                <span className="text-black">try another address.</span>
              </p>
            </div>
            <Link to="/login">
              <Button className="w-full rounded-lg py-5.5 bg-DeepOrange text-white font-semibold text-base">
                Back to Sign In{" "}
                <div className="ml-2 p-1 bg-black/20 rounded-full">
                  <ArrowUpRight size={16} />
                </div>
              </Button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
