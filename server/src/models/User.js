import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true, default: "" },
    password: { type: String, required: true, minlength: 6, select: false },
    role: {
      type: String,
      enum: ["admin", "seller", "visitor"],
      default: "visitor"
    },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
