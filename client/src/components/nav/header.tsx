import { NavLink } from "react-router";
import Logo from "./logo";
import type { UserSession } from "@/lib/schemaTypes";
import Profile from "./profile";
import { links } from "@/lib/constants";
import MobileDrawer from "./drawer";
import { ArrowUpRight } from "lucide-react";
import { Button } from "../ui/button";

export default function Header({ user }: { user: UserSession }) {
  return (
    <div className="fixed top-0 z-50 w-full p-4 bg-gray-50">
      <div className="container mx-auto flex justify-between items-center">
        <Logo />
        <div className="hidden md:flex gap-4 md:gap-8 items-center">
          {links.map((item) => (
            <NavLink
              to={item.path}
              key={item.id}
              className={({ isActive }) =>
                isActive
                  ? "font-semibold text-DeepOrange"
                  : "text-MainBlack hover:text-DeepBlue transition-all ease-in-out duration-300"
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
        {user ? (
          <Profile user={user} />
        ) : (
          <div className="hidden md:flex gap-4 items-center">
            <NavLink
              to="/login"
              className="text-MainBlack hover:text-DeepBlue transition-all ease-in-out duration-300"
            >
              Sign in
            </NavLink>
            <NavLink to="/register">
              <Button className="text-base rounded-full py-6 px-4" size="lg">
                Get Started{" "}
                <ArrowUpRight className="ml-2 flex p-1.5 bg-DeepOrange rounded-full size-7" />
              </Button>
            </NavLink>
          </div>
        )}
        <div className="md:hidden">
          <MobileDrawer user={user} />
        </div>
      </div>
    </div>
  );
}
