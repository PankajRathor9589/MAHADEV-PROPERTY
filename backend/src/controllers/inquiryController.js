import { Inquiry } from "../models/Inquiry.js";

export const createInquiry = async (req, res) => {
  const inquiry = await Inquiry.create(req.body);
  return res.status(201).json({ item: inquiry });
};

export const listInquiries = async (req, res) => {
  const items = await Inquiry.find()
    .populate("property", "title slug price")
    .sort({ createdAt: -1 });
  return res.json({ items });
};

export const updateInquiryStatus = async (req, res) => {
  const inquiry = await Inquiry.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true, runValidators: true }
  );

  if (!inquiry) return res.status(404).json({ message: "Inquiry not found" });
  return res.json({ item: inquiry });
};
