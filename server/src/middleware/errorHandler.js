export const notFoundHandler = (req, res) => {
  res.status(404).json({ success: false, message: "Route not found." });
};

export const errorHandler = (error, req, res, next) => {
  console.error(error);

  if (error.name === "MulterError") {
    return res.status(400).json({ success: false, message: error.message });
  }

  if (error.name === "ValidationError") {
    return res.status(400).json({ success: false, message: error.message });
  }

  const statusCode = error.statusCode || 500;
  return res.status(statusCode).json({
    success: false,
    message: error.message || "Internal server error."
  });
};
