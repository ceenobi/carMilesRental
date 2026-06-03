import { Request, Response } from "express";
import tryCatchWrapper from "../lib/tryCatchWrapper.js";
import Booking from "../models/booking.js";
import Car from "../models/car.js";
import Driver from "../models/driver.js";
import Payment from "../models/payment.js";
import User from "../models/user.js";
import { sendTsRestSuccess } from "../lib/responseHandler.js";

export const getDashboardStats = tryCatchWrapper(async (req: Request, res: Response) => {
  const [
    totalRevenueData,
    totalBookings,
    totalCars,
    totalDrivers,
    totalCustomers,
    revenueOverview,
    fleetStatus,
    topVehicles,
    recentBookings
  ] = await Promise.all([
    // Total Revenue
    Payment.aggregate([
      { $match: { status: "success" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]),
    // Total Bookings
    Booking.countDocuments(),
    // Total Cars
    Car.countDocuments(),
    // Total Drivers
    Driver.countDocuments(),
    // Total Customers (Users with role 'customer')
    User.countDocuments({ role: "customer" }),
    // Revenue Overview (Last 6 months)
    Payment.aggregate([
      { $match: { status: "success", paidAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)) } } },
      {
        $group: {
          _id: {
            month: { $month: "$paidAt" },
            year: { $year: "$paidAt" }
          },
          revenue: { $sum: "$amount" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]),
    // Fleet Status
    Car.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]),
    // Top Vehicles by Revenue
    Booking.aggregate([
      { $match: { status: "completed" } },
      {
        $group: {
          _id: "$carId",
          revenue: { $sum: "$grandTotal" },
          trips: { $sum: 1 }
        }
      },
      { $sort: { revenue: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "car", // Note: the collection name is 'car' in the model definition
          localField: "_id",
          foreignField: "_id",
          as: "carDetails"
        }
      },
      { $unwind: "$carDetails" },
      {
        $project: {
          name: "$carDetails.name",
          revenue: 1,
          trips: 1
        }
      }
    ]),
    // Recent Bookings
    Booking.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("userId", "fullname email")
      .populate("carId", "name")
  ]);

  const stats = {
    summary: {
      totalRevenue: totalRevenueData[0]?.total || 0,
      totalBookings,
      totalCars,
      totalDrivers,
      totalCustomers
    },
    revenueOverview: revenueOverview.map(item => ({
      month: new Date(0, item._id.month - 1).toLocaleString("default", { month: "short" }),
      revenue: item.revenue
    })),
    fleetStatus: fleetStatus.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {} as Record<string, number>),
    topVehicles,
    recentBookings: recentBookings.map(booking => ({
      id: booking._id,
      customer: (booking.userId as any)?.fullname || "Unknown",
      car: (booking.carId as any)?.name || "Unknown Car",
      amount: booking.grandTotal,
      status: booking.status,
      date: booking.createdAt
    }))
  };

  return sendTsRestSuccess(res, 200, {
    success: true,
    message: "Dashboard stats fetched successfully",
    body: stats
  });
});
