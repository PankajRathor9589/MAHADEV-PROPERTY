import Inquiry from "../models/Inquiry.js";
import Property from "../models/Property.js";
import User from "../models/User.js";

export const getAdminAnalytics = async (req, res, next) => {
  try {
    const [
      totalProperties,
      approvedProperties,
      pendingProperties,
      rejectedProperties,
      soldProperties,
      totalSellers,
      totalUsers,
      totalInquiries,
      recentProperties,
      monthlyListings
    ] = await Promise.all([
      Property.countDocuments(),
      Property.countDocuments({ listingStatus: "approved" }),
      Property.countDocuments({ listingStatus: "pending" }),
      Property.countDocuments({ listingStatus: "rejected" }),
      Property.countDocuments({ isSold: true }),
      User.countDocuments({ role: "seller" }),
      User.countDocuments(),
      Inquiry.countDocuments(),
      Property.find().populate("seller", "name email phone").sort({ createdAt: -1 }).limit(6),
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
          soldProperties,
          totalSellers,
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

export const getSellers = async (req, res, next) => {
  try {
    const sellers = await User.aggregate([
      { $match: { role: "seller" } },
      {
        $lookup: {
          from: "properties",
          localField: "_id",
          foreignField: "seller",
          as: "properties"
        }
      },
      {
        $lookup: {
          from: "inquiries",
          localField: "_id",
          foreignField: "seller",
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
          activeListings: {
            $size: {
              $filter: {
                input: "$properties",
                as: "property",
                cond: {
                  $and: [
                    { $eq: ["$$property.listingStatus", "approved"] },
                    { $eq: ["$$property.isSold", false] }
                  ]
                }
              }
            }
          },
          totalInquiries: { $size: "$inquiries" }
        }
      },
      { $sort: { createdAt: -1 } }
    ]);

    return res.json({ success: true, data: sellers });
  } catch (error) {
    return next(error);
  }
};

export const updateSellerStatus = async (req, res, next) => {
  try {
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res.status(400).json({ success: false, message: "isActive boolean is required." });
    }

    const seller = await User.findOneAndUpdate(
      { _id: req.params.id, role: "seller" },
      { isActive },
      { new: true }
    ).select("name email phone role isActive createdAt");

    if (!seller) {
      return res.status(404).json({ success: false, message: "Seller not found." });
    }

    return res.json({ success: true, message: "Seller status updated.", data: seller });
  } catch (error) {
    return next(error);
  }
};

export const getAllInquiries = async (req, res, next) => {
  try {
    const filters = {};
    if (req.query.status) {
      filters.status = req.query.status;
    }

    const inquiries = await Inquiry.find(filters)
      .populate("seller", "name email phone")
      .populate("property", "title location.city location.locality price")
      .sort({ createdAt: -1 });

    return res.json({ success: true, data: inquiries });
  } catch (error) {
    return next(error);
  }
};
