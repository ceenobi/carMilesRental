import type { QueryClient } from "@tanstack/react-query";
import { getSessionQuery } from "../queries/auth";

export const getSessionLoader = (queryClient: QueryClient) => async () => {
  try {
    const data = await queryClient.ensureQueryData(getSessionQuery());
    return { user: data?.data?.body ?? null };
  } catch {
    return { user: null };
  }
};