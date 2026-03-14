import Inquiry from "../models/Inquiry.js";
import Property from "../models/Property.js";

export const getAgentProperties = async (req, res, next) => {
  try {
    const filters = { agent: req.user._id };
    if (req.query.status) {
      filters.status = req.query.status;
    }

    const properties = await Property.find(filters)
      .populate("agent", "name email phone role")
      .sort({ createdAt: -1 });

    return res.json({ success: true, data: properties });
  } catch (error) {
    return next(error);
  }
};

export const getAgentAnalytics = async (req, res, next) => {
  try {
    const agentId = req.user._id;

    const [
      totalProperties,
      approvedProperties,
      pendingProperties,
      rejectedProperties,
      totalViewsData,
      totalInquiries,
      newInquiries
    ] = await Promise.all([
      Property.countDocuments({ agent: agentId }),
      Property.countDocuments({ agent: agentId, status: "approved" }),
      Property.countDocuments({ agent: agentId, status: "pending" }),
      Property.countDocuments({ agent: agentId, status: "rejected" }),
      Property.aggregate([
        { $match: { agent: agentId } },
        { $group: { _id: null, views: { $sum: "$views" } } }
      ]),
      Inquiry.countDocuments({ agent: agentId }),
      Inquiry.countDocuments({ agent: agentId, status: "new" })
    ]);

    return res.json({
      success: true,
      data: {
        totalProperties,
        approvedProperties,
        pendingProperties,
        rejectedProperties,
        totalViews: totalViewsData[0]?.views || 0,
        totalInquiries,
        newInquiries
      }
    });
  } catch (error) {
    return next(error);
  }
};
