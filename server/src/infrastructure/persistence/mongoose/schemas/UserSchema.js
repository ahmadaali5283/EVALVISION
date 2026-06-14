import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { UserEntity } from "../../../../domain/entities/User.entity.js";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Name is required"], trim: true },
    email: { type: String, required: [true, "Email is required"], unique: true, lowercase: true, trim: true },
    password: { type: String, required: [true, "Password is required"], minlength: [6, "Password must be at least 6 characters"], select: false },
    role: { type: String, enum: { values: ["admin", "teacher"], message: "Role must be admin or teacher" }, default: "teacher" },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export function toUserEntity(doc) {
  if (!doc) return null;
  return new UserEntity({
    id: doc._id.toString(),
    name: doc.name,
    email: doc.email,
    password: doc.password,
    role: doc.role,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  });
}

export const UserModel = mongoose.model("User", userSchema);
