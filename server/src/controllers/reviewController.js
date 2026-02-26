import Review from '../models/Review.js';
import Report from '../models/Report.js';

export const addReview = async (req, res) => res.status(201).json({ data: await Review.create(req.body) });
export const getReviews = async (req, res) => res.json({ data: await Review.find({ propertyId: req.params.propertyId }) });
export const markHelpful = async (req, res) => {
  const review = await Review.findById(req.params.id);
  review.helpfulCount += 1;
  await review.save();
  res.json({ data: review });
};
export const reportProperty = async (req, res) => res.status(201).json({ data: await Report.create(req.body) });
