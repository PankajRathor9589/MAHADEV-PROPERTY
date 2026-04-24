import mongoose from "mongoose";

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI is not configured.");
  }

  console.log("Connecting to MongoDB...");

  mongoose.connection.on("connected", () => {
    console.log(
      `MongoDB connected successfully to ${mongoose.connection.host}/${mongoose.connection.name || "default"}`
    );
  });

  mongoose.connection.on("error", (error) => {
    console.error("MongoDB connection error:", error.message);
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("MongoDB disconnected");
  });

  await mongoose.connect(mongoUri);
};

export default connectDB;
