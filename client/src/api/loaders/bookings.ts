import type { QueryClient } from "@tanstack/react-query";
import {
  getABookingQuery,
  getAllBookingsQuery,
  getUserBookingsQuery,
} from "../queries/bookings";

export const getUserBookingsLoader = (queryClient: QueryClient) => async () => {
  const bookings = await queryClient.ensureQueryData(getUserBookingsQuery());
  return { bookings: bookings.data.body };
};

export const getABookingLoader =
  (queryClient: QueryClient) => async (params: { bookingId: string }) => {
    const booking = queryClient.ensureQueryData(getABookingQuery(params));
    return { booking };
  };

//admin
export const getAllBookingsLoader =
  (queryClient: QueryClient) => async (request: Request) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") ?? "1", 10);
    const limit = parseInt(url.searchParams.get("limit") ?? "10", 10);
    const query = url.searchParams.get("query") ?? "";
    const status = url.searchParams.get("status") as
      | "pending"
      | "upcoming"
      | "ongoing"
      | "completed"
      | "cancelled"
      | "failed";
    const pickUpDate = url.searchParams.get("pickUpDate") || "";
    const dropOffDate = url.searchParams.get("dropOffDate") || "";
    const pickUpTime = url.searchParams.get("pickUpTime") || "";
    const dropOffTime = url.searchParams.get("dropOffTime") || "";

    const queryParams: {
      page: number;
      limit: number;
      query?: string;
      status?:
        | "pending"
        | "upcoming"
        | "ongoing"
        | "completed"
        | "cancelled"
        | "failed";
      pickUpDate?: string;
      dropOffDate?: string;
      pickUpTime?: string;
      dropOffTime?: string;
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
    if (pickUpDate) queryParams.pickUpDate = pickUpDate;
    if (dropOffDate) queryParams.dropOffDate = dropOffDate;
    if (pickUpTime) queryParams.pickUpTime = pickUpTime;
    if (dropOffTime) queryParams.dropOffTime = dropOffTime;
    const bookings = queryClient.ensureQueryData(
      getAllBookingsQuery(queryParams),
    );
    return { bookings };
  };
