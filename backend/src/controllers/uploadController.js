export const uploadImages = async (req, res) => {
  const files = req.files || [];
  const paths = files.map((file) => `/${process.env.UPLOAD_DIR || "uploads"}/${file.filename}`);
  return res.status(201).json({ items: paths });
};
