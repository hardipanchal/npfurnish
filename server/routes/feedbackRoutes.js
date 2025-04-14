import express from "express";
import * as feedbackController from "../controllers/feedbackController.js";

const router = express.Router();

router.post("/", feedbackController.createFeedback); // Create feedback
router.get("/", feedbackController.getFeedbacks); // Get all feedbacks
router.get("/:id", feedbackController.getFeedbackById); // Get feedback by ID
router.put("/:id", feedbackController.updateFeedback); // Update feedback
router.delete("/:id", feedbackController.deleteFeedback); // Soft delete feedback

export default router;
