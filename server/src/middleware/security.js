const memoryStore = new Map();

const hasUnsafeMongoKey = (value) => {
  if (!value || typeof value !== "object") {
    return false;
  }

  return (
    Object.keys(value).some((key) => key.startsWith("$") || key.includes(".")) ||
    Object.values(value).some((item) => hasUnsafeMongoKey(item))
  );
};

export const securityHeaders = (req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=(self)");
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");

  if (process.env.NODE_ENV === "production") {
    res.setHeader("Strict-Transport-Security", "max-age=15552000; includeSubDomains");
  }

  return next();
};

export const mongoSanitize = (req, res, next) => {
  if (hasUnsafeMongoKey(req.body) || hasUnsafeMongoKey(req.query) || hasUnsafeMongoKey(req.params)) {
    const error = new Error("Invalid request payload.");
    error.statusCode = 400;
    return next(error);
  }

  return next();
};

export const createRateLimiter = ({ windowMs = 15 * 60 * 1000, max = 300 } = {}) => {
  return (req, res, next) => {
    const now = Date.now();
    const key = req.ip || req.headers["x-forwarded-for"] || "unknown";
    const entry = memoryStore.get(key) || { count: 0, resetAt: now + windowMs };

    if (entry.resetAt <= now) {
      entry.count = 0;
      entry.resetAt = now + windowMs;
    }

    entry.count += 1;
    memoryStore.set(key, entry);

    res.setHeader("RateLimit-Limit", String(max));
    res.setHeader("RateLimit-Remaining", String(Math.max(0, max - entry.count)));
    res.setHeader("RateLimit-Reset", String(Math.ceil(entry.resetAt / 1000)));

    if (entry.count > max) {
      return res.status(429).json({
        success: false,
        message: "Too many requests. Please try again shortly."
      });
    }

    return next();
  };
};
