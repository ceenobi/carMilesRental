import { useState, useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useFetcher, Link, useNavigate } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type registerSchemaType } from "@/lib/schemaTypes";
import { FormBox } from "@/components/ui/formBox";
import ActionButton from "@/components/ui/actionButton";
import { ArrowUpRight, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Register() {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<registerSchemaType>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const isSubmitting = fetcher.state === "submitting";

  useEffect(() => {
    if (!fetcher.data || fetcher.state !== "idle") return;
    const { status, data, body } = fetcher.data;
    if (status !== 201) {
      toast.error(body.message || "Failed to register account");
      return;
    } else {
      const message = data.message || "Account created successfully";
      toast.success(message);
      navigate(
        `/verify-account?email=${encodeURIComponent(getValues("email"))}`,
      );
    }
  }, [fetcher.data, fetcher.state, navigate, getValues]);

  const onFormSubmit: SubmitHandler<registerSchemaType> = async (data) => {
    fetcher.submit(data, {
      method: "post",
      action: "/register",
    });
  };

  return (
    <div className="space-y-6 ">
      <div className="space-y-2">
        <h1 className="text-[32px] font-bold tracking-tight">
          Start Your Journey
        </h1>
        <p className="textbase text-SoftBlack">
          Takes less than a minute — no card required.
        </p>
      </div>
      <fetcher.Form onSubmit={handleSubmit(onFormSubmit)}>
        <div className="space-y-1">
          <FormBox
            label="Fullname"
            type="text"
            placeholder="Enter your full name"
            id="fullname"
            register={register}
            errors={errors?.fullname}
            name="fullname"
          />
          <FormBox
            label="Email"
            type="email"
            placeholder="email@example.com"
            id="email"
            register={register}
            errors={errors?.email}
            name="email"
          />
          <FormBox
            label="Phone"
            type="tel"
            placeholder="+234-00000"
            id="phone"
            register={register}
            errors={errors?.phone}
            name="phone"
          />
          <FormBox
            label="Password"
            type="password"
            placeholder="******"
            id="password"
            register={register}
            errors={errors?.password}
            name="password"
            isVisible={isVisible}
            setIsVisible={setIsVisible}
          />
          <ActionButton
            text={
              <>
                Create Account{" "}
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
          <div className="mt-1 flex items-center gap-2">
            <div className="w-full h-px bg-gray-200 dark:bg-gray-600" />{" "}
            <span className="text-muted-foreground text-xs uppercase whitespace-nowrap">
              or
            </span>{" "}
            <div className="w-full h-px bg-gray-200 dark:bg-gray-600" />
          </div>
          <Button className="py-5.5 w-full border border-SoftBlack/10 bg-white text-SoftBlack text-base font-semibold hover:bg-white/30 rounded-full">
            <svg
              className="w-10 h-10 text-green-700"
              role="img"
              viewBox="0 0 26 26"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
            >
              <title>Google</title>
              <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
            </svg>{" "}
            Continue with Google
          </Button>
          <p className="text-xs text-SoftBlack text-center mt-2">
            Already a member?{" "}
            <Link to="/login" className="font-semibold text-DeepOrange">
              Sign In
            </Link>
          </p>
        </div>
      </fetcher.Form>
    </div>
  );
}
