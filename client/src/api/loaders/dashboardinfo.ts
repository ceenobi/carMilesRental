import { QueryClient } from "@tanstack/react-query";
import { getDashboardStatsApi } from "../queries/dashboardinfo";
// import type { DashboardStatsData } from "@/lib/schemaTypes";

export const getDashboardLoader = (queryClient: QueryClient) => async () => {
  return await queryClient.fetchQuery({
    queryKey: ["dashboardStats"],
    queryFn: async () => {
      const res = await getDashboardStatsApi();
      return res.data;
    },
  });
};
