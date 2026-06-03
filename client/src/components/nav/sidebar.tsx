import { dashboardLinks } from "@/lib/constants";
import Logo from "./logo";
import { NavLink, useLocation } from "react-router";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const location = useLocation();
  const path = location.pathname;
  return (
    <>
      <Logo />
      <div className="mt-2 flex flex-col gap-1">
        {dashboardLinks.map((item) => (
          <NavLink
            to={item.path}
            key={item.id}
            className={({ isActive }) =>
              cn(
                "font-normal rounded-full transition-all ease-in-out duration-300 text-sm",
                isActive || path.split("/")[2] ===
                  item.path.split("/")[2]
                  ? "font-medium bg-DeepOrange text-SoftWhite"
                  : "text-SoftBlack hover:text-DeepBlue hover:bg-DeepOrange/10",
              )
            }
            end
          >
            <span className="flex gap-2 items-center px-4 py-3">
              <item.icon size={20} />
              {item.label}
            </span>
          </NavLink>
        ))}
      </div>
    </>
  );
}
