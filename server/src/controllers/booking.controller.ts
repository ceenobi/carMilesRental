import { Request, Response, NextFunction } from "express";
import Booking from "../models/booking.js";
import Car from "../models/car.js";
import User from "../models/user.js";
import tryCatchWrapper from "../lib/tryCatchWrapper.js";
import { sendTsRestError, sendTsRestSuccess } from "../lib/responseHandler.js";
import emailService from "../email/send-email.js";
import Payment from "../models/payment.js";
import Timeline from "../models/timeline.js";

export const bookRide = tryCatchWrapper(async (req: Request, res: Response) => {
  const { carId } = req.body;
  const car = await Car.findById(carId).lean();

  if (!car) {
    return sendTsRestError(res, 404, "Car not found");
  }
  if (car.status === "booked" || car.status === "unavailable") {
    return sendTsRestError(res, 400, "Car is either booked or unavailable");
  }

  const user = await User.findById(req.session?.userId).lean();
  if (!user) {
    return sendTsRestError(
      res,
      404,
      "User not found, Please login to book a car",
    );
  }

  const pickUpDate = new Date(req.body.pickUpDate);
  const dropOffDate = new Date(req.body.dropOffDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (pickUpDate < today || dropOffDate < today) {
    return sendTsRestError(
      res,
      400,
      "Pick up and drop off date cannot be in the past",
    );
  }
  if (dropOffDate < pickUpDate) {
    return sendTsRestError(
      res,
      400,
      "Drop off date cannot be before pick up date",
    );
  }

  const days = Math.max(
    1,
    Math.ceil(
      (new Date(req.body.dropOffDate).getTime() -
        new Date(req.body.pickUpDate).getTime()) /
        (1000 * 60 * 60 * 24),
    ),
  );
  const rentalTotal = car.price * days;
  const serviceFee = car.serviceFee;
  const driverTotal = req.body.addDriver ? 10000 * days : 0;
  const grandTotal = rentalTotal + serviceFee + driverTotal;

  const booking = await Booking.create({
    userId: user._id,
    carId,
    rentalDays: days,
    rentalTotal,
    grandTotal,
    ...req.body,
  });

  await Timeline.create({
    bookingId: booking._id,
    status: "created",
    title: "Booking Created",
    description: "The booking has been created successfully.",
    actor: "System",
  });

  await emailService.sendBookingConfirmationEmail({
    email: user.email,
    fullname: user.fullname,
    carName: car.name,
    carType: car.type,
    pickUpLocation: req.body.pickUpLocation,
    dropOffLocation: req.body.dropOffLocation,
    pickUpDate: new Date(req.body.pickUpDate).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    dropOffDate: new Date(req.body.dropOffDate).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    pickUpTime: req.body.pickUpTime,
    dropOffTime: req.body.dropOffTime,
    rentalTotal: rentalTotal.toLocaleString("en-NG", {
      style: "currency",
      currency: "NGN",
    }),
    serviceFee: serviceFee.toLocaleString("en-NG", {
      style: "currency",
      currency: "NGN",
    }),
    grandTotal: grandTotal.toLocaleString("en-NG", {
      style: "currency",
      currency: "NGN",
    }),
    addDriver: req.body.addDriver,
  });

  return sendTsRestSuccess(res, 201, {
    success: true,
    message: "Car booking successful",
    body: booking,
  });
});

export const getABooking = tryCatchWrapper(
  async (req: Request, res: Response) => {
    const { bookingId } = req.params;
    const userId = req.session?.userId;
    const [booking, payment, timeline] = await Promise.all([
      Booking.findOne({ _id: bookingId, userId })
        .populate("carId", "media name slug plateNum status type price")
        .populate("userId", "fullname email phone")
        .populate("driverId", "fullname phone email")
        .lean(),
      Payment.findOne({ bookingId }).lean(),
      Timeline.find({ bookingId }).sort({ createdAt: -1 }).lean(),
    ]);

    if (!booking) {
      return sendTsRestError(res, 404, "Booking not found");
    }
    return sendTsRestSuccess(res, 200, {
      success: true,
      message: "Booking found",
      body: {
        booking,
        payment,
        timeline,
      },
    });
  },
);

export const getUserBookings = tryCatchWrapper(
  async (req: Request, res: Response) => {
    const userId = req.session?.userId;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const bookings = await Booking.find({ userId })
      .populate("carId", "media name slug status plateNum")
      .populate("driverId", "fullname phone email")
      .lean()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    const total = await Booking.countDocuments({ userId });
    return sendTsRestSuccess(res, 200, {
      success: true,
      message: "Bookings found",
      body: {
        bookings,
        meta: {
          currentPage: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit)),
          hasMore: (page - 1) * limit + bookings.length < total,
        },
      },
    });
  },
);

