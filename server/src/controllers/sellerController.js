import Inquiry from "../models/Inquiry.js";
import Property from "../models/Property.js";

export const getSellerInquiries = async (req, res, next) => {
  try {
    const filters = { seller: req.user._id };

    if (req.query.status) {
      filters.status = req.query.status;
    }

    if (req.query.propertyId) {
      filters.property = req.query.propertyId;
    }

    const inquiries = await Inquiry.find(filters)
      .populate("property", "title location.city location.locality price")
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
      return res.status(400).json({ success: false, message: "Invalid inquiry status." });
    }

    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
      return res.status(404).json({ success: false, message: "Inquiry not found." });
    }

    if (inquiry.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not allowed to update this inquiry." });
    }

    inquiry.status = status;
    await inquiry.save();

    return res.json({ success: true, message: "Inquiry updated.", data: inquiry });
  } catch (error) {
    return next(error);
  }
};

export const getSellerAnalytics = async (req, res, next) => {
  try {
    const sellerId = req.user._id;

    const [
      totalProperties,
      approvedProperties,
      pendingProperties,
      soldProperties,
      totalViewsData,
      totalInquiries,
      newInquiries
    ] = await Promise.all([
      Property.countDocuments({ seller: sellerId }),
      Property.countDocuments({ seller: sellerId, listingStatus: "approved" }),
      Property.countDocuments({ seller: sellerId, listingStatus: "pending" }),
      Property.countDocuments({ seller: sellerId, isSold: true }),
      Property.aggregate([
        { $match: { seller: sellerId } },
        { $group: { _id: null, views: { $sum: "$views" } } }
      ]),
      Inquiry.countDocuments({ seller: sellerId }),
      Inquiry.countDocuments({ seller: sellerId, status: "new" })
    ]);

    return res.json({
      success: true,
      data: {
        totalProperties,
        approvedProperties,
        pendingProperties,
        soldProperties,
        totalViews: totalViewsData[0]?.views || 0,
        totalInquiries,
        newInquiries
      }
    });
  } catch (error) {
    return next(error);
  }
};
