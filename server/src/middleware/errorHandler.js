export class AppError extends Error {
  constructor(statusCode, message, details) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

export const notFoundHandler = (req, res) => {
  return res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  });
};

export const errorHandler = (error, req, res, next) => {
  console.error(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`, error);

  let statusCode = error.statusCode || 500;
  let message = error.message || "Internal server error.";
  let details = error.details;

  if (error.name === "MulterError") {
    statusCode = 400;
    message = error.message;
  } else if (error.type === "entity.parse.failed" || error instanceof SyntaxError) {
    statusCode = 400;
    message = "Invalid JSON payload.";
  } else if (error.name === "ValidationError") {
    statusCode = 400;
    message = "Validation failed.";
    details = Object.values(error.errors).map((item) => item.message);
  } else if (error.name === "CastError") {
    statusCode = 400;
    message = "Invalid resource identifier.";
  } else if (error.code === 11000) {
    statusCode = 409;
    const duplicateField = Object.keys(error.keyPattern || {})[0] || "field";
    message = `Duplicate value for ${duplicateField}.`;
  } else if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Invalid or expired token.";
  } else if (error.name === "MongoServerError" && /auth/i.test(String(error.message))) {
    statusCode = 401;
    message = "Database authentication failed.";
  }

  return res.status(statusCode).json({
    success: false,
    message,
    details,
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
    stack: process.env.NODE_ENV === "production" ? undefined : error.stack
  });
};