//admin section
export const getAllBookings = tryCatchWrapper(
  async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const query = (req.query.query as string | undefined) || "";
    const status = req.query.status as string | undefined;
    const pickUpDate = req.query.pickUpDate as string | undefined;
    const dropOffDate = req.query.dropOffDate as string | undefined;
    const pickUpTime = req.query.pickUpTime as string | undefined;
    const dropOffTime = req.query.dropOffTime as string | undefined;

    const matchStage: any = {
      ...(status && { status }),
    };

    if (pickUpDate) {
      matchStage.pickUpDate = {
        $gte: new Date(pickUpDate),
        $lte: new Date(new Date(pickUpDate).setHours(23, 59, 59, 999)),
      };
    }
    if (dropOffDate) {
      matchStage.dropOffDate = {
        $gte: new Date(dropOffDate),
        $lte: new Date(new Date(dropOffDate).setHours(23, 59, 59, 999)),
      };
    }
    if (pickUpTime) matchStage.pickUpTime = pickUpTime;
    if (dropOffTime) matchStage.dropOffTime = dropOffTime;
    if (query) {
      const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = { $regex: escapedQuery, $options: "i" };

      // Find matching users and cars first to support cross-model search
      const [users, cars] = await Promise.all([
        User.find({ fullname: regex }).select("_id").lean(),
        Car.find({ $or: [{ name: regex }, { plateNum: regex }] })
          .select("_id")
          .lean(),
      ]);

      const userIds = users.map((u) => u._id);
      const carIds = cars.map((c) => c._id);

      matchStage.$or = [
        { pickUpLocation: regex },
        { dropOffLocation: regex },
        { userId: { $in: userIds } },
        { carId: { $in: carIds } },
      ];
    }
    const bookings = await Booking.find(matchStage)
      .populate("userId", "fullname email phone")
      .populate("carId", "media name slug status plateNum")
      .lean()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Booking.countDocuments(matchStage);

    const stats = await Booking.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          all: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
          },
          pending: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] } },
          cancelled: {
            $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] },
          },
          failed: { $sum: { $cond: [{ $eq: ["$status", "failed"] }, 1, 0] } },
          upcoming: {
            $sum: { $cond: [{ $eq: ["$status", "upcoming"] }, 1, 0] },
          },
          ongoing: { $sum: { $cond: [{ $eq: ["$status", "ongoing"] }, 1, 0] } },
        },
      },
    ]);

    const bookingStats = stats[0] || {
      all: 0,
      completed: 0,
      pending: 0,
      cancelled: 0,
      failed: 0,
      upcoming: 0,
      ongoing: 0,
    };

    return sendTsRestSuccess(res, 200, {
      success: true,
      message: "Bookings found",
      body: {
        bookings,
        stats: bookingStats,
        meta: {
          currentPage: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit)),
          hasMore: (page - 1) * limit + bookings.length < total,
        },
      },
    });
  },
);

