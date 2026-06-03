import axiosClient from "@/lib/axiosClient";

export const getDashboardStatsApi = async () => {
  return await axiosClient.get("/dashboard/stats");
};
