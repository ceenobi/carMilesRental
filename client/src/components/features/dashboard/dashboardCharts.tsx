import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Sector,
} from "recharts";

interface DashboardChartsProps {
  stats: {
    revenueOverview: { month: string; revenue: number }[];
    fleetStatus: Record<string, number>;
    topVehicles: { name: string; revenue: number; trips: number }[];
  };
}

export default function DashboardCharts({ stats }: DashboardChartsProps) {
  const fleetData = Object.entries(stats?.fleetStatus || {}).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
  }));

  const COLORS = ["#FF5722", "#4CAF50", "#2196F3", "#FFC107"];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
      <Card className="lg:col-span-4 rounded-xl border-none shadow-sm bg-white">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-MainBlack">Revenue Overview</CardTitle>
          <p className="text-sm text-SoftBlack">Monthly revenue performance for the last 6 months</p>
        </CardHeader>
        <CardContent className="pl-2">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={stats?.revenueOverview}>
              <XAxis
                dataKey="month"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `₦${value}`}
              />
              <Tooltip
                cursor={{ fill: "#f3f4f6" }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-3 border rounded-lg shadow-sm">
                        <p className="text-sm font-bold text-MainBlack">{payload[0].payload.month}</p>
                        <p className="text-sm text-DeepOrange">
                          Revenue: ₦{payload[0].value?.toLocaleString()}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey="revenue"
                fill="#FF5722"
                radius={[4, 4, 0, 0]}
                barSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="lg:col-span-3 rounded-xl border-none shadow-sm bg-white">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-MainBlack">Fleet Status</CardTitle>
          <p className="text-sm text-SoftBlack">Real-time distribution of your vehicle fleet</p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={fleetData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
                shape={(props) => {
                  return <Sector {...props} fill={COLORS[props.index % COLORS.length]} />;
                }}
              />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {fleetData.map((item, index) => (
              <div key={item.name} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-xs font-medium text-MainBlack">{item.name}</span>
                <span className="text-xs text-SoftBlack ml-auto">{item.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-7 rounded-xl border-none shadow-sm bg-white">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-MainBlack">Vehicles based on Revenue</CardTitle>
          <p className="text-sm text-SoftBlack">Top performing vehicles in your fleet</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {stats?.topVehicles?.map((vehicle, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-MainBlack">{vehicle.name}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-SoftBlack">{vehicle.trips} trips</span>
                    <span className="font-bold text-DeepOrange">₦{vehicle.revenue.toLocaleString()}</span>
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div 
                    className="bg-DeepOrange h-2 rounded-full transition-all duration-1000"
                    style={{ 
                      width: `${(vehicle.revenue / (stats.topVehicles[0]?.revenue || 1)) * 100}%` 
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
