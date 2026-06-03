import { createBrowserRouter, type RouteObject } from "react-router";
import RootLayout from "@/layouts/RootLayout";
import AuthLayout from "@/layouts/AuthLayout";
import DashboardLayout from "@/layouts/DashboardLayout";
import SuspenseUi from "@/components/ui/suspenseUi";
import {
  authenticatedMiddleware,
  guestMiddleware,
} from "@/middleware/auth.middleware";
import { queryClient } from "@/lib/utils";
import { AppErrorBoundary } from "@/components/ui/errorBoundary";
import {
  getABookingLoader,
  getAllBookingsLoader,
  getUserBookingsLoader,
} from "@/api/loaders/bookings";
import { getSessionLoader } from "@/api/loaders/auth";

const routes = [
  {
    Component: RootLayout,
    hydrateFallbackElement: <SuspenseUi />,
    ErrorBoundary: AppErrorBoundary,
    loader: getSessionLoader(queryClient),
    children: [
      {
        index: true,
        lazy: async () => {
          const { default: Component } = await import("@/routes/home");
          return { Component };
        },
      },
      {
        path: "cars",
        id: "cars",
        lazy: async () => {
          const { default: Component } = await import("@/routes/explore");
          return { Component };
        },
        loader: async ({ request }) =>
          (await import("@/api/loaders/cars")).getCarsLoader(queryClient)(
            request,
          ),
        children: [
          {
            path: "explore/:slug",
            lazy: async () => {
              const { default: Component } = await import("@/routes/carDetail");
              return { Component };
            },
            loader: async ({ params }) =>
              (await import("@/api/loaders/cars")).getACarLoader(queryClient)({
                slug: params.slug as string,
              }),
          },
        ],
      },
      {
        path: "contact-us",
        lazy: async () => {
          const { default: Component } = await import("@/routes/contact");
          return { Component };
        },
        action: async (args) =>
          (await import("@/api/actions/contact")).contactUsApi(args),
      },
      {
        path: "about-us",
        lazy: async () => {
          const { default: Component } = await import("@/routes/about");
          return { Component };
        },
      },
      {
        path: "book-ride/:slug",
        id: "car",
        lazy: async () => {
          const { default: Component } = await import("@/routes/booking");
          return { Component };
        },
        loader: async ({ params }) =>
          (await import("@/api/loaders/cars")).getACarLoader(queryClient)({
            slug: params.slug as string,
          }),
        children: [
          {
            path: "payment",
            lazy: async () => {
              const { default: Component } =
                await import("@/routes/booking/payment");
              return { Component };
            },
            action: async (args) =>
              (await import("@/api/actions/payment")).processBookingApi(args),
          },
          {
            path: "confirmation",
            lazy: async () => {
              const { default: Component } =
                await import("@/routes/booking/confirmation");
              return { Component };
            },
          },
        ],
      },
      {
        path: "verify-payment",
        middleware: [authenticatedMiddleware],
        lazy: async () => {
          const { default: Component } =
            await import("@/routes/verify-payment");
          return { Component };
        },
        action: async (args) =>
          (await import("@/api/actions/payment")).verifyPaymentApi(args),
      },
      {
        path: "account",
        middleware: [authenticatedMiddleware],
        children: [
          {
            path: "bookings",
            lazy: async () => {
              const { default: Component } =
                await import("@/routes/account/bookings");
              return { Component };
            },
            loader: getUserBookingsLoader(queryClient),
            children: [
              {
                path: ":slug/:bookingId",
                lazy: async () => {
                  const { default: Component } =
                    await import("@/routes/account/bookings/booking-detail");
                  return { Component };
                },
                loader: ({ params }) =>
                  getABookingLoader(queryClient)({
                    bookingId: params.bookingId as string,
                  }),
              },
            ],
          },
        ],
      },
    ],
  },
  {
    Component: AuthLayout,
    hydrateFallbackElement: <SuspenseUi />,
    ErrorBoundary: AppErrorBoundary,
    middleware: [guestMiddleware],
    children: [
      {
        path: "register",
        lazy: async () => {
          const { default: Component } = await import("@/routes/auth/register");
          return { Component };
        },
        action: async (args) =>
          (await import("../api/actions/auth")).registerUserApi(args),
      },
      {
        path: "login",
        lazy: async () => {
          const { default: Component } = await import("@/routes/auth/login");
          return { Component };
        },
        action: async (args) =>
          (await import("@/api/actions/auth")).loginUserApi(args),
      },
      {
        path: "forgot-password",
        lazy: async () => {
          const { default: Component } =
            await import("@/routes/auth/forgot-password");
          return { Component };
        },
        action: async (args) =>
          (await import("@/api/actions/auth")).requestPasswordResetApi(args),
      },
      {
        path: "reset-password",
        lazy: async () => {
          const { default: Component } =
            await import("@/routes/auth/reset-password");
          return { Component };
        },
        action: async (args) =>
          (await import("@/api/actions/auth")).resetPasswordApi(args),
      },
      {
        path: "verify-account",
        lazy: async () => {
          const { default: Component } =
            await import("@/routes/auth/verify-account");
          return { Component };
        },
        action: async (args) =>
          (await import("@/api/actions/auth")).verifyEmailApi(args),
      },
    ],
  },
  {
    path: "logout",
    hydrateFallbackElement: <SuspenseUi />,
    ErrorBoundary: AppErrorBoundary,
    lazy: async () => {
      const { default: Component } = await import("@/routes/auth/logout");
      return { Component };
    },
    action: async () => (await import("@/api/actions/auth")).logoutApi(),
  },
  {
    path: "dashboard",
    Component: DashboardLayout,
    hydrateFallbackElement: <SuspenseUi />,
    ErrorBoundary: AppErrorBoundary,
    loader: getSessionLoader(queryClient),
    id: "userSession",
    middleware: [authenticatedMiddleware],
    children: [
      {
        index: true,
        lazy: async () => {
          const { default: Component } = await import("@/routes/dashboard");
          return { Component };
        },
        loader: async () =>
          (await import("@/api/loaders/dashboardinfo")).getDashboardLoader(
            queryClient,
          )(),
      },
      {
        path: "bookings",
        lazy: async () => {
          const { default: Component } =
            await import("@/routes/dashboard/bookings");
          return { Component };
        },
        loader: ({ request }) => getAllBookingsLoader(queryClient)(request),
        action: async (args) =>
          (await import("@/api/actions/booking")).adminCreateBookingApi(args),
      },
      {
        path: "bookings/:bookingId",
        lazy: async () => {
          const { default: Component } =
            await import("@/routes/dashboard/bookings/booking-details");
          return { Component };
        },
        loader: ({ params }) =>
          getABookingLoader(queryClient)({
            bookingId: params.bookingId as string,
          }),
        action: async (args) => {
          const { request, params } = args;
          const method = request.method;
          if (method === "POST") {
            return (await import("@/api/actions/driver")).assignDriverApi(args);
          } else {
            return (await import("@/api/actions/booking")).updateBookingApi(args);
          }
        },
      },
      {
        path: "drivers",
        lazy: async () => {
          const { default: Component } =
            await import("@/routes/dashboard/drivers");
          return { Component };
        },
        loader: async ({ request }) =>
          (await import("@/api/loaders/drivers")).getAllDriversLoader(
            queryClient,
          )(request),
        action: async (args) =>
          (await import("@/api/actions/driver")).registerDriverApi(args),
      },
      {
        path: "customers",
        lazy: async () => {
          const { default: Component } =
            await import("@/routes/dashboard/customers");
          return { Component };
        },
        loader: async ({ request }) =>
          (await import("@/api/loaders/customer")).getCustomersLoader(
            queryClient,
          )(request),
      },
      {
        path: "fleets",
        lazy: async () => {
          const { default: Component } =
            await import("@/routes/dashboard/fleets");
          return { Component };
        },
        loader: async ({ request }) =>
          (await import("@/api/loaders/cars")).getCarsLoader(queryClient)(
            request,
          ),
        action: async (args) =>
          (await import("@/api/actions/car")).createCarApi(args),
      },
    ],
  },
] satisfies RouteObject[];

export const router = createBrowserRouter(routes);
