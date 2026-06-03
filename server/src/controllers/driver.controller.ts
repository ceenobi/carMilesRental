import Driver from "../models/driver.js";
import tryCatchWrapper from "../lib/tryCatchWrapper.js";
import { sendTsRestError, sendTsRestSuccess } from "../lib/responseHandler.js";
import { Request, Response } from "express";
import Booking from "src/models/booking.js";
import timeline from "src/models/timeline.js";

export const createDriver = tryCatchWrapper(
  async (req: Request, res: Response) => {
    const findDriver = await Driver.findOne({
      email: req.body.email,
      license: req.body.license,
      phone: req.body.phone,
    }).lean();
    if (findDriver) {
      return sendTsRestError(res, 400, "Driver already exists");
    }
    const driver = await Driver.create(req.body);
    return sendTsRestSuccess(res, 201, {
      success: true,
      message: "Driver created successfully",
      body: driver,
    });
  },
);

export const getAllDrivers = tryCatchWrapper(
  async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const query = (req.query.query as string | undefined) || "";
    const status = req.query.status as string | undefined;

    const matchStage: any = {
      ...(status && { status }),
    };

    if (query) {
      const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = { $regex: escapedQuery, $options: "i" };

      matchStage.$or = [
        { fullname: regex },
        { email: regex },
        { phone: regex },
        { license: regex },
      ];
    }

    const drivers = await Driver.find(matchStage)
      .lean()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Driver.countDocuments(matchStage);

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const stats = await Driver.aggregate([
      {
        $facet: {
          overallStats: [
            { $match: matchStage },
            {
              $group: {
                _id: null,
                all: { $sum: 1 },
                active: {
                  $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] },
                },
                inactive: {
                  $sum: { $cond: [{ $eq: ["$status", "inactive"] }, 1, 0] },
                },
                available: {
                  $sum: { $cond: [{ $eq: ["$status", "available"] }, 1, 0] },
                },
                "off-duty": {
                  $sum: { $cond: [{ $eq: ["$status", "off-duty"] }, 1, 0] },
                },
                averageRating: { $avg: "$rating" },
              },
            },
          ],
          availableToday: [
            {
              $match: {
                status: "available",
                updatedAt: { $gte: startOfDay },
              },
            },
            { $count: "count" },
          ],
        },
      },
    ]);

    const driverStats = stats[0]?.overallStats[0] || {
      all: 0,
      active: 0,
      inactive: 0,
      available: 0,
      "off-duty": 0,
      averageRating: 0,
    };

    const availableTodayCount = stats[0]?.availableToday[0]?.count || 0;

    return sendTsRestSuccess(res, 200, {
      success: true,
      message: "Drivers found",
      body: {
        drivers,
        stats: {
          ...driverStats,
          availableToday: availableTodayCount,
        },
        meta: {
          currentPage: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit)),
          hasMore: (page - 1) * limit + drivers.length < total,
        },
      },
    });
  },
);

export const getADriver = tryCatchWrapper(
  async (req: Request, res: Response) => {
    const { driverId } = req.params;
    const driver = await Driver.findById(driverId)
      .populate("userId", "fullname email phone")
      .lean();
    if (!driver) {
      return sendTsRestError(res, 404, "Driver not found");
    }
    return sendTsRestSuccess(res, 200, {
      success: true,
      message: "Driver found",
      body: driver,
    });
  },
);

export const assignDriver = tryCatchWrapper(
  async (req: Request, res: Response) => {
    const { driverId, bookingId } = req.body;
    if (!driverId || !bookingId) {
      return sendTsRestError(res, 400, "DriverId and bookingId are required");
    }
    const driver = await Driver.findById(driverId).lean();
    if (!driver || !driver.isVerified) {
      return sendTsRestError(res, 404, `${!driver ? "Driver not found" : "Driver not verified"}`);
    }
    if(driver.status === "off-duty" || driver.status === "booked") {
      return sendTsRestError(res, 400, "Driver is off-duty or booked");
    }
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return sendTsRestError(res, 404, "Booking not found");
    }
    if (booking.status === "completed" || booking.status === "cancelled") {
      return sendTsRestError(
        res,
        400,
        "Booking is either completed or cancelled, unable to assign driver",
      );
    }
    booking.driverId = driverId;
    await booking.save();
    await Driver.findByIdAndUpdate(
      driverId,
      {
        status: "active",
      },
      { returnDocument: "after" },
    );
    await timeline.create({
      bookingId: booking._id,
      status: "created",
      title: "Driver Assigned",
      description: "A driver has been assigned to the booking.",
      actor: "System",
    });
    return sendTsRestSuccess(res, 200, {
      success: true,
      message: "Driver assigned to booking",
      body: booking,
    });
  },
);
