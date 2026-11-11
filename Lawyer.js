import mongoose from "mongoose";

const lawyerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  specialization: { type: String, required: true, trim: true },
  experienceYears: { type: Number, default: 0, min: 0 },
  city: { type: String, default: "Bengaluru" },
  consultationFee: { type: Number, default: 0, min: 0 },
  description: { type: String, default: "" },
  available: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model("Lawyer", lawyerSchema);
