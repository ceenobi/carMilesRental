import axiosClient from "@/lib/axiosClient";
import { driverSchema, type driverSchemaType } from "@/lib/schemaTypes";
import { axiosError } from "@/lib/utils";
import type { ActionFunctionArgs } from "react-router";

export const registerDriverApi = async ({ request, params }: ActionFunctionArgs) => {
  const data = await request.json();
  const formDataObj = driverSchema.parse(data);
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
        message:
          error instanceof Error ? error.message : "An unexpected error occurred",
      },
    };
  }
};
export const assignDriverApi = async ({ request, params }: ActionFunctionArgs) => {
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
        message:
          error instanceof Error ? error.message : "An unexpected error occurred",
      },
    };
  }
};
