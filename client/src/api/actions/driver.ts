import axiosClient from "@/lib/axiosClient";
import type { driverSchemaType } from "@/lib/schemaTypes";
import { axiosError } from "@/lib/utils";

export const registerDriverApi = async ({ request }) => {
  const formDataObj = (await request.json()) as driverSchemaType;
  try {
    const res = await axiosClient.post("/drivers/register", formDataObj);
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
export const assignDriverApi = async ({ request }) => {
  const formDataObj = (await request.json()) as { bookingId: string; driverId: string };
  try {
    const res = await axiosClient.post("/drivers/assign", formDataObj);
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
