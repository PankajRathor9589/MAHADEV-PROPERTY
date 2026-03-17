import Inquiry from "../models/Inquiry.js";
import Property from "../models/Property.js";
import { AppError } from "../middleware/errorHandler.js";

const populateInquiry = (query) =>
  query
    .populate("property", "title listingType price category location images approvalStatus")
    .populate("owner", "name email phone role")
    .populate("buyer", "name email phone role");

export const createInquiry = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id).populate("postedBy", "name email phone role");

    if (!property) {
      throw new AppError(404, "Property not found.");
    }

    if (property.approvalStatus !== "approved") {
      throw new AppError(400, "You can only inquire about approved properties.");
    }

    if (req.user && property.postedBy._id.toString() === req.user._id.toString()) {
      throw new AppError(400, "You cannot send an inquiry to your own property.");
    }

    const name = String(req.body.name || req.user?.name || "").trim();
    const phone = String(req.body.phone || req.user?.phone || "").trim();
    const email = String(req.body.email || req.user?.email || "")
      .trim()
      .toLowerCase();
    const message = String(req.body.message || "").trim();

    if (!name || !phone) {
      throw new AppError(400, "Name and phone are required.");
    }

    const inquiry = await Inquiry.create({
      property: property._id,
      owner: property.postedBy._id,
      buyer: req.user?._id || null,
      name,
      phone,
      email,
      message
    });

    const populatedInquiry = await populateInquiry(Inquiry.findById(inquiry._id));

    return res.status(201).json({
      success: true,
      message: "Inquiry sent successfully.",
      data: populatedInquiry
    });
  } catch (error) {
    return next(error);
  }
};

export const getInquiries = async (req, res, next) => {
  try {
    const { status, scope = "all" } = req.query;
    const filters = {};

    if (req.user.role !== "admin") {
      if (scope === "received") {
        filters.owner = req.user._id;
      } else if (scope === "sent") {
        filters.buyer = req.user._id;
      } else {
        filters.$or = [{ owner: req.user._id }, { buyer: req.user._id }];
      }
    }

    if (status) {
      filters.status = status;
    }

    const inquiries = await populateInquiry(Inquiry.find(filters).sort({ createdAt: -1 }));

    return res.json({
      success: true,
      data: inquiries
    });
  } catch (error) {
    return next(error);
  }
};

export const updateInquiryStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!["new", "contacted", "closed"].includes(String(status))) {
      throw new AppError(400, "Status must be new, contacted, or closed.");
    }

    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) {
      throw new AppError(404, "Inquiry not found.");
    }

    if (req.user.role !== "admin" && inquiry.owner.toString() !== req.user._id.toString()) {
      throw new AppError(403, "You are not allowed to update this inquiry.");
    }

    inquiry.status = String(status);
    await inquiry.save();

    const populatedInquiry = await populateInquiry(Inquiry.findById(inquiry._id));

    return res.json({
      success: true,
      message: "Inquiry status updated.",
      data: populatedInquiry
    });
  } catch (error) {
    return next(error);
  }
};
