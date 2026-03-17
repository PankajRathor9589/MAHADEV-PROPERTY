import Inquiry from "../models/Inquiry.js";
import Property from "../models/Property.js";
import User from "../models/User.js";
import { AppError } from "../middleware/errorHandler.js";

export const getAdminAnalytics = async (req, res, next) => {
  try {
    const [
      totalUsers,
      activeUsers,
      totalAdmins,
      totalProperties,
      approvedProperties,
      pendingProperties,
      rejectedProperties,
      featuredProperties,
      totalInquiries,
      totalFavoritesData,
      monthlyListings
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      User.countDocuments({ role: "admin" }),
      Property.countDocuments(),
      Property.countDocuments({ approvalStatus: "approved" }),
      Property.countDocuments({ approvalStatus: "pending" }),
      Property.countDocuments({ approvalStatus: "rejected" }),
      Property.countDocuments({ isFeatured: true }),
      Inquiry.countDocuments(),
      User.aggregate([
        {
          $project: {
            favoriteCount: { $size: "$favorites" }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$favoriteCount" }
          }
        }
      ]),
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
          totalUsers,
          activeUsers,
          totalAdmins,
          totalProperties,
          approvedProperties,
          pendingProperties,
          rejectedProperties,
          featuredProperties,
          totalInquiries,
          totalFavorites: totalFavoritesData[0]?.total || 0
        },
        monthlyListings: monthlyListings.reverse()
      }
    });
  } catch (error) {
    return next(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const [users, propertyStats, inquiryStats] = await Promise.all([
      User.find().select("name email phone role isActive favorites createdAt").sort({ createdAt: -1 }).lean(),
      Property.aggregate([
        {
          $group: {
            _id: "$postedBy",
            propertyCount: { $sum: 1 },
            approvedCount: {
              $sum: {
                $cond: [{ $eq: ["$approvalStatus", "approved"] }, 1, 0]
              }
            }
          }
        }
      ]),
      Inquiry.aggregate([
        {
          $group: {
            _id: "$owner",
            inquiryCount: { $sum: 1 }
          }
        }
      ])
    ]);

    const propertyMap = new Map(propertyStats.map((item) => [String(item._id), item]));
    const inquiryMap = new Map(inquiryStats.map((item) => [String(item._id), item]));

    const mergedUsers = users.map((user) => {
      const propertyData = propertyMap.get(String(user._id));
      const inquiryData = inquiryMap.get(String(user._id));

      return {
        ...user,
        favoriteCount: user.favorites?.length || 0,
        propertyCount: propertyData?.propertyCount || 0,
        approvedPropertyCount: propertyData?.approvedCount || 0,
        inquiryCount: inquiryData?.inquiryCount || 0
      };
    });

    return res.json({
      success: true,
      data: mergedUsers
    });
  } catch (error) {
    return next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { isActive, role } = req.body;
    const updates = {};

    if (typeof isActive === "boolean") {
      updates.isActive = isActive;
    }

    if (role !== undefined) {
      if (!["user", "admin"].includes(String(role))) {
        throw new AppError(400, "role must be either user or admin.");
      }

      updates.role = String(role);
    }

    if (Object.keys(updates).length === 0) {
      throw new AppError(400, "At least one field is required to update the user.");
    }

    if (String(req.user._id) === String(req.params.id)) {
      if (updates.isActive === false) {
        throw new AppError(400, "You cannot deactivate your own admin account.");
      }

      if (updates.role === "user") {
        throw new AppError(400, "You cannot remove your own admin role.");
      }
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    }).select("name email phone role isActive favorites createdAt");

    if (!updatedUser) {
      throw new AppError(404, "User not found.");
    }

    return res.json({
      success: true,
      message: "User updated successfully.",
      data: updatedUser
    });
  } catch (error) {
    return next(error);
  }
};

export const getAdminProperties = async (req, res, next) => {
  try {
    const { approvalStatus, search } = req.query;
    const filters = {};

    if (approvalStatus) {
      filters.approvalStatus = approvalStatus;
    }

    if (search) {
      const searchRegex = new RegExp(String(search).trim(), "i");
      filters.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { "location.city": searchRegex },
        { "location.state": searchRegex },
        { "location.address": searchRegex }
      ];
    }

    const properties = await Property.find(filters)
      .populate("postedBy", "name email phone role isActive")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      data: properties
    });
  } catch (error) {
    return next(error);
  }
};
