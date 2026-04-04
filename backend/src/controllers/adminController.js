import mongoose from "mongoose";
import { Alert } from "../models/Alert.js";
import { Inquiry } from "../models/Inquiry.js";
import { Property } from "../models/Property.js";
import { Report } from "../models/Report.js";
import { Review } from "../models/Review.js";
import { User } from "../models/User.js";

const approvedPropertyFilter = {
  $or: [{ status: "approved" }, { status: { $exists: false } }, { status: null }]
};

const serializeUser = (user) => ({
  id: user._id,
  _id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  isActive: user.isActive !== false,
  createdAt: user.createdAt
});

export const getDashboardStats = async (req, res) => {
  const [
    totalProperties,
    availableProperties,
    totalLeads,
    totalAlerts,
    openReports,
    totalUsers,
    totalReviews,
    topViewed
  ] = await Promise.all([
    Property.countDocuments(),
    Property.countDocuments({ availabilityStatus: "Available" }),
    Inquiry.countDocuments(),
    Alert.countDocuments({ status: "active" }),
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
      totalAlerts,
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

export const getAdminAnalytics = async (req, res) => {
  const [
    totalUsers,
    totalAgents,
    totalProperties,
    pendingProperties,
    approvedProperties,
    totalInquiries
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: "agent" }),
    Property.countDocuments(),
    Property.countDocuments({ status: "pending" }),
    Property.countDocuments(approvedPropertyFilter),
    Inquiry.countDocuments()
  ]);

  return res.json({
    data: {
      totalUsers,
      totalAgents,
      totalProperties,
      pendingProperties,
      approvedProperties,
      totalInquiries
    }
  });
};

export const getUsers = async (req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });

  return res.json({
    items: users.map(serializeUser)
  });
};

export const updateAgentStatus = async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isActive: Boolean(req.body.isActive) },
    { new: true, runValidators: true }
  ).select("-password");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.json({ item: serializeUser(user) });
};

export const getAdminProperties = async (req, res) => {
  const filters = {};

  if (req.query.status) {
    filters.status = req.query.status;
  }

  const properties = await Property.find(filters).sort({ createdAt: -1 });

  return res.json({
    items: properties
  });
};

export const moderateProperty = async (req, res) => {
  const nextStatus = String(req.body.status || "").trim().toLowerCase();

  if (!["pending", "approved", "rejected"].includes(nextStatus)) {
    return res.status(400).json({ message: "Invalid moderation status" });
  }

  const property = await Property.findByIdAndUpdate(
    req.params.id,
    {
      status: nextStatus,
      rejectedReason: nextStatus === "rejected" ? String(req.body.rejectedReason || "").trim() : ""
    },
    { new: true, runValidators: true }
  );

  if (!property) {
    return res.status(404).json({ message: "Property not found" });
  }

  return res.json({ item: property });
};
