export const validateAdminKey = (req, res, next) => {
  const adminKey = String(req.body?.adminKey || "").trim();

  if (!process.env.ADMIN_SECRET_KEY) {
    return res.status(500).json({ message: "ADMIN_SECRET_KEY is not configured." });
  }

  if (!adminKey) {
    return res.status(400).json({ message: "Admin key is required." });
  }

  if (adminKey !== process.env.ADMIN_SECRET_KEY) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  return next();
};
