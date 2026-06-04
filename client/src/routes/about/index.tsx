import ActionButton from "@/components/ui/actionButton";
import LazyLoadImageRC from "@/components/ui/lazyLoadImage";
import { Separator } from "@/components/ui/separator";
import { ArrowUpRight, CirclePlay } from "lucide-react";
import { Link } from "react-router";

export default function AboutUs() {
  return (
    <>
      <div className="relative min-h-screen">
        <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/50 to-black/70 z-10" />
        <img
          src="https://res.cloudinary.com/ceenobi/image/upload/f_auto,q_auto/v1777885742/MILESRIDE/462fc56bac55e48ea07be50ece45a339b4345f15_w2u7hz.jpg"
          alt="aboutUsBackground"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 min-h-screen flex items-center">
          <div className="container mx-auto px-4">
            <div className="mt-20 flex flex-col items-center text-center space-y-8">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-tight">
                About <span className="text-DeepOrange"> Miles</span> Car Rental
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
                At <span className="text-DeepOrange">Miles</span> car rental, we
                believe getting from A to B should be the easiest part of your
                journey — refined, reliable, and built around you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto">
                <Link to="/cars" className="w-full sm:w-auto">
                  <ActionButton
                    text={
                      <>
                        Explore Cars{" "}
                        <div className="ml-2 p-1 bg-black/20 rounded-full">
                          <ArrowUpRight size={16} />
                        </div>
                      </>
                    }
                    classname="w-full sm:w-45 py-5 bg-DeepOrange text-white text-sm font-semibold hover:bg-DeepOrange/90 transition-all rounded-full"
                  />
                </Link>
                <ActionButton
                  text={
                    <>
                      <div className="flex bg-SoftWhite rounded-full">
                        <CirclePlay className="size-6" />
                      </div>
                      Watch our story{" "}
                    </>
                  }
                  classname="w-full sm:w-45 py-5 bg-SoftWhite text-MainBlack text-sm font-semibold hover:bg-SoftWhite/90 transition-all rounded-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto py-24 px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-6">
            <LazyLoadImageRC
              alt="car-Garage"
              src="https://res.cloudinary.com/ceenobi/image/upload/e_auto_enhance,f_auto,q_auto/v1777886857/MILESRIDE/image_34_qtkxy0.svg"
              width="100%"
              height="100%"
              className="object-cover rounded-2xl"
            />
          </div>
          <div className="md:col-span-6">
            <div className="bg-white p-4 lg:p-6 lg:m-6 rounded-2xl space-y-8">
              <img src="/quote.svg" alt="quotes" className="w-10 h-10" />
              <div className="space-y-5">
                <h1 className="text-SoftBlack text-4xl font-light">
                  "Mobility should never be the hard part. We exist to make sure
                  it isn't."
                </h1>
                <Separator />
                <div className="flex gap-3 items-center">
                  <img src="/logoRound.svg" alt="logo" />
                  <p className="text-xl lg:text-2xl font-medium text-MainBlack">
                    The <span className="text-DeepOrange">Miles</span> car
                    rental team
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-20">
          <p className="text-sm mb-4">
            <span className="w-2 h-2 bg-DeepOrange rounded-full inline-block mr-2" />
            Our Story
          </p>
          <h1 className="font-medium text-2xl md:text-[40px] text-MainBlack max-w-125">
            Built <span className="text-DeepOrange">by drivers</span>,{" "}
            engineered <span className="text-DeepOrange">for everyone</span>.
          </h1>
          <p className="mt-6 text-lg lg:text-2xl font-light">
            <span className="text-DeepOrange">Miles</span> car rental was born
            from a simple observation: renting a vehicle in Nigeria shouldn't
            feel like a negotiation. It should feel like a tap, a confirmation,
            and a key in your hand. <b /> We're a team of car enthusiasts and
            tech builders obsessed with one thing — making mobility effortless.
            From the everyday commuter to the family planning a weekend escape,
            we make sure the road is open and the ride is yours.
          </p>
        </div>
      </div>
    </>
  );
}
