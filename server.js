import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import lawyerRoutes from "./routes/lawyerRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";

dotenv.config();
const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json({ limit: "1mb" }));

app.get("/", (req, res) => res.json({ message: "Legal Consultation API is running." }));
app.use("/api/auth", authRoutes);
app.use("/api/lawyers", lawyerRoutes);
app.use("/api/bookings", bookingRoutes);

const PORT = process.env.PORT || 5000;
connectDB()
  .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
  .catch((error) => {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  });
