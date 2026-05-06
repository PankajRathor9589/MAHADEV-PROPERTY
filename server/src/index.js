// import path from "node:path";
// import { fileURLToPath } from "node:url";
// import cors from "cors";
// import dotenv from "dotenv";
// import express from "express";
// import morgan from "morgan";
// import connectDB from "./config/db.js";
// import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
// import adminRoutes from "./routes/adminRoutes.js";
// import authRoutes from "./routes/authRoutes.js";
// import favoriteRoutes from "./routes/favoriteRoutes.js";
// import inquiryRoutes from "./routes/inquiryRoutes.js";
// import propertyRoutes from "./routes/propertyRoutes.js";
// import seoRoutes from "./routes/seoRoutes.js";
// import uploadRoutes from "./routes/uploadRoutes.js";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// dotenv.config({ path: path.resolve(__dirname, "../../.env") });
// dotenv.config({ path: path.resolve(__dirname, "../.env"), override: true });

// const uploadsDir = path.resolve(__dirname, "../../uploads");
// const port = Number(process.env.PORT || 5000);

// const configuredOrigins = [
//   process.env.CLIENT_URL,
//   process.env.FRONTEND_URL,
//   process.env.PUBLIC_SITE_URL,
//   process.env.CORS_ORIGINS,
//   process.env.ALLOWED_ORIGINS
// ]
//   .filter(Boolean)
//   .flatMap((value) => String(value).split(","))
//   .map((value) => value.trim())
//   .filter(Boolean);
// const allowedOrigins = new Set([
//   "http://localhost:5173",
//   "http://127.0.0.1:5173",
//   "http://localhost:4173",
//   "http://127.0.0.1:4173",
//   "http://localhost:3000",
//   "http://127.0.0.1:3000",

//   "https://www.sagar-infra.in",
//   "https://sagar-infra.vercel.app",
//   "https://sagar-infra-eve4lbcxs-pankaj-rathors-projects.vercel.app",

//   process.env.VERCEL_URL
//     ? `https://${process.env.VERCEL_URL}`
//     : null,

//   ...configuredOrigins
// ].filter(Boolean));
// const app = express();
// app.disable("x-powered-by");
// app.set("trust proxy", 1);

// const corsOptions = {
//   origin(origin, callback) {
//     if (!origin || allowedOrigins.has(origin)) {
//       return callback(null, true);
//     }

//     const corsError = new Error(`CORS blocked for origin: ${origin}`);
//     corsError.statusCode = 403;
//     return callback(corsError);
//   },
//   methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"]
// };

// app.use(cors(corsOptions));
// app.options("*", cors(corsOptions));
// app.use(express.json({ limit: "5mb" }));
// app.use(express.urlencoded({ extended: true }));
// app.use(morgan("dev"));
// app.use("/uploads", express.static(uploadsDir));

// app.get("/", (req, res) => {
//   res.send("Server running \u{1F680}");
// });

// app.get("/api/health", (req, res) => {
//   res.json({
//     success: true,
//     message: "Sagar Infra API is healthy.",
//     timestamp: new Date().toISOString()
//   });
// });

// app.use("/api/auth", authRoutes);
// app.use("/api/admin", adminRoutes);
// app.use("/api/property", propertyRoutes);
// app.use("/api/leads", inquiryRoutes);
// app.use("/api/favorites", favoriteRoutes);
// app.use("/api/seo", seoRoutes);
// app.use("/api/upload", uploadRoutes);

// // Backward-compatible aliases for any older frontend code.
// app.use("/api/properties", propertyRoutes);
// app.use("/api/inquiries", inquiryRoutes);

// app.use(notFoundHandler);
// app.use(errorHandler);

// const startServer = async () => {
//   try {
//     console.log("Starting Sagar Infra API...");
//     console.log(`Configured port: ${port}`);
//     console.log(`Allowed frontend origins: ${Array.from(allowedOrigins).join(", ")}`);

//     if (!process.env.JWT_SECRET) {
//       throw new Error("JWT_SECRET is required in environment variables.");
//     }

//     await connectDB();

//     app.listen(port, () => {
//       console.log(`Server running on http://localhost:${port}`);
//       console.log(`Frontend dev URL expected at http://localhost:5173`);
//     });
//   } catch (error) {
//     console.error("Failed to start server", error);
//     process.exit(1);
//   }
// };

