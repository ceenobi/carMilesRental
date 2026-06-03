import type { QueryClient } from "@tanstack/react-query";
import { getAllDriversQuery } from "../queries/drivers";

export const getAllDriversLoader =
  (queryClient: QueryClient) => async (request: Request) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") ?? "1", 10);
    const limit = parseInt(url.searchParams.get("limit") ?? "10", 10);
    const query = url.searchParams.get("query") ?? "";
    const status = url.searchParams.get("status") as
      | "active"
      | "inactive"
      | "available"
      | "off-duty";

    const queryParams: {
      page: number;
      limit: number;
      query?: string;
      status?: "active" | "inactive" | "available" | "off-duty";
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
    const drivers = queryClient.ensureQueryData(
      getAllDriversQuery(queryParams),
    );
    return { drivers };
  };
