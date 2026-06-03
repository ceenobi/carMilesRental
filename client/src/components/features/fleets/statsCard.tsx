import type { FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsCardProps {
  stats: {
    totalBooked?: number;
    totalOpen?: number;
    totalUnavailable?: number;
    totalReserved?: number;
  };
}

const StatsCard: FC<StatsCardProps> = ({ stats }) => {
  const { totalBooked, totalOpen, totalUnavailable, totalReserved } = stats;
  const statsData = [
    { label: "Booked", value: totalBooked ?? 0, color: "text-emerald-500" },
    { label: "Available", value: totalOpen ?? 0, color: "text-rose-500" },
    {
      label: "Unavailable",
      value: totalUnavailable ?? 0,
      color: "text-green-500",
    },
    {
      label: "Reserved",
      value: totalReserved ?? 0,
      color: "text-MainBlack",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsData.map((item, i) => (
        <Card
          key={i}
          className="rounded-sm animate-in fade-in slide-in-from-bottom-4 duration-500 dark:bg-lightBlue/20"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <CardHeader className="flex flex-row gap-2 items-center space-y-0 py-0">
            <CardTitle className="text-sm font-normal text-MainBlack">
              {item.label}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex gap-3 items-center">
              <div className={`text-2xl font-bold ${item.color}`}>
                {item.value}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsCard;
