import mongoose from "mongoose";
import { REPORT_REASONS } from "../utils/constants.js";

const reportSchema = new mongoose.Schema(
  {
    property: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reason: { type: String, enum: REPORT_REASONS, required: true },
    details: { type: String, trim: true },
    status: { type: String, enum: ["open", "resolved"], default: "open" }
  },
  { timestamps: true }
);

export const Report = mongoose.model("Report", reportSchema);
