import type { QueryClient } from "@tanstack/react-query";
import { getCustomersQuery } from "../queries/customer";

export const getCustomersLoader =
  (queryClient: QueryClient) => async (request: Request) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") ?? "1", 10);
    const limit = parseInt(url.searchParams.get("limit") ?? "10", 10);
    const query = url.searchParams.get("query") ?? "";
   
    const queryParams: {
      page: number;
      limit: number;
      query?: string;
    } = {
      page,
      limit,
    };
    if (query) {
      queryParams.query = query;
    }
    const customers = queryClient.ensureQueryData(
      getCustomersQuery(queryParams),
    );
    return { customers };
  };
