import Inquiry from "../models/Inquiry.js";
import Property from "../models/Property.js";
import User from "../models/User.js";
import { AppError } from "../middleware/errorHandler.js";

export const getAdminAnalytics = async (req, res, next) => {
  try {
    const [
      totalProperties,
      approvedProperties,
      pendingProperties,
      rejectedProperties,
      totalAgents,
      totalBuyers,
      totalUsers,
      totalInquiries,
      recentProperties,
      monthlyListings
    ] = await Promise.all([
      Property.countDocuments(),
      Property.countDocuments({ status: "approved" }),
      Property.countDocuments({ status: "pending" }),
      Property.countDocuments({ status: "rejected" }),
      User.countDocuments({ role: "agent" }),
      User.countDocuments({ role: "buyer" }),
      User.countDocuments(),
      Inquiry.countDocuments(),
      Property.find()
        .populate("agent", "name email phone role")
        .sort({ createdAt: -1 })
        .limit(6),
      Property.aggregate([
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" }
            },
            listings: { $sum: 1 }
          }
        },
        { $sort: { "_id.year": -1, "_id.month": -1 } },
        { $limit: 6 },
        {
          $project: {
            _id: 0,
            label: {
              $concat: [
                { $toString: "$_id.year" },
                "-",
                {
                  $cond: [
                    { $lt: ["$_id.month", 10] },
                    { $concat: ["0", { $toString: "$_id.month" }] },
                    { $toString: "$_id.month" }
                  ]
                }
              ]
            },
            listings: 1
          }
        }
      ])
    ]);

    return res.json({
      success: true,
      data: {
        totals: {
          totalProperties,
          approvedProperties,
          pendingProperties,
          rejectedProperties,
          totalAgents,
          totalBuyers,
          totalUsers,
          totalInquiries
        },
        recentProperties,
        monthlyListings: monthlyListings.reverse()
      }
    });
  } catch (error) {
    return next(error);
  }
};

export const getAgents = async (req, res, next) => {
  try {
    const agents = await User.aggregate([
      { $match: { role: "agent" } },
      {
        $lookup: {
          from: "properties",
          localField: "_id",
          foreignField: "agent",
          as: "properties"
        }
      },
      {
        $lookup: {
          from: "inquiries",
          localField: "_id",
          foreignField: "agent",
          as: "inquiries"
        }
      },
      {
        $project: {
          name: 1,
          email: 1,
          phone: 1,
          role: 1,
          isActive: 1,
          createdAt: 1,
          totalProperties: { $size: "$properties" },
          approvedProperties: {
            $size: {
              $filter: {
                input: "$properties",
                as: "property",
                cond: { $eq: ["$$property.status", "approved"] }
              }
            }
          },
          totalInquiries: { $size: "$inquiries" }
        }
      },
      { $sort: { createdAt: -1 } }
    ]);

    return res.json({ success: true, data: agents });
  } catch (error) {
    return next(error);
  }
};

export const updateAgentStatus = async (req, res, next) => {
  try {
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      throw new AppError(400, "isActive boolean is required.");
    }

    const agent = await User.findOneAndUpdate(
      { _id: req.params.id, role: "agent" },
      { isActive },
      { new: true }
    ).select("name email phone role isActive createdAt");

    if (!agent) {
      throw new AppError(404, "Agent not found.");
    }

    return res.json({ success: true, message: "Agent status updated.", data: agent });
  } catch (error) {
    return next(error);
  }
};

export const moderateProperty = async (req, res, next) => {
  try {
    const { status, rejectedReason = "" } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      throw new AppError(400, "Status must be approved or rejected.");
    }

    const property = await Property.findById(req.params.id);
    if (!property) {
      throw new AppError(404, "Property not found.");
    }

    property.status = status;
    property.approvedBy = status === "approved" ? req.user._id : null;
    property.approvedAt = status === "approved" ? new Date() : null;
    property.rejectedReason = status === "rejected" ? String(rejectedReason || "").trim() : "";

    await property.save();

    const populated = await Property.findById(property._id)
      .populate("agent", "name email phone role")
      .populate("approvedBy", "name email role");

    return res.json({
      success: true,
      message: `Property ${status} successfully.`,
      data: populated
    });
  } catch (error) {
    return next(error);
  }
};

export const getModerationQueue = async (req, res, next) => {
  try {
    const filters = {};
    if (req.query.status) {
      filters.status = req.query.status;
    }

    const properties = await Property.find(filters)
      .populate("agent", "name email phone role")
      .populate("approvedBy", "name email role")
      .sort({ createdAt: -1 });

    return res.json({ success: true, data: properties });
  } catch (error) {
    return next(error);
  }
};
