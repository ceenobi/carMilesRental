import axiosClient from "@/lib/axiosClient";
import { queryOptions } from "@tanstack/react-query";

export const getAllDriversQuery = ({
  page,
  limit,
  query,
  status,
}: {
  page: number;
  limit: number;
  query?: string;
  status?: "active" | "inactive" | "available" | "off-duty";
}) =>
  queryOptions({
    queryKey: ["drivers", page, limit, query, status],
    queryFn: async () => {
      const res = await axiosClient.get(`/drivers`, {
        params: { page, limit, query, status },
      });
      if (!res) {
        throw new Response("", {
          status: 404,
          statusText: "Not Found",
        });
      }
      return res;
    },
    staleTime: 60 * 1000,
  });
