import { Report } from "../models/Report.js";

export const createReport = async (req, res) => {
  const payload = {
    property: req.params.propertyId,
    user: req.user?._id,
    reason: req.body.reason,
    details: req.body.details
  };

  const report = await Report.create(payload);
  return res.status(201).json({ item: report });
};

export const listReports = async (req, res) => {
  const items = await Report.find().populate("property", "title slug").sort({ createdAt: -1 });
  return res.json({ items });
};

export const updateReportStatus = async (req, res) => {
  const report = await Report.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  if (!report) return res.status(404).json({ message: "Report not found" });
  return res.json({ item: report });
};
