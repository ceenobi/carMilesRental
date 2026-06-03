import { Request, Response } from "express";
import tryCatchWrapper from "../lib/tryCatchWrapper.js";
import User from "../models/user.js";
import Booking, { IBooking } from "../models/booking.js";
import { sendTsRestSuccess } from "../lib/responseHandler.js";

export const getCustomers = tryCatchWrapper(
  async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const query = (req.query.query as string | undefined) || "";
    const matchStage: any = {};
    if (query) {
      const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = { $regex: escapedQuery, $options: "i" };
      matchStage.$or = [{ fullname: regex }, { email: regex }];
    }
    const customers = await User.find(matchStage)
      .lean()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    const total = await User.countDocuments(matchStage);
    //get bookings for each customer
    const bookings = await Booking.find({
      userId: { $in: customers.map((c) => c._id) },
    });
    const getTotalSpent = (bookings: IBooking[]) => {
      return bookings.reduce((acc, booking) => acc + booking.grandTotal, 0);
    };
    const lastBookingDate = (bookings: IBooking[]) => {
      return bookings.length ? bookings[bookings.length - 1].dropOffDate : null;
    };

    const customersWithBookings = customers.map((customer) => {
      const customerBookings = bookings.filter((booking) =>
        booking.userId.equals(customer._id),
      );
      return {
        ...customer,
        totalBookings: customerBookings.length,
        totalSpent: getTotalSpent(customerBookings),
        lastBookingDate: lastBookingDate(customerBookings),
      };
    });

    return sendTsRestSuccess(res, 200, {
      success: true,
      message: "Bookings found",
      body: {
        customers: customersWithBookings,
        meta: {
          currentPage: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit)),
          hasMore: (page - 1) * limit + customers.length < total,
        },
      },
    });
  },
);
