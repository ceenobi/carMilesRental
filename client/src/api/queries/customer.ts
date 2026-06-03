import axiosClient from "@/lib/axiosClient";
import { queryOptions } from "@tanstack/react-query";

export const getCustomersQuery = ({
  page,
  limit,
  query,
}: {
  page: number;
  limit: number;
  query?: string;
}) =>
  queryOptions({
    queryKey: ["customers", page, limit, query],
    queryFn: async () => {
      const res = await axiosClient.get(`/customers`, {
        params: { page, limit, query },
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
