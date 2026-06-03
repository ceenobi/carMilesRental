import { useState } from "react";
import { NavLink, Form } from "react-router";
import { Menu, X } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { links, type NavLinkProps } from "@/lib/constants";
import Logo from "./logo";
import type { UserSession } from "@/lib/schemaTypes";
import { Separator } from "../ui/separator";

export default function MobileDrawer({ user }: { user: UserSession }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger>
        <div className="relative w-10 h-10 cursor-pointer inline-flex items-center justify-center rounded-md border border-input bg-background hover:bg-accent">
          <Menu size={30} />
        </div>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md bg-white dark:bg-white/2 border border-white/10 dark:backdrop-blur-3xl border-l-0 p-0"
        showCloseButton={false}
        aria-describedby="drawer"
      >
        <div className="relative flex flex-col h-full px-4 py-2">
          <div className="flex justify-between items-center h-12">
            <Logo />
            <SheetClose>
              <div className="w-12 h-12 rounded-full border border-DeepOrange/20 bg-white/5 hover:bg-white/10 cursor-pointer inline-flex items-center justify-center">
                <X size={24} />
              </div>
            </SheetClose>
          </div>
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <div className="flex-1 flex flex-col justify-center items-center">
            <div className="flex flex-col uppercase items-center">
              {links.map((item: NavLinkProps) => (
                <div key={item.id} className="my-1">
                  <div className="flex flex-col pt-4">
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        `tracking-widest transition-all duration-300 ease-in-out w-full p-2 text-sm font-medium ${
                          isActive
                            ? "font-bold w-full border-DeepOrange text-DeepOrange"
                            : "hover:bg-DarkNight/30 hover:text-DeepOrange"
                        }`
                      }
                      onClick={() => setIsOpen(false)}
                    >
                      <span
                        className={`text-sm cursor-pointer transition ease-in-out duration-300`}
                      >
                        {item.label}
                      </span>
                    </NavLink>
                  </div>
                </div>
              ))}
            </div>
            <Separator className="my-4" />
            {user ? (
              <div>
                <Form
                  action="/logout"
                  method="post"
                  className="flex gap-2 items-center cursor-pointer text-red-600 w-full"
                  onClick={(e) => {
                    e.currentTarget.requestSubmit();
                  }}
                >
                  <p className="text-base uppercase text-center cursor-pointer font-bold text-red-600">
                    Logout
                  </p>
                </Form>
              </div>
            ) : (
              <div className="flex flex-col uppercase items-center text-center gap-4">
                {[
                  { path: "/login", label: "Login" },
                  { path: "/register", label: "Get Started" },
                ].map((item) => (
                  <NavLink
                    to={item.path}
                    key={item.label}
                    className={({ isActive }) =>
                      `tracking-widest transition-all duration-300 ease-in-out w-full p-2 text-sm font-medium ${
                        isActive
                          ? "font-bold w-full border-DeepOrange text-DeepOrange"
                          : "hover:bg-DarkNight/30 hover:text-DeepOrange"
                      }`
                    }
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
