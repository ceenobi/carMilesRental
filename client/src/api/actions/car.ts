import axiosClient from "@/lib/axiosClient";
import {
  carSchema,
} from "@/lib/schemaTypes";
import { axiosError } from "@/lib/utils";
import type { ActionFunctionArgs } from "react-router";

export const createCarApi = async ({ request }: ActionFunctionArgs) => {
  const data = await request.json();
  const formDataObj = carSchema.parse(data);
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
        message:
          error instanceof Error ? error.message : "An unexpected error occurred",
      },
    };
  }
};