import DashboardStats from "@/components/features/dashboard/dashboardStats";
import DashboardCharts from "@/components/features/dashboard/dashboardCharts";
import RecentBookings from "@/components/features/dashboard/recentBookings";
import { getTimeOfDay } from "@/lib/utils";
import { useState } from "react";
import { useLoaderData, useRouteLoaderData } from "react-router";
import type { DashboardStatsData } from "@/lib/schemaTypes";

export default function Dashboard() {
  const { user } = useRouteLoaderData("userSession");
  const stats = useLoaderData() as { body: DashboardStatsData };
  const [period, setPeriod] = useState<"Today" | "7d" | "30d">("30d");

  return (
    <div className="container mx-auto space-y-10 pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-medium text-MainBlack tracking-tighter">
            {getTimeOfDay(user?.fullname)}
          </h1>
          <p className="text-MainBlack">
            Manage your team with confidence
          </p>
        </div>
        <div className="flex gap-2 bg-white border rounded-lg p-2">
          {["Today", "7d", "30d"].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p as "Today" | "7d" | "30d")}
              className={`px-3 py-1 text-sm rounded transition-colors cursor-pointer ${
                period === p
                  ? "bg-primary text-primary-foreground font-medium"
                  : "hover:bg-gray-200 text-gray-700"
              }`}
            >
              {p === "Today"
                ? "Today"
                : p === "7d"
                  ? "7 days"
                  : p === "30d"
                    ? "30 days"
                    : "7 days"}
            </button>
          ))}
        </div>
      </div>
      <DashboardStats stats={stats?.body?.summary} />
      <DashboardCharts stats={stats?.body} />
      <RecentBookings bookings={stats?.body?.recentBookings} />
    </div>
  );
}

