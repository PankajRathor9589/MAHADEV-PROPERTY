import Property from "../models/Property.js";
import User from "../models/User.js";
import { AppError } from "../middleware/errorHandler.js";

const favoritePopulate = {
  path: "favorites",
  select: "title description price location city bedrooms bathrooms area images status views createdAt",
  populate: {
    path: "agent",
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
    const property = await Property.findOne({ _id: req.params.propertyId, status: "approved" });
    if (!property) {
      throw new AppError(404, "Property not found.");
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      throw new AppError(404, "User not found.");
    }

    if (!user.favorites.some((item) => item.toString() === property._id.toString())) {
      user.favorites.push(property._id);
      await user.save();
    }

    await user.populate(favoritePopulate);

    return res.status(201).json({
      success: true,
      message: "Property added to favorites.",
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
      (item) => item.toString() !== req.params.propertyId.toString()
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
