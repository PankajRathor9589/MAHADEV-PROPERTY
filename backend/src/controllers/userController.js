import { User } from "../models/User.js";

const updateList = async (req, key) => {
  const user = await User.findById(req.user._id);
  if (!user) return null;

  const id = req.params.propertyId;
  const list = user[key].map(String);

  if (key === "recentlyViewed") {
    user[key] = user[key].filter((item) => String(item) !== id);
    user[key].push(id);
    if (user[key].length > 20) user[key] = user[key].slice(-20);
  } else {
    const exists = list.includes(id);
    if (exists) user[key] = user[key].filter((item) => String(item) !== id);
    else user[key].push(id);
  }

  await user.save();
  await user.populate(key, "title slug price images propertyType location availabilityStatus areaSqft bedrooms bathrooms");
  return user[key];
};

export const toggleFavorite = async (req, res) => {
  const items = await updateList(req, "favorites");
  return res.json({ items });
};

export const addRecentlyViewed = async (req, res) => {
  const items = await updateList(req, "recentlyViewed");
  return res.json({ items });
};

export const toggleCompare = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: "User not found" });

  const id = req.params.propertyId;
  const exists = user.compareList.map(String).includes(id);

  if (exists) {
    user.compareList = user.compareList.filter((item) => String(item) !== id);
  } else {
    if (user.compareList.length >= 4) {
      return res.status(400).json({ message: "Compare list can have up to 4 properties" });
    }
    user.compareList.push(id);
  }

  await user.save();
  await user.populate("compareList", "title slug price images propertyType location areaSqft bedrooms bathrooms");
  return res.json({ items: user.compareList });
};

export const getUserCollections = async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate("favorites", "title slug price images propertyType location availabilityStatus")
    .populate("recentlyViewed", "title slug price images propertyType location")
    .populate("compareList", "title slug price images propertyType location areaSqft bedrooms bathrooms");

  return res.json({
    favorites: user?.favorites || [],
    recentlyViewed: user?.recentlyViewed || [],
    compareList: user?.compareList || []
  });
};
