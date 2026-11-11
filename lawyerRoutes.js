import { Router } from "express";
import { getLawyers, createLawyer } from "../controllers/lawyerController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();
router.get("/", getLawyers);
router.post("/", protect, createLawyer);
export default router;
