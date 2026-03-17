import Property from "../models/Property.js";
import User from "../models/User.js";
import { AppError } from "../middleware/errorHandler.js";

const favoritePopulate = {
  path: "favorites",
  populate: {
    path: "postedBy",
    select: "name email phone role"
  }
};

export const getFavorites = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate(favoritePopulate);

    return res.json({
      success: true,
      data: user?.favorites || []
    });
  } catch (error) {
    return next(error);
  }
};

export const addFavorite = async (req, res, next) => {
  try {
    const property = await Property.findOne({
      _id: req.params.propertyId,
      approvalStatus: "approved"
    });

    if (!property) {
      throw new AppError(404, "Property not found.");
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      throw new AppError(404, "User not found.");
    }

    const alreadySaved = user.favorites.some(
      (favoriteId) => favoriteId.toString() === property._id.toString()
    );

    if (!alreadySaved) {
      user.favorites.push(property._id);
      await user.save();
    }

    await user.populate(favoritePopulate);

    return res.status(201).json({
      success: true,
      message: "Property saved to favorites.",
      data: user.favorites
    });
  } catch (error) {
    return next(error);
  }
};

export const removeFavorite = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      throw new AppError(404, "User not found.");
    }

    user.favorites = user.favorites.filter(
      (favoriteId) => favoriteId.toString() !== req.params.propertyId
    );
    await user.save();
    await user.populate(favoritePopulate);

    return res.json({
      success: true,
      message: "Property removed from favorites.",
      data: user.favorites
    });
  } catch (error) {
    return next(error);
  }
};
