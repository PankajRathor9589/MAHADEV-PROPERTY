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

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.resolve(__dirname, "../../uploads");
const port = Number(process.env.PORT || 5000);

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  process.env.CLIENT_URL,
  process.env.FRONTEND_URL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null
].filter(Boolean);

const app = express();
app.disable("x-powered-by");
app.set("trust proxy", 1);

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    const corsError = new Error(`CORS blocked for origin: ${origin}`);
    corsError.statusCode = 403;
    return callback(corsError);
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use("/uploads", express.static(uploadsDir));

app.get("/", (req, res) => {
  res.send("Sagar Infra API is running \u{1F680}");
});

const apiRouter = express.Router();

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Sagar Infra API is healthy.",
    timestamp: new Date().toISOString()
  });
});

apiRouter.use("/auth", authRoutes);
apiRouter.use("/property", propertyRoutes);
apiRouter.use("/leads", inquiryRoutes);
apiRouter.use("/favorites", favoriteRoutes);
apiRouter.use("/admin", adminRoutes);

// Backward-compatible aliases for any older frontend code.
apiRouter.use("/properties", propertyRoutes);
apiRouter.use("/inquiries", inquiryRoutes);

app.use("/api", apiRouter);

app.use(notFoundHandler);
app.use(errorHandler);

const startServer = async () => {
  try {
    console.log("Starting Sagar Infra API...");
    console.log(`Configured port: ${port}`);
    console.log(`Allowed frontend origins: ${allowedOrigins.join(", ")}`);

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is required in environment variables.");
    }

    await connectDB();

    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
      console.log(`Frontend dev URL expected at http://localhost:5173`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
};

startServer();

export default app;
