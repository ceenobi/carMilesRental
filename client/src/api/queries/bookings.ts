import axiosClient from "@/lib/axiosClient";
import { queryOptions } from "@tanstack/react-query";

export const getUserBookingsQuery = () =>
  queryOptions({
    queryKey: ["myBookings"],
    queryFn: async () => {
      const res = await axiosClient.get(`/bookings/my-bookings`);
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

export const getABookingQuery = ({ bookingId }: { bookingId: string }) =>
  queryOptions({
    queryKey: ["booking", bookingId],
    queryFn: async () => {
      const res = await axiosClient.get(`/bookings/get/${bookingId}`);
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

//admin
export const getAllBookingsQuery = ({
  page,
  limit,
  query,
  status,
  pickUpDate,
  dropOffDate,
  pickUpTime,
  dropOffTime,
}: {
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
}) =>
  queryOptions({
    queryKey: ["allBookings", page, limit, query, status, pickUpDate, dropOffDate, pickUpTime, dropOffTime],
    queryFn: async () => {
      const res = await axiosClient.get(`/bookings/all-bookings`, {
        params: { page, limit, query, status, pickUpDate, dropOffDate, pickUpTime, dropOffTime },
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
