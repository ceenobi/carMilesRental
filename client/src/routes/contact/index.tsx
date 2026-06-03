import { contactSubTexts } from "@/lib/constants";
import { Link, useFetcher, useNavigate } from "react-router";
import { useForm, type FieldErrors, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type contactSchemaType } from "@/lib/schemaTypes";
import { FormBox } from "@/components/ui/formBox";
import ActionButton from "@/components/ui/actionButton";
import { useEffect } from "react";
import { toast } from "sonner";
import { ArrowUpRight, CircleQuestionMark, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Contact() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<contactSchemaType>({
    resolver: zodResolver(contactSchema),
    mode: "onBlur",
  });
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const isSubmitting = fetcher.state === "submitting";

  useEffect(() => {
    if (!fetcher.data || fetcher.state !== "idle") return;
    const { status, data, body } = fetcher.data;
    if (status !== 200) {
      toast.error(
        body.message || "Email sent successfully, you will be reached on time",
      );
      return;
    } else {
      const message =
        data.message || "Unable to send your message, please try again";
      toast.success(message);
      reset();
    }
  }, [fetcher.data, fetcher.state, navigate, reset]);

  const onFormSubmit: SubmitHandler<contactSchemaType> = async (data) => {
    fetcher.submit(data, {
      method: "post",
      action: "/contact-us",
    });
  };

  return (
    <>
      <div className="relative min-h-screen">
        <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/50 to-black/70 z-10" />
        <img
          src="https://res.cloudinary.com/ceenobi/image/upload/f_auto,q_auto/v1777827614/MILESRIDE/8dc7e60df0a6f488ce2bad7e431a195c39feb973_je9nfu.jpg"
          alt="contactBackground"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 min-h-screen flex items-center">
          <div className="container mx-auto px-4">
            <div className="mt-20 flex flex-col items-center text-center space-y-8">
              <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-tight">
                Get in <span className="text-DeepOrange">Touch</span>
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
                We're here to help you every step of the way! Whether you have
                questions, feedback, or need support, our team is ready to
                assist you.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto py-24 px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-6">
            <div className="space-y-4">
              <p className="text-sm">
                <span className="w-2 h-2 bg-DeepOrange rounded-full inline-block mr-2" />
                We're ready to help
              </p>
              <h1 className="font-medium text-2xl md:text-[40px] text-MainBlack max-w-100">
                Contact us
              </h1>
              <div className="mt-4 grid grid-cols-2 gap-6">
                {contactSubTexts.map((item) => (
                  <div key={item.id} className="space-y-2">
                    <img src={item.img} alt={item.title} />
                    <h2 className="font-medium text-MainBlack text-2xl">
                      {item.title}
                    </h2>
                    <p className="text-sm text-SoftBlack">{item.text}</p>
                    <p className="text-sm text-DeepOrange">{item.subText}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="md:col-span-6" id="form">
            <div className="bg-white border rounded-xl p-4 md:col-span-5 space-y-4">
              <fetcher.Form onSubmit={handleSubmit(onFormSubmit)}>
                <div className="space-y-4">
                  <FormBox
                    label="Fullname"
                    type="text"
                    placeholder="Your fullname"
                    id="fullname"
                    register={register}
                    errors={
                      errors?.fullname as unknown as FieldErrors<contactSchemaType>
                    }
                    name="fullname"
                    classname="p-3 rounded-xl bg-SoftWhite/50"
                    showLabel={false}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormBox
                      label="Email"
                      type="email"
                      placeholder="email@example.com"
                      id="email"
                      register={register}
                      errors={
                        errors?.email as unknown as FieldErrors<contactSchemaType>
                      }
                      name="email"
                      classname="p-3 rounded-xl bg-SoftWhite/50"
                      showLabel={false}
                    />
                    <FormBox
                      label="Phone"
                      type="tel"
                      placeholder="+234-00000"
                      id="phone"
                      register={register}
                      errors={
                        errors?.phone as unknown as FieldErrors<contactSchemaType>
                      }
                      name="phone"
                      classname="p-3 rounded-xl bg-SoftWhite/50"
                      showLabel={false}
                    />
                  </div>
                  <FormBox
                    label="Subject"
                    type="text"
                    placeholder="Message subject"
                    id="subject"
                    register={register}
                    errors={
                      errors?.subject as unknown as FieldErrors<contactSchemaType>
                    }
                    name="subject"
                    classname="p-3 rounded-xl bg-SoftWhite/50"
                    showLabel={false}
                  />
                  <FormBox
                    label="Message"
                    type="text"
                    placeholder="Enter your message"
                    id="message"
                    register={register}
                    errors={
                      errors?.message as unknown as FieldErrors<contactSchemaType>
                    }
                    name="message"
                    classname="p-3 rounded-xl bg-SoftWhite/50"
                    inputType="textarea"
                    showLabel={false}
                  />
                  <ActionButton
                    text={
                      <>
                        Send Message{" "}
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
                  <p className="text-sm text-SoftBlack">
                    By submitting, you agree to our terms and privacy policy.
                  </p>
                </div>
              </fetcher.Form>
            </div>
          </div>
        </div>
        <div className="mt-20 rounded-lg bg-DeepOrange p-8 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-7 text-SoftWhite">
            <div className="flex gap-4 items-center">
              <div className="bg-white p-4 rounded-lg">
                <CircleQuestionMark className="text-DeepOrange size-10" />
              </div>
              <div>
                <h1 className="font-bold text-3xl">Have Questions?</h1>
                <p>Check our FAQs — most answers are just a click away.</p>
              </div>
            </div>
          </div>
          <div className="md:col-span-5 w-full text-end">
            <Link to={{ pathname: "/", hash: "faq" }}>
              <Button className="text-base rounded-full p-6" size="lg">
                View FAQS{" "}
                <div className="ml-2 p-1 bg-white/20 rounded-full">
                  <ArrowUpRight size={16} />
                </div>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
