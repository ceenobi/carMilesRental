import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";

interface DashboardStatsProps {
  stats: {
    totalRevenue: number;
    totalBookings: number;
    totalCars: number;
    totalDrivers: number;
    totalCustomers: number;
  };
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
  const statsCard = [
    {
      title: "Active Bookings",
      value: stats?.totalBookings || 0,
      img: "/bookings.svg",
      color: "text-emerald-500",
      change: 4.2, // Mocked change
    },
    {
      title: "Total Revenue",
      value: `₦${stats?.totalRevenue?.toLocaleString() || 0}`,
      img: "/revenue.svg",
      color: "text-emerald-500",
      change: 5.2, // Mocked change
    },
    {
      title: "Total Fleet",
      value: stats?.totalCars || 0,
      img: "/fleet.svg",
      color: "text-emerald-500",
      change: 2.2, // Mocked change
    },
    {
      title: "Total Customers",
      value: stats?.totalCustomers || 0,
      img: "/clients.svg",
      color: "text-emerald-500",
      change: 7.2, // Mocked change
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsCard.map((item, i) => (
        <Card
          key={i}
          className="rounded-xl border-none shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 bg-white"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <CardHeader className="flex flex-row gap-2 items-center space-y-0 pb-2">
            <div className="p-2 bg-gray-50 rounded-lg">
              <img
                src={item.img}
                alt="stats"
                className={cn("h-4 w-4")}
              />
            </div>
            <CardTitle className="text-sm font-medium text-SoftBlack">{item.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3 items-center">
              <div className="text-2xl font-bold text-MainBlack">{item.value}</div>
              <div className="flex items-center space-x-2">
                {item.change !== undefined && item.change !== 0 && (
                  <span
                    className={cn(
                      "text-[10px] font-medium flex items-center px-2 py-0.5 rounded-full",
                      item.change > 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600",
                    )}
                  >
                    {item.change > 0 ? (
                      <ArrowUpRight className="h-3 w-3 mr-0.5" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 mr-0.5" />
                    )}
                    {Math.abs(item.change)}%
                  </span>
                )}
              </div>
            </div>
            <div className="flex justify-between items-center text-SoftBlack hover:text-DeepOrange transition-colors cursor-pointer group">
              <span className="text-xs font-medium">View detailed analytics</span>
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
