import axiosClient from "@/lib/axiosClient";
import { contactSchema, type contactSchemaType } from "@/lib/schemaTypes";
import { axiosError } from "@/lib/utils";
import type { ActionFunctionArgs } from "react-router";

export const contactUsApi = async ({ request, params }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const formDataObj = contactSchema.parse(Object.fromEntries(formData));
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
        message:
          error instanceof Error ? error.message : "An unexpected error occurred",
      },
    };
  }
};