export const adminBookRide = tryCatchWrapper(
  async (req: Request, res: Response) => {
    const { carId, email } = req.body;
    const car = await Car.findById(carId).lean();
    const user = await User.findOne({ email }).lean();
    if (!car) {
      return sendTsRestError(res, 404, "Car not found");
    }
    if (!user) {
      return sendTsRestError(res, 404, "Account not found");
    }
    if (["unavailable", "booked", "reserved"].includes(car.status)) {
      return sendTsRestError(res, 400, "Car is either booked or unavailable");
    }
    const pickUpDate = new Date(req.body.pickUpDate);
    const dropOffDate = new Date(req.body.dropOffDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (pickUpDate < today || dropOffDate < today) {
      return sendTsRestError(
        res,
        400,
        "Pick up and drop off date cannot be in the past",
      );
    }
    if (dropOffDate < pickUpDate) {
      return sendTsRestError(
        res,
        400,
        "Drop off date cannot be before pick up date",
      );
    }

    const days = Math.ceil(
      (new Date(req.body.dropOffDate).getTime() -
        new Date(req.body.pickUpDate).getTime()) /
        (1000 * 60 * 60 * 24),
    );
    const rentalTotal = car.price * days;
    const serviceFee = car.serviceFee;
    const driverTotal = req.body.addDriver ? 10000 * days : 0;
    const grandTotal = rentalTotal + serviceFee + driverTotal;

    const booking = await Booking.create({
      userId: user._id,
      carId,
      rentalDays: days,
      rentalTotal,
      grandTotal,
      paymentStatus: "pending",
      status: "pending",
      ...req.body,
    });
    await Car.findByIdAndUpdate(carId, {
      status: "reserved",
    });

    //create payment
    await Payment.create({
      bookingId: booking._id,
      userId: user._id,
      carId: car._id,
      amount: grandTotal,
      status: "pending",
      paidAt: new Date(),
      paymentMethod: req.body.paymentMethod,
      reference: "RF" + Math.random().toString(36).substring(2, 9),
    });

    await emailService.sendBookingConfirmationEmail({
      email: user.email,
      fullname: user.fullname,
      carName: car.name,
      carType: car.type,
      pickUpLocation: req.body.pickUpLocation,
      dropOffLocation: req.body.dropOffLocation,
      pickUpDate: new Date(req.body.pickUpDate).toLocaleDateString("en-NG", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      dropOffDate: new Date(req.body.dropOffDate).toLocaleDateString("en-NG", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      pickUpTime: req.body.pickUpTime,
      dropOffTime: req.body.dropOffTime,
      rentalTotal: rentalTotal.toLocaleString("en-NG", {
        style: "currency",
        currency: "NGN",
      }),
      serviceFee: serviceFee.toLocaleString("en-NG", {
        style: "currency",
        currency: "NGN",
      }),
      grandTotal: grandTotal.toLocaleString("en-NG", {
        style: "currency",
        currency: "NGN",
      }),
      addDriver: req.body.addDriver,
    });

    return sendTsRestSuccess(res, 201, {
      success: true,
      message: "Car booking successful",
      body: booking,
    });
  },
);

export const cancelBooking = tryCatchWrapper(
  async (req: Request, res: Response) => {
    const bookingId = req.body.bookingId || req.params.bookingId;
    const userRole = req.session.role;
    const userId = req.session.userId;

    if (!bookingId) {
      return sendTsRestError(res, 400, "Booking ID is required");
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return sendTsRestError(res, 404, "Booking not found");
    }

    const isAdmin = userRole === "admin";

    if (!isAdmin) {
      if (booking.userId.toString() !== userId) {
        return sendTsRestError(
          res,
          403,
          "You do not have permission to cancel this booking",
        );
      }

      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      if (new Date(booking.createdAt) < twentyFourHoursAgo) {
        return sendTsRestError(
          res,
          400,
          "Bookings can only be cancelled within 24 hours of creation. Please speak to an admin for assistance",
        );
      }
    }

    // Status validations
    if (booking.status === "completed") {
      return sendTsRestError(res, 400, "Booking is already completed");
    }
    if (booking.status === "cancelled") {
      return sendTsRestError(res, 400, "Booking is already cancelled");
    }
    if (booking.status === "ongoing") {
      return sendTsRestError(res, 400, "Booking is already ongoing");
    }

    booking.status = "cancelled";
    await booking.save();

    await Timeline.create({
      bookingId: booking._id,
      status: "cancelled",
      title: "Booking Cancelled",
      description: isAdmin
        ? "The booking was cancelled by an admin."
        : "The booking was cancelled by the customer.",
      actor: isAdmin ? "Admin" : "Customer",
    });
    return sendTsRestSuccess(res, 200, {
      success: true,
      message: "Booking cancelled successfully",
      body: booking,
    });
  },
);

export const markCompleted = tryCatchWrapper(
  async (req: Request, res: Response) => {
    const bookingId = req.body.bookingId || req.params.bookingId;

    if (!bookingId) {
      return sendTsRestError(res, 400, "Booking ID is required");
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return sendTsRestError(res, 404, "Booking not found");
    }

    if (booking.status === "completed") {
      return sendTsRestError(res, 400, "Booking is already completed");
    }
    if (booking.status === "cancelled") {
      return sendTsRestError(res, 400, "Cannot complete a cancelled booking");
    }

    const now = new Date();
    const dropOffDate = new Date(booking.dropOffDate);
    if (now < dropOffDate) {
      return sendTsRestError(
        res,
        400,
        "Booking cannot be completed before the drop-off date has elapsed",
      );
    }

    booking.status = "completed";
    await booking.save();

    // Mark the car as available again
    const car = await Car.findById(booking.carId);
    if (car) {
      car.status = "open";
      car.trips += 1;
      await car.save();
    }

    await Timeline.create({
      bookingId: booking._id,
      status: "completed",
      title: "Booking Completed",
      description: "The booking has been marked as completed by an admin.",
      actor: "Admin",
    });

    return sendTsRestSuccess(res, 200, {
      success: true,
      message: "Booking marked as completed",
      body: booking,
    });
  },
);
