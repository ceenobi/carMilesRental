import { ProgressBar } from "@/components/features/progressBar";
import Profile from "@/components/nav/profile";
// import Search from "@/components/nav/search";
import Sidebar from "@/components/nav/sidebar";
import type { UserSession } from "@/lib/schemaTypes";
import {
  Bell,
  Calendar,
} from "lucide-react";
import {
  Outlet,
  useLoaderData,
  ScrollRestoration,
} from "react-router";

export default function DashboardLayout() {
  const { user } = useLoaderData() as { user: UserSession | null };

  const getDate = () => {
    const now = new Date();
    return now.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <>
      <ProgressBar />
      <ScrollRestoration />
      <section className="grid grid-cols-1 lg:grid-cols-[220px_1fr] h-fit lg:min-h-screen bg-background">
        <aside className="hidden sticky top-0 h-auto lg:h-screen bg-white dark:bg-card p-3 lg:p-4 xl:p-6 lg:flex flex-col lg:flex-col gap-2 lg:gap-4 border-b lg:border-b-0 lg:border-r border-border z-40 backdrop-blur-md">
          <Sidebar />
        </aside>
        <main className="overflow-y-auto max-w-full">
          <div className="hidden lg:block bg-white/80 backdrop-blur-md border-b border-border sticky top-0 z-30">
            <nav className="flex justify-between items-center py-4 px-8">
              {/* <Search id="search items" placeholder="Search items" /> */}
                <div className="flex gap-2 items-center text-sm font-medium text-SoftBlack">
                  <Calendar size={18} className="text-DeepOrange" />
                  <p>{getDate()}</p>
                </div>
              <div className="flex gap-8 items-center">
                <div className="relative">
                  <Bell size={20} className="text-SoftBlack cursor-pointer hover:text-DeepOrange transition-colors" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-DeepOrange rounded-full border-2 border-white"></span>
                </div>
                <Profile user={user} />
              </div>
            </nav>
          </div>
          <section className="bg-gray-50/50 min-h-screen p-4 lg:p-8">
            <Outlet />
          </section>
        </main>
      </section>
    </>
  );
}