// startServer();

// export default app;




import path from "node:path";
import { fileURLToPath } from "node:url";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";

import connectDB from "./config/db.js";

import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

import adminRoutes from "./routes/adminRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";
import inquiryRoutes from "./routes/inquiryRoutes.js";
import propertyRoutes from "./routes/propertyRoutes.js";
import seoRoutes from "./routes/seoRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, "../../.env")
});

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
  override: true
});

const uploadsDir = path.resolve(__dirname, "../../uploads");

const port = Number(process.env.PORT || 5000);

const configuredOrigins = [
  process.env.CLIENT_URL,
  process.env.FRONTEND_URL,
  process.env.PUBLIC_SITE_URL,
  process.env.CORS_ORIGINS,
  process.env.ALLOWED_ORIGINS
]
  .filter(Boolean)
  .flatMap((value) => String(value).split(","))
  .map((value) => value.trim())
  .filter(Boolean);

const allowedOrigins = new Set([
  // Local development
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:4173",
  "http://127.0.0.1:4173",
  "http://localhost:3000",
  "http://127.0.0.1:3000",

  // Production domains
  "https://www.sagar-infra.in",
  "https://sagar-infra.vercel.app",
  "https://sagar-infra-eve4lbcxs-pankaj-rathors-projects.vercel.app",

  // Auto Vercel preview URL
  process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : null,

  // ENV configured origins
  ...configuredOrigins
].filter(Boolean));

const app = express();

app.disable("x-powered-by");

app.set("trust proxy", 1);

const corsOptions = {
  origin(origin, callback) {
    // Allow Postman/server requests
    if (!origin) {
      return callback(null, true);
    }

    // Allow known frontend origins
    if (allowedOrigins.has(origin)) {
      return callback(null, true);
    }

    console.log("Blocked by CORS:", origin);

    const corsError = new Error(
      `CORS blocked for origin: ${origin}`
    );

    corsError.statusCode = 403;

    return callback(corsError);
  },

  credentials: true,

  methods: [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS"
  ],

  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Origin",
    "Accept"
  ]
};

app.use(cors(corsOptions));

app.options("*", cors(corsOptions));

app.use(express.json({ limit: "10mb" }));

app.use(express.urlencoded({
  extended: true,
  limit: "10mb"
}));

app.use(morgan("dev"));

app.use("/uploads", express.static(uploadsDir));

app.get("/", (req, res) => {
  res.send("Server running 🚀");
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Sagar Infra API is healthy.",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development"
  });
});

/*
|--------------------------------------------------------------------------
| API ROUTES
|--------------------------------------------------------------------------
*/

app.use("/api/auth", authRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/property", propertyRoutes);

app.use("/api/leads", inquiryRoutes);

app.use("/api/favorites", favoriteRoutes);

app.use("/api/seo", seoRoutes);

app.use("/api/upload", uploadRoutes);

/*
|--------------------------------------------------------------------------
| BACKWARD COMPATIBILITY ROUTES
|--------------------------------------------------------------------------
*/

app.use("/api/properties", propertyRoutes);

app.use("/api/inquiries", inquiryRoutes);

/*
|--------------------------------------------------------------------------
| ERROR HANDLERS
|--------------------------------------------------------------------------
*/

app.use(notFoundHandler);

app.use(errorHandler);

/*
|--------------------------------------------------------------------------
| START SERVER
|--------------------------------------------------------------------------
*/

const startServer = async () => {
  try {
    console.log("🚀 Starting Sagar Infra API...");
    console.log(`📦 Port: ${port}`);

    console.log(
      `🌐 Allowed Origins:\n${Array.from(
        allowedOrigins
      ).join("\n")}`
    );

    if (!process.env.JWT_SECRET) {
      throw new Error(
        "JWT_SECRET is required in environment variables."
      );
    }

    await connectDB();

    app.listen(port, () => {
      console.log(
        `✅ Server running on http://localhost:${port}`
      );

      console.log(
        "🔥 Production backend ready."
      );
    });

  } catch (error) {

    console.error(
      "❌ Failed to start server",
      error
    );

    process.exit(1);
  }
};

startServer();

export default app;
