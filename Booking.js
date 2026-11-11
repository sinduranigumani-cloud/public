import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  lawyer: { type: mongoose.Schema.Types.ObjectId, ref: "Lawyer", required: true },
  appointmentDate: { type: Date, required: true },
  message: { type: String, maxlength: 1000, default: "" },
  status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" }
}, { timestamps: true });

export default mongoose.model("Booking", bookingSchema);
