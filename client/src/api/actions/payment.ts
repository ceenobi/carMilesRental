import axiosClient from "@/lib/axiosClient";
import { axiosError } from "@/lib/utils";
import { safeGetItem } from "@/lib/storage";
import { toast } from "sonner";
import type { verifyPaymentSchemaType } from "@/lib/schemaTypes";

export const processBookingApi = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const paymentMethod = formData.get("paymentMethod") as string;
  const amount = formData.get("amount") as string;
  const carId = formData.get("carId") as string;
  const slug = formData.get("slug") as string;

  // Get booking data from localStorage
  const savedBooking = JSON.parse(safeGetItem("bookingData") || "null");
  if (!savedBooking) {
    return {
      status: 400,
      body: {
        success: false,
        message: "Booking data not found. Please start over.",
      },
    };
  }

  // Step 1: Create the booking
  const bookingData = {
    pickUpLocation: savedBooking.pickUpLocation,
    dropOffLocation: savedBooking.dropOffLocation,
    pickUpDate: savedBooking.pickUpDate,
    pickUpTime: savedBooking.pickUpTime,
    dropOffDate: savedBooking.dropOffDate,
    dropOffTime: savedBooking.dropOffTime,
    addDriver: savedBooking.addDriver,
    carId: savedBooking.carId || carId,
    rentalDays: savedBooking.rentalDays,
    rentalTotal: savedBooking.rentalTotal,
    serviceFee: savedBooking.serviceFee,
    grandTotal: savedBooking.grandTotal,
  };

  let bookingId: string;
  try {
    const bookingRes = await axiosClient.post(`/bookings/create`, bookingData);
    if (!bookingRes.data?.body?._id) {
      return {
        status: 400,
        body: {
          success: false,
          message: bookingRes.data?.message || "Failed to create booking",
        },
      };
    }
    bookingId = bookingRes.data.body._id;
  } catch (error) {
    const errorResponse = axiosError(error);
    if (errorResponse) {
      return errorResponse;
    }
    return {
      status: 500,
      body: {
        success: false,
        message: error.message || "Failed to create booking",
      },
    };
  }

  // Step 2: For bank transfer, skip Paystack and go to confirmation
  if (paymentMethod === "pay_with_bank") {
    return {
      status: 200,
      body: {
        success: true,
        message: "Booking created. Please complete bank transfer.",
        paymentMethod: "pay_with_bank",
        bookingId,
      },
    };
  }
  toast.info("Initializing Paystack payment");
  // Step 3: Initialize Paystack payment
  try {
    const paystackRes = await axiosClient.post("/paystack/initialize", {
      amount: Number(amount),
      paymentMethod,
      carId: carId || savedBooking.carId,
      bookingId,
      slug,
    });

    const authorizationUrl = paystackRes.data?.body?.data?.authorization_url;
    const reference = paystackRes.data?.body?.data?.reference;

    if (!authorizationUrl) {
      return {
        status: 400,
        body: {
          success: false,
          message: "Failed to get Paystack authorization URL",
        },
      };
    }

    return {
      status: 200,
      body: {
        success: true,
        message: "Payment initialized",
        paymentMethod: "paystack",
        bookingId,
        authorizationUrl,
        reference,
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
        message: error.message || "Failed to initialize payment",
      },
    };
  }
};

export const verifyPaymentApi = async ({ request }: { request: Request }) => {
  const url = new URL(request.url);
  const reference = url.searchParams.get(
    "reference",
  ) as unknown as verifyPaymentSchemaType;
  try {
    const res = await axiosClient.post("/paystack/verify-payment", {
      reference,
    });
    return {
      status: res.status,
      body: res.data,
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
