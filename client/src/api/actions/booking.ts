import axiosClient from "@/lib/axiosClient";
import type {
  adminNewBookingSchemaType,
  bookingSchemaType,
} from "@/lib/schemaTypes";
import { axiosError } from "@/lib/utils";

export const createBookingApi = async ({ request }) => {
  const formData = await request.formData();
  const formDataObj = Object.fromEntries(formData) as bookingSchemaType;
  try {
    const res = await axiosClient.post("/bookings/create", formDataObj);
    return res;
  } catch (error) {
    const errorResponse = axiosError(error);
    if (errorResponse) {
      return errorResponse;
    }
    return {
      status: 500,
      body: {
        success: false,
        message: error.message || "An unexpected error occurred",
      },
    };
  }
};

export const adminCreateBookingApi = async ({ request }) => {
  const formData = await request.formData();
  const formDataObj = Object.fromEntries(formData) as adminNewBookingSchemaType;
  try {
    const res = await axiosClient.post("/bookings/admin-create", formDataObj);
    return res;
  } catch (error) {
    const errorResponse = axiosError(error);
    if (errorResponse) {
      return errorResponse;
    }
    return {
      status: 500,
      body: {
        success: false,
        message: error.message || "An unexpected error occurred",
      },
    };
  }
};

export const updateBookingApi = async ({ request, params }) => {
  const bookingId = params.bookingId;
  const url = new URL(request.url);
  const status = url.searchParams.get("status");
  const formData = await request.formData();
  const formDataObj = Object.fromEntries(formData) as Record<string, string>;
  const method = request.method;
  try {
    if (method === "PATCH" && status === "cancelled") {
      const res = await axiosClient.patch(
        `/bookings/cancel/${bookingId}`,
        formDataObj,
      );
      return res;
    }
    if (method === "PATCH" && status === "completed") {
      const res = await axiosClient.patch(
        `/bookings/completed/${bookingId}`,
        formDataObj,
      );
      return res;
    }
    return {
      status: 400,
      body: {
        success: false,
        message: "Invalid request",
      },
    };
  } catch (error) {
    const errorResponse = axiosError(error);
    if (errorResponse) {
      return errorResponse;
    }
    return {
      status: 500,
      body: {
        success: false,
        message: error.message || "An unexpected error occurred",
      },
    };
  }
};
