import axiosClient from "@/lib/axiosClient";
import { queryOptions } from "@tanstack/react-query";

export const getCarsQuery = ({
  page,
  limit,
  query,
  status,
  category,
  type,
}: {
  page: number;
  limit: number;
  query?: string;
  status?: "booked" | "unavailable" | "open";
  category?:
    | "executive"
    | "premium"
    | "logistics"
    | "city"
    | "family"
    | "economy";
  type?: "sedan" | "suv" | "bus" | "truck";
}) =>
  queryOptions({
    queryKey: ["cars", page, limit, query, status, category, type],
    queryFn: async () => {
      const res = await axiosClient.get("/cars/get", {
        params: {
          page,
          limit,
          query,
          status,
          category,
          type,
        },
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

export const getACarQuery = ({ slug }: { slug: string }) =>
  queryOptions({
    queryKey: ["car", slug],
    queryFn: async () => {
      const res = await axiosClient.get(`/cars/get/${slug}`);
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

export const getTrendingCarsQuery = ({ limit = 3 }: { limit?: number }) =>
  queryOptions({
    queryKey: ["trendingCars", limit],
    queryFn: async () => {
      const res = await axiosClient.get(`/cars/trending`, {
        params: {
          limit,
        },
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
