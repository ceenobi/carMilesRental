import { links } from "@/lib/constants";
import { Copyright, Mail, MapPin, Phone } from "lucide-react";
import { Link, NavLink } from "react-router";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export default function Footer() {
  return (
    <div className="bg-DeepBlue py-12 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 md:col-span-6 lg:col-span-4">
            <div className="space-y-4">
              <Link to="/">
                <img src="/logoDark.svg" alt="logo" />
              </Link>
              <p className="my-4 text-base text-SoftWhite font-light">
                Nigeria's most loved car rental — built around your journey.
                From quick city runs to weekend escapes, we get you moving in
                minutes.
              </p>
              <div className="text-base text-SoftWhite font-light space-y-2">
                <div className="flex gap-2 items-center">
                  <MapPin size={16} />
                  <p>13, Alfred Bani Road, Lagos Island</p>
                </div>
                <div className="flex gap-2 items-center">
                  <Phone size={16} />
                  <p>+23470-000-0000-00</p>
                </div>
                <div className="flex gap-2 items-center">
                  <Mail size={16} />
                  <p>hello@milescarrental.com</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-12 md:col-span-6 lg:col-span-2">
            <h1 className="text-xl font-medium text-SoftWhite mb-8">
              Quick Links
            </h1>
            <div className="flex flex-col gap-4">
              {links.map((item) => (
                <NavLink
                  to={item.path}
                  key={item.id}
                  className="text-SoftWhite font-light"
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
          <div className="col-span-12 md:col-span-6 lg:col-span-2">
            <h1 className="text-xl font-medium text-SoftWhite mb-8">
              Services
            </h1>
            <div className="flex flex-col gap-4">
              <a href="#" className="text-SoftWhite font-light">
                Economy Car Rental
              </a>
              <a href="#" className="text-SoftWhite font-light">
                Luxury Car Rental
              </a>
              <a href="#" className="text-SoftWhite font-light">
                SUV Rental Services
              </a>
              <a href="#" className="text-SoftWhite font-light">
                Truck Rental Services
              </a>
              <a href="#" className="text-SoftWhite font-light">
                Bus Rental Services
              </a>
            </div>
          </div>
          <div className="col-span-12 md:col-span-6 lg:col-span-4">
            <h1 className="text-xl font-medium text-SoftWhite mb-8">
              Stay in the loop
            </h1>
            <div className="space-y-4">
              <p className="text-SoftWhite font-light">
                Deals, new arrivals and travel guides.
              </p>
              <form className="flex items-center w-full max-w-[400px]">
                <Input
                  type="email"
                  placeholder="Your email"
                  className="rounded-r-none w-[200px] py-5"
                />
                <Button
                  type="submit"
                  className="rounded-l-none bg-DeepOrange text-SoftWhite py-5.5 w-[80px]"
                >
                  Join
                </Button>
              </form>
            </div>
          </div>
        </div>
        <div className="my-10 flex flex-col gap-4 md:gap-0 md:flex-row justify-between items-center text-sm text-SoftWhite font-light">
          <div className="flex gap-2 items-center">
            <Copyright size={16} />
            <p>2026 Miles car rental. All rights reserved.</p>
          </div>
          <div className="flex gap-4">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <img src="/miles.svg" alt="miles" className="w-xl h-auto" />
        </div>
      </div>
    </div>
  );
}
