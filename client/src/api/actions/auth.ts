import {
  loginSchema,
  registerSchema,
  resendOtpSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  type resendOtpSchemaType,
} from "@/lib/schemaTypes";
import axiosClient from "../../lib/axiosClient";
import { axiosError } from "@/lib/utils";
import { data, type ActionFunctionArgs } from "react-router";

export const registerUserApi = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const formDataObj = registerSchema.parse(Object.fromEntries(formData));
  try {
    const res = await axiosClient.post("/auth/register", formDataObj);
    return res;
  } catch (error) {
    const errorResponse = axiosError(error);
    if (errorResponse) {
      return errorResponse;
    }
    // Network or other errors
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

export const loginUserApi = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const formDataObj = loginSchema.parse(Object.fromEntries(formData));
  try {
    const res = await axiosClient.post("/auth/login", formDataObj);
    const setCookieHeader = res.headers["set-cookie"];
    const headers: Record<string, string> = {};
    if (setCookieHeader) {
      headers["Set-Cookie"] = Array.isArray(setCookieHeader)
        ? setCookieHeader.join(", ")
        : setCookieHeader;
    }
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

export const verifyEmailApi = async ({ request }: ActionFunctionArgs) => {
  const url = new URL(request.url);
  const email = url.searchParams.get("email") || "";
  const formData = await request.formData();
  const formDataObj = verifyEmailSchema.parse(Object.fromEntries(formData));
  try {
    const res = await axiosClient.post(
      `/auth/verify-email?email=${email}`,
      formDataObj,
    );
    const setCookieHeader = res.headers["set-cookie"];
    const headers: Record<string, string> = {};
    if (setCookieHeader) {
      headers["Set-Cookie"] = Array.isArray(setCookieHeader)
        ? setCookieHeader.join(", ")
        : setCookieHeader;
    }
    return res;
  } catch (error) {
    const errorResponse = axiosError(error);
    if (errorResponse) {
      return errorResponse;
    }
    // Network or other errors
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

export const resendOtpApi = async (data: resendOtpSchemaType) => {
  try {
    const res = await axiosClient.post("/auth/resend", data);
    return res;
  } catch (error) {
    const errorResponse = axiosError(error);
    if (errorResponse) {
      return errorResponse;
    }
    // Network or other errors
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

export const requestPasswordResetApi = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const formDataObj = resendOtpSchema.parse(Object.fromEntries(formData));
  try {
    const res = await axiosClient.post(
      "/auth/request-password-reset",
      formDataObj,
    );
    return res;
  } catch (error) {
    const errorResponse = axiosError(error);
    if (errorResponse) {
      return errorResponse;
    }
    // Network or other errors
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

export const resetPasswordApi = async ({ request }: ActionFunctionArgs) => {
  const url = new URL(request.url);
  const email = url.searchParams.get("email") || "";
  const formData = await request.formData();
  const formDataObj = resetPasswordSchema.parse(Object.fromEntries(formData));
  try {
    const res = await axiosClient.patch(
      `/auth/reset-password?email=${email}`,
      formDataObj,
    );
    return res;
  } catch (error) {
    const errorResponse = axiosError(error);
    if (errorResponse) {
      return errorResponse;
    }
    // Network or other errors
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

export const logoutApi = async () => {
  try {
    const res = await axiosClient.post(`/auth/logout`, {});
    const setCookieHeader = res.headers["set-cookie"];
    const headers: Record<string, string> = {};
    if (setCookieHeader) {
      headers["Set-Cookie"] = Array.isArray(setCookieHeader)
        ? setCookieHeader.join(", ")
        : setCookieHeader;
    }
    // Forward the Set-Cookie header to clear the browser cookie
    return data({ success: true }, { headers });
  } catch (error) {
    const errorResponse = axiosError(error);
    if (errorResponse) {
      return errorResponse;
    }
    // Network or other errors
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
