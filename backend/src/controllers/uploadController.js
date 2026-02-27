export const uploadImages = async (req, res) => {
  const files = req.files || [];
  const imageFiles = files.filter((file) => file.mimetype.startsWith("image/"));
  const paths = imageFiles.map((file) => `/${process.env.UPLOAD_DIR || "uploads"}/${file.filename}`);
  return res.status(201).json({ items: paths });
};

export const uploadMediaFiles = async (req, res) => {
  const files = req.files || [];
  const items = files.map((file) => ({
    type: file.mimetype.startsWith("video/") ? "video" : "image",
    path: `/${process.env.UPLOAD_DIR || "uploads"}/${file.filename}`
  }));

  return res.status(201).json({ items });
};
