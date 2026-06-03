import Car from "../models/car.js";
import Booking from "../models/booking.js";
import tryCatchWrapper from "../lib/tryCatchWrapper.js";
import { sendTsRestError, sendTsRestSuccess } from "../lib/responseHandler.js";
import { Request, Response, NextFunction } from "express";
import { generatePlateNumber, generateSlug } from "../lib/utils.js";

export const addCar = tryCatchWrapper(async (req: Request, res: Response) => {
  const carExists = await Car.findOne({ name: req.body.name }).lean();
  if (carExists) {
    return sendTsRestError(res, 400, "Car already exists");
  }
  const slug = generateSlug(req.body.name);
  const car = await Car.create({
    ...req.body,
    slug,
    plateNum: generatePlateNumber(),
  });
  return sendTsRestSuccess(res, 201, {
    success: true,
    message: "Car added successfully to database",
    body: car,
  });
});

export const getCars = tryCatchWrapper(async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const query = req.query.query as string | undefined;
  // const status = req.query.status as string | undefined;
  const category = req.query.category as string | undefined;
  const type = req.query.type as string | undefined;
  const matchStage: any = {
    ...(category && { category }),
    ...(type && { type }),
    status: "open",
  };
  if (query) {
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    matchStage.$or = [
      { name: { $regex: escapedQuery, $options: "i" } },
      { brand: { $regex: escapedQuery, $options: "i" } },
      { summary: { $regex: escapedQuery, $options: "i" } },
    ];
  }
  const cars = await Car.find(matchStage)
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 })
    .lean();

  const total = await Car.countDocuments(matchStage);

  //additional tasks
  //get total number of cars based on their status
  const [totalBooked, totalOpen, totalUnavailable, totalReserved] =
    await Promise.all([
      Car.countDocuments({ status: "booked" }),
      Car.countDocuments({ status: "open" }),
      Car.countDocuments({ status: "unavailable" }),
      Car.countDocuments({ status: "reserved" }),
    ]);

  //calc car utilization rate per month based on number of booking trips completed / total number of months
  const [totalCompletedTrips, firstBooking] = await Promise.all([
    Booking.countDocuments({ status: "completed" }),
    Booking.findOne().sort({ createdAt: 1 }).select("createdAt").lean(),
  ]);

  const totalMonths = firstBooking
    ? Math.max(
        1,
        Math.ceil(
          (new Date().getTime() - new Date(firstBooking.createdAt).getTime()) /
            (1000 * 60 * 60 * 24 * 30),
        ),
      )
    : 1;

  const utilizationRate = Number(
    (totalCompletedTrips / totalMonths).toFixed(2),
  );

  return sendTsRestSuccess(res, 200, {
    success: true,
    message: "Cars retrieved successfully",
    body: {
      cars,
      stats: {
        totalBooked,
        totalOpen,
        totalUnavailable,
        totalReserved,
        utilizationRate,
      },
      meta: {
        currentPage: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
        hasMore: (page - 1) * limit + cars.length < total,
      },
    },
  });
});

export const getACar = tryCatchWrapper(async (req: Request, res: Response) => {
  const { slug } = req.params;
  if (!slug) {
    return sendTsRestError(res, 400, "Slug params is required");
  }
  const car = await Car.findOne({ slug }).lean();
  if (!car) {
    return sendTsRestError(res, 400, "Car not found");
  }
  return sendTsRestSuccess(res, 200, {
    success: true,
    message: "Car retrieved",
    body: car,
  });
});

export const getTrendingCars = tryCatchWrapper(
  async (req: Request, res: Response) => {
    const limit = Number(req.query.limit) || 3;
    const [trendingCars, cars] = await Promise.all([
      Car.find({
        status: "open",
        rating: { $gte: 4 },
      })
        .lean()
        .sort({ rating: -1, createdAt: -1 })
        .limit(limit),
      Car.find({ status: "open" })
        .lean()
        .select("slug name price serviceFee plateNum"),
    ]);
    return sendTsRestSuccess(res, 200, {
      success: true,
      message: "Trending cars retrieved",
      body: {
        trendingCars,
        cars,
      },
    });
  },
);
