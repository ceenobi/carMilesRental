import axiosClient from "@/lib/axiosClient";
import type {
  carSchemaType,
} from "@/lib/schemaTypes";
import { axiosError } from "@/lib/utils";

export const createCarApi = async ({ request }) => {
  const formDataObj = await request.json() as carSchemaType;
  try {
    const res = await axiosClient.post("/cars/add", formDataObj);
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