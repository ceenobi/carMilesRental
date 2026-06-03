import { getTrendingCarsQuery } from "@/api/queries/cars";
import Filter from "@/components/features/home/filter";
import Testimonials from "@/components/features/home/testimonials";
import ActionButton from "@/components/ui/actionButton";
import { Button } from "@/components/ui/button";
import {
  heroSubTexts,
  heroSubTexts2,
  metrics,
  testimonials,
} from "@/lib/constants";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router";
import type { CarProduct } from "@/lib/constants";
import Faq from "@/components/features/home/faq";
import LazyLoadImageRC from "@/components/ui/lazyLoadImage";
import TrendingCars from "@/components/features/trendingCars";
import useMetaArgs from "@/hooks/useMeta";

export default function Home() {
  useMetaArgs({
    title: "Car MILES",
    description: "Home page for car rentals",
    keywords: "car rentals, car miles, car miles calculator",
  });
  const { data: carData } = useSuspenseQuery(
    getTrendingCarsQuery({ limit: 3 }),
  );
  const { cars, trendingCars } =
    carData?.data?.body ||
    ({} as {
      trendingCars: CarProduct[];
      cars: CarProduct[];
    });

  return (
    <>
      <div className="relative min-h-screen">
        <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/50 to-black/70 z-10" />
        <img
          src="https://res.cloudinary.com/ceenobi/image/upload/f_auto,q_auto/v1777469904/test/27fe19015a429f61d2ede77523d4130735094646_emexle.jpg"
          alt="heroCarBackground"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 min-h-screen flex items-center">
          <div className="container mx-auto px-4 py-20">
            <div className="mt-20 flex flex-col items-center text-center space-y-8">
              <div>
                <img
                  src="/testimonial.svg"
                  alt="testimonial"
                  className="hidden md:flex mx-auto"
                />
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-tight">
                  Move Smarter.{" "}
                  <span className="text-DeepOrange">Ride Better.</span>
                </h1>
              </div>
              <p className="text-sm sm:text-base md:text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
                Rent cars, trucks, buses, and luxury cars instantly. With or
                without a driver, we've got the perfect ride for your next
                adventure.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto">
                <Link to="/book-ride" className="w-full sm:w-auto">
                  <ActionButton
                    text={
                      <>
                        Book Now{" "}
                        <div className="ml-2 p-1 bg-black/20 rounded-full">
                          <ArrowUpRight size={16} />
                        </div>
                      </>
                    }
                    classname="w-full sm:w-45 py-5 bg-DeepOrange text-white text-sm md:text-base font-semibold hover:bg-DeepOrange/90 transition-all rounded-full"
                  />
                </Link>
                <Link to="/cars" className="w-full sm:w-auto">
                  <ActionButton
                    text={"Explore Cars"}
                    classname="w-full sm:w-45 py-5 bg-SoftWhite text-MainBlack text-sm md:text-base font-semibold hover:bg-SoftWhite/90 transition-all rounded-full"
                  />
                </Link>
              </div>
              <div className="w-full mt-8 md:mt-12">
                <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-6 md:p-8 shadow-2xl">
                  <div className="flex flex-col md:flex-row gap-6 items-start md:items-start">
                    <div className="md:w-1/4 xl:w-[15%]">
                      <h2 className="text-lg md:text-2xl lg:text-xl text-white font-semibold text-start">
                        Need to Rent a Luxury Car?
                      </h2>
                    </div>
                    <div className="md:w-3/4 xl:w-[85%] w-full">
                      <Filter cars={cars} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="py-12 px-4">
        <div className="container mx-auto space-y-4">
          <p className="text-sm">
            <span className="w-2 h-2 bg-DeepOrange rounded-full inline-block mr-2" />
            Redefining the Rental Experience
          </p>
          <h1 className="font-medium text-xl md:text-2xl xl:text-[30px] text-SoftBlack">
            At <span className="text-DeepOrange">Miles</span>{" "}
            <span className="text-MainBlack">car rental</span>, we believe
            getting from A to B should be the easiest part of your journey. We
            are a team of car enthusiasts and tech innovators, reimagining the
            way Nigerians discover, book, and experience vehicles.{" "}
            <span className="text-MainBlack">
              From discovery to delivery, we've made it smooth, fast and
              worry-free.
            </span>
          </h1>
        </div>
      </div>
      <div className="bg-white py-12 px-4">
        <div className="container mx-auto space-y-8 gap-8 grid grid-cols-1 lg:grid-cols-2 items-center">
          <div>
            <p className="text-sm mb-4">
              <span className="w-2 h-2 bg-DeepOrange rounded-full inline-block mr-2" />
              Why Choose Us
            </p>
            <h1 className="font-medium text-2xl md:text-[40px] text-MainBlack max-w-100">
              We’re BIG on <span className="text-DeepOrange">What Matters</span>{" "}
              to You
            </h1>
            <div className="mt-4 grid grid-cols-2 gap-6">
              {heroSubTexts.map((item) => (
                <div key={item.id} className="space-y-2">
                  <img src={item.img} alt={item.title} />
                  <h2 className="font-medium text-MainBlack text-2xl">
                    {item.title}
                  </h2>
                  <p className="text-sm text-SoftBlack">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
          <LazyLoadImageRC
            alt="lady"
            src="/carType.svg"
            width="100%"
            height="100%"
            className="object-cover"
          />
        </div>
      </div>
      <div className="bg-white my-24 py-12 px-4">
        <div className="container mx-auto space-y-8">
          <TrendingCars cars={trendingCars || []} />
        </div>
      </div>
      <div className="my-24 py-12 px-4">
        <div
          className="container mx-auto bg-DeepOrange rounded-2xl p-6 lg:p-10 bg-cover bg-center"
          style={{ backgroundImage: "url('/spiral.png')" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="space-y-4">
              <p className="text-sm text-SoftWhite">
                <span className="w-2 h-2 bg-SoftWhite rounded-full inline-block mr-2" />
                Best Deal! No Limit
              </p>
              <h1 className="text-5xl md:text-[70px] font-bold text-SoftWhite underline">
                50%
              </h1>
              <h2 className="lg:w-[75%] text-2xl md:text-4xl lg:text-[45px] font-medium text-SoftWhite">
                Book Cyber Truck with a big Discount!
              </h2>
              <Link to="/book">
                <Button className="text-base rounded-full py-6 px-4" size="lg">
                  Book Now{" "}
                  <ArrowUpRight className="ml-2 flex p-1.5 bg-DeepOrange rounded-full size-7" />
                </Button>
              </Link>
            </div>
            <div>
              <img
                src="/cyberTruck.svg"
                alt="cyberTruck"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto rounded-2xl bg-white p-4 md:p-12 space-y-8 gap-8 grid grid-cols-1 lg:grid-cols-2 items-center overflow-hidden">
        <div className="space-y-4">
          <p className="text-sm">
            <span className="w-2 h-2 bg-DeepOrange rounded-full inline-block mr-2" />
            Concierge Service
          </p>
          <h1 className="font-medium text-2xl md:text-[40px] text-MainBlack max-w-100">
            Discover a New Level of{" "}
            <span className="text-DeepOrange">Comfort</span>
          </h1>
          <h2 className="text-[18px] font-light text-SoftBlack">
            Enjoy a seamless rental experience tailored to your needs. Our
            concierge service is designed to provide comfort, convenience, and
            dedicated support.
          </h2>
          <div className="mt-8 grid grid-cols-2 gap-6">
            {heroSubTexts2.map((item) => (
              <div key={item.id} className="space-y-2">
                <h2 className="font-medium text-MainBlack">{item.title}</h2>
                <p className="text-sm text-SoftBlack">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
        <LazyLoadImageRC
          alt="lady"
          src="/lady.svg"
          width="100%"
          height="100%"
          className="object-cover"
        />
      </div>
      <div className="my-24 py-12 px-4">
        <div className="container mx-auto space-y-8">
          <div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm">
                  <span className="w-2 h-2 bg-DeepOrange rounded-full inline-block mr-2" />
                  Testimonials
                </p>
                <h1 className="font-medium text-[40px] text-MainBlack">
                  Real Stories That{" "}
                  <span className="text-DeepOrange">Build Trust </span>
                </h1>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((item) => (
              <Testimonials key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>
      <div className="my-24 py-12 px-4 bg-white">
        <div className="container mx-auto space-y-8 grid md:grid-cols-4 gap-4 text-center">
          {metrics.map((item) => (
            <div className="space-y-2" key={item.id}>
              <h1 className="text-MainBlack text-4xl xl:text-[70px]">
                {item.value}
              </h1>
              <p className="text-gray-400 leading-2 lg:tracking-widest">
                {item.info}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="my-24 py-12 px-4" id="faq">
        <div className="container mx-auto space-y-8 grid grid-cols-12 gap-4 items-center">
          <div className="col-span-12 md:col-span-6 lg:col-span-5">
            <div>
              <p className="text-sm">
                <span className="w-2 h-2 bg-DeepOrange rounded-full inline-block mr-2" />
                Frequently Asked Questions
              </p>
              <h1 className="font-medium text-[40px] text-MainBlack">
                Get <span className="text-DeepOrange">Answers</span> to Your
                Questions
              </h1>
              <div className="space-y-3">
                <h2 className="text-[18px] font-light text-SoftBlack my-6">
                  Find clear & helpful answers to the most common questions
                  about our services, booking process, policies, and support.
                </h2>
                <div className="flex gap-2 font-light">
                  <img
                    src="/check.svg"
                    alt="check-circle"
                    className="w-5 h-5"
                  />
                  <p className="text-base text-SoftBlack">
                    24/7 customer support for rental assistance
                  </p>
                </div>
                <div className="flex gap-2 font-light">
                  <img
                    src="/check.svg"
                    alt="check-circle"
                    className="w-5 h-5"
                  />
                  <p className="text-base text-SoftBlack">
                    Professional service with customer first approach
                  </p>
                </div>
                <p className="mt-4 text-base text-SoftBlack font-light">
                  Still have questions?{" "}
                  <span className="text-DeepOrange">
                    Contact our support team
                  </span>{" "}
                  anytime.
                </p>
              </div>
            </div>
          </div>
          <div className="col-span-12 md:col-span-6 lg:col-span-7">
            <Faq />
          </div>
        </div>
      </div>
    </>
  );
}
