import axiosClient from "@/lib/axiosClient";
import { queryClient } from "@/lib/utils";
import { queryOptions } from "@tanstack/react-query";

export const clearUserSession = () => {
  queryClient.removeQueries({ queryKey: ["user"] });
};

export const getSessionQuery = () =>
  queryOptions({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await axiosClient.get("/auth/me");
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
