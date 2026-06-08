import { getSessionQuery } from '@/api/queries/auth'
import type { UserSession } from '@/lib/schemaTypes'
import { queryClient } from '@/lib/utils'
import { createContext, redirect, type RouterContextProvider } from 'react-router'

export const userContext = createContext<UserSession | null>(null)

type MiddlewareFunction = (
  args: { context: Readonly<RouterContextProvider>; request: Request },
  next: () => Promise<Response>
) => Promise<Response>

export const authenticatedMiddleware: MiddlewareFunction = async ({ context, request }, next) => {
  try {
    const session = await queryClient.fetchQuery(getSessionQuery())

    if (session.status !== 200) {
      const url = new URL(request.url)
      const from = url.pathname
      return redirect(`/login?from=${encodeURIComponent(from)}`)
    }

    ;(context as RouterContextProvider).set(userContext, session.data.body)
  } catch {
    // User is not authenticated (401 or other error), redirect to login
    const url = new URL(request.url)
    const from = url.pathname
    return redirect(`/login?from=${encodeURIComponent(from)}`)
  }
  return await next()
}

export const guestMiddleware: MiddlewareFunction = async ({ request }, next) => {
  try {
    const session = await queryClient.fetchQuery(getSessionQuery())
    if (session.status === 200) {
      const url = new URL(request.url)
      const from = url.searchParams.get('from') ? url.searchParams.get('from') : '/'
      return redirect(from)
    }
  } catch {
    // User is not authenticated (401 or other error), allow access to auth routes
  }
  return await next()
}
