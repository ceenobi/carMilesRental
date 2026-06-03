import axiosClient from "@/lib/axiosClient";
import type { contactSchemaType } from "@/lib/schemaTypes";
import { axiosError } from "@/lib/utils";

export const contactUsApi = async ({ request }) => {
  const formData = await request.formData();
  const formDataObj = Object.fromEntries(formData) as contactSchemaType;
  try {
    const res = await axiosClient.post("/contact/send", formDataObj);
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
