import mongoose from "mongoose";
import { Inquiry } from "../models/Inquiry.js";
import { Property } from "../models/Property.js";
import { Report } from "../models/Report.js";
import { Review } from "../models/Review.js";
import { User } from "../models/User.js";

export const getDashboardStats = async (req, res) => {
  const [
    totalProperties,
    availableProperties,
    totalLeads,
    openReports,
    totalUsers,
    totalReviews,
    topViewed
  ] = await Promise.all([
    Property.countDocuments(),
    Property.countDocuments({ availabilityStatus: "Available" }),
    Inquiry.countDocuments(),
    Report.countDocuments({ status: "open" }),
    User.countDocuments(),
    Review.countDocuments(),
    Property.find().sort({ views: -1 }).limit(6)
  ]);

  const leadsByType = await Inquiry.aggregate([
    { $group: { _id: "$leadType", count: { $sum: 1 } } }
  ]);

  const viewsByType = await Property.aggregate([
    { $group: { _id: "$propertyType", views: { $sum: "$views" } } },
    { $sort: { views: -1 } }
  ]);

  return res.json({
    totals: {
      totalProperties,
      availableProperties,
      totalLeads,
      openReports,
      totalUsers,
      totalReviews
    },
    leadsByType,
    viewsByType,
    topViewed
  });
};

export const healthCheck = (req, res) => {
  res.json({
    status: "ok",
    mongoState: mongoose.connection.readyState,
    timestamp: new Date().toISOString()
  });
};
