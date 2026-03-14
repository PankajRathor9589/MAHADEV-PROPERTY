import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address."]
    },
    phone: { type: String, trim: true, default: "" },
    password: { type: String, required: true, minlength: 6, select: false },
    role: {
      type: String,
      enum: ["buyer", "agent", "admin"],
      default: "buyer"
    },
    isActive: { type: Boolean, default: true },
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property"
      }
    ]
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        return ret;
      }
    }
  }
);

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = function matchPassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.index({ role: 1, isActive: 1 });

const User = mongoose.model("User", userSchema);

export default User;
