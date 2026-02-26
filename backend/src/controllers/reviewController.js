import { Review } from "../models/Review.js";

export const listPropertyReviews = async (req, res) => {
  const items = await Review.find({ property: req.params.propertyId })
    .populate("user", "name")
    .sort({ createdAt: -1 });
  return res.json({ items });
};

export const createOrUpdateReview = async (req, res) => {
  const payload = {
    property: req.params.propertyId,
    user: req.user._id,
    rating: req.body.rating,
    comment: req.body.comment
  };

  const review = await Review.findOneAndUpdate(
    { property: payload.property, user: payload.user },
    payload,
    { new: true, upsert: true, runValidators: true }
  );

  return res.status(201).json({ item: review });
};

export const markHelpful = async (req, res) => {
  const review = await Review.findByIdAndUpdate(
    req.params.id,
    { $inc: { helpfulCount: 1 } },
    { new: true }
  );

  if (!review) return res.status(404).json({ message: "Review not found" });
  return res.json({ item: review });
};

export const deleteReview = async (req, res) => {
  const review = await Review.findByIdAndDelete(req.params.id);
  if (!review) return res.status(404).json({ message: "Review not found" });
  return res.json({ message: "Review deleted" });
};
