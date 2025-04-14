import Feedback from "../models/feedbackModel.js";

// ✅ Create Feedback
export const createFeedback = async (req, res) => {
  try {
    const { orderId, userId, rating, description } = req.body;

    const newFeedback = new Feedback({
      orderId,
      userId,
      rating,
      description,
    });

    await newFeedback.save();
    res.status(201).json({ message: "Feedback submitted successfully!", feedback: newFeedback });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error submitting feedback", error: error.message });
  }
};

// ✅ Get All Feedbacks (Only Non-Deleted)
export const getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ isDeleted: false }).populate("userId", "name").populate("orderId");
    res.status(200).json(feedbacks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching feedbacks", error: error.message });
  }
};

// ✅ Get Feedback by ID
export const getFeedbackById = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id).populate("userId", "name").populate("orderId");
    if (!feedback || feedback.isDeleted) {
      return res.status(404).json({ message: "Feedback not found" });
    }
    res.status(200).json(feedback);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching feedback", error: error.message });
  }
};

// ✅ Update Feedback
export const updateFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!feedback || feedback.isDeleted) {
      return res.status(404).json({ message: "Feedback not found" });
    }
    res.status(200).json({ message: "Feedback updated successfully", feedback });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating feedback", error: error.message });
  }
};

// ✅ Soft Delete Feedback
export const deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    feedback.isDeleted = true;
    await feedback.save();

    res.status(200).json({ message: "Feedback deleted successfully", feedback });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting feedback", error: error.message });
  }
};
