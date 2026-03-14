import Inquiry from "../models/Inquiry.js";
import Property from "../models/Property.js";
import { AppError } from "../middleware/errorHandler.js";

export const createInquiry = async (req, res, next) => {
  try {
    const { name, phone, email = "", message = "" } = req.body;

    if (!name || !phone) {
      throw new AppError(400, "Name and phone are required.");
    }

    const property = await Property.findById(req.params.id);
    if (!property) {
      throw new AppError(404, "Property not found.");
    }

    if (property.status !== "approved") {
      throw new AppError(400, "Inquiries are allowed only for approved properties.");
    }

    const inquiry = await Inquiry.create({
      property: property._id,
      agent: property.agent,
      buyer: req.user?._id || null,
      name: String(name).trim(),
      phone: String(phone).trim(),
      email: String(email || "").trim().toLowerCase(),
      message: String(message || "").trim()
    });

    const populated = await Inquiry.findById(inquiry._id)
      .populate("property", "title city location price status")
      .populate("agent", "name email phone role")
      .populate("buyer", "name email phone role");

    return res.status(201).json({
      success: true,
      message: "Inquiry submitted successfully.",
      data: populated
    });
  } catch (error) {
    return next(error);
  }
};

export const getInquiries = async (req, res, next) => {
  try {
    const filters = {};

    if (req.user.role === "agent") {
      filters.agent = req.user._id;
    } else if (req.user.role === "buyer") {
      filters.buyer = req.user._id;
    }

    if (req.query.status) {
      filters.status = req.query.status;
    }

    const inquiries = await Inquiry.find(filters)
      .populate("property", "title city location price status")
      .populate("agent", "name email phone role")
      .populate("buyer", "name email phone role")
      .sort({ createdAt: -1 });

    return res.json({ success: true, data: inquiries });
  } catch (error) {
    return next(error);
  }
};

export const updateInquiryStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!["new", "contacted", "closed"].includes(status)) {
      throw new AppError(400, "Invalid inquiry status.");
    }

    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) {
      throw new AppError(404, "Inquiry not found.");
    }

    if (req.user.role === "agent" && inquiry.agent.toString() !== req.user._id.toString()) {
      throw new AppError(403, "Not allowed to update this inquiry.");
    }

    inquiry.status = status;
    await inquiry.save();

    const populated = await Inquiry.findById(inquiry._id)
      .populate("property", "title city location price status")
      .populate("agent", "name email phone role")
      .populate("buyer", "name email phone role");

    return res.json({
      success: true,
      message: "Inquiry status updated.",
      data: populated
    });
  } catch (error) {
    return next(error);
  }
};
