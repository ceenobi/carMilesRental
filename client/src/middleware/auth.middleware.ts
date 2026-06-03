import { getSessionQuery } from "@/api/queries/auth";
import {
  createContext,
  redirect,
  type RouterContextProvider,
} from "react-router";
import type { UserSession } from "@/lib/schemaTypes";
import { queryClient } from "@/lib/utils";

export const userContext = createContext<UserSession | null>(null);

export async function authenticatedMiddleware(
  {
    context,
    request,
  }: { context: Readonly<RouterContextProvider>; request: Request },
  next: () => Promise<Response>,
) {
  try {
    const session = await queryClient.fetchQuery(getSessionQuery());

    if (session.status !== 200) {
      const url = new URL(request.url);
      const from = url.pathname;
      return redirect(`/login?from=${encodeURIComponent(from)}`);
    }

    (context as RouterContextProvider).set(userContext, session.data.body);
  } catch {
    // User is not authenticated (401 or other error), redirect to login
    const url = new URL(request.url);
    const from = url.pathname;
    return redirect(`/login?from=${encodeURIComponent(from)}`);
  }
  return await next();
}

export async function guestMiddleware(
  { request }: { context: Readonly<RouterContextProvider>; request: Request },
  next: () => Promise<Response>,
) {
  try {
    const session = await queryClient.fetchQuery(getSessionQuery());

    if (session.status === 200) {
      const url = new URL(request.url);
      const from = url.searchParams.get("from") || "/";
      return redirect(from);
    }
  } catch {
    // User is not authenticated (401 or other error), allow access to auth routes
  }
  return await next();
}
