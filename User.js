import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, select: false },
  googleId: { type: String, sparse: true },
  role: { type: String, enum: ["client", "lawyer", "admin"], default: "client" }
}, { timestamps: true });

export default mongoose.model("User", userSchema);
