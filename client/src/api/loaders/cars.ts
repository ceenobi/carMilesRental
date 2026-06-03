import type { QueryClient } from "@tanstack/react-query";
import { getACarQuery, getCarsQuery, getTrendingCarsQuery } from "../queries/cars";

export const getACarLoader = (queryClient: QueryClient) => async (params: { slug: string }) => {
  const car = await queryClient.ensureQueryData(getACarQuery(params));
  return { car: car.data.body };
};

export const getTrendingCarsLoader = (queryClient: QueryClient) => async () => {
  const cars = await queryClient.ensureQueryData(getTrendingCarsQuery({}));
  return { cars: cars.data.body };
};

export const getCarsLoader =
  (queryClient: QueryClient) => async (request: Request) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") ?? "1", 10);
    const limit = parseInt(url.searchParams.get("limit") ?? "10", 10);
    const query = url.searchParams.get("query") ?? "";
    const status = url.searchParams.get("status") as
      | "booked"
      | "unavailable"
      | "open"
      | null;
    const category = url.searchParams.get("category") as
      | "executive"
      | "premium"
      | "logistics"
      | "city"
      | "family"
      | "economy"
      | null;
    const type = url.searchParams.get("type") as
      | "sedan"
      | "suv"
      | "bus"
      | "truck"
      | null;
    const queryParams: {
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
    } = {
      page,
      limit,
    };
    if (query) {
      queryParams.query = query;
    }
    if (status) {
      queryParams.status = status;
    }
    if (category) {
      queryParams.category = category;
    }
    if (type) {
      queryParams.type = type;
    }
    const cars = await queryClient.ensureQueryData(getCarsQuery(queryParams));
    return { cars: cars.data.body };
  };