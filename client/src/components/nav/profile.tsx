import { Form, NavLink } from "react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ChevronDown, LogOut } from "lucide-react";
import type { UserSession } from "@/lib/schemaTypes";

export default function Profile({ user }: { user: UserSession }) {
  const isAdmin = user?.role.includes("admin");
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <div className="hidden md:flex gap-2 items-center">
            <div
              className="cursor-pointer relative h-10 w-10 rounded-full p-0 hover:bg-accent flex items-center justify-center"
              aria-label="Profile menu"
            >
              <span className="w-10 h-10 rounded-full border-2 border-border hover:border-primary transition-colors flex items-center justify-center">
                {user?.fullname
                  ?.split(" ")
                  .map((name) => name[0])
                  .join("")
                  .toUpperCase()}
              </span>
            </div>
            <h1 className="hidden md:block font-semibold tracking-tighter">
              {user?.fullname}
            </h1>
            <ChevronDown />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuGroup>
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="truncate text-MainBlack text-sm font-medium leading-none">
                  {user?.fullname}
                </p>
                <p className="text-xs leading-none text-muted-foreground capitalize">
                  {user?.role}
                </p>
              </div>
            </DropdownMenuLabel>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {["bookings", "dashboard"]
              .filter((item) => {
                if (isAdmin) {
                  return item;
                } else {
                  return item.includes("bookings");
                }
              })
              .map((item) => (
                <DropdownMenuItem key={item}>
                  <NavLink
                    to={item === "bookings" ? `/account/${item}` : `/${item}`}
                    key={item}
                    className={({ isActive }) =>
                      ` capitalize text-sm  ${isActive ? "text-DeepOrange" : "text-SoftBlack"}`
                    }
                    viewTransition

                  >
                    {item}
                  </NavLink>
                </DropdownMenuItem>
              ))}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Form
                action="/logout"
                method="post"
                className="flex gap-2 items-center cursor-pointer text-red-600 w-full"
                onClick={(e) => {
                  e.currentTarget.requestSubmit();
                }}
              >
                <LogOut />
                <span className="cursor-pointer w-auto font-semibold">
                  Logout
                </span>
              </Form>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
