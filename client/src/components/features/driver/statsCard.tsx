import type { FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsCardProps {
  stats: {
    all?: number;
    active: number;
    inactive?: number;
    available?: number;
    "off-duty": number;
    averageRating: number;
    availableToday: number;
  };
}

const StatsCard: FC<StatsCardProps> = ({ stats }) => {
  const { active, "off-duty": offDuty, averageRating, availableToday } = stats;
  const statsData = [
    { label: "Active Drivers", value: active, color: "text-emerald-500" },
    { label: "Off Duty", value: offDuty, color: "text-rose-500" },
    {
      label: "Available Today",
      value: availableToday,
      color: "text-green-500",
    },
    {
      label: "Avg Rating",
      value: averageRating.toFixed(2),
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
