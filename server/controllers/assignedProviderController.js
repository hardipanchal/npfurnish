
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import Order from "../models/orderModel.js";

import AssignedProvider from "../models/assignedProviderModel.js";
import User from "../models/userModel.js"; // ✅ adjust the path if needed


// ✅ Assign a Provider to an Order (Admin)
// ✅ Assign a Provider to an Order (Admin)
const assignProvider = async (req, res) => {
  try {
    const { providerId, orderId } = req.body;

    // 🔍 Step 1: Check if order is already assigned (and not soft-deleted)
    const existingAssignment = await AssignedProvider.findOne({
      orderId,
      isDeleted: false, // only consider active assignments
    });

    if (existingAssignment) {
      return res.status(400).json({
        message: "This order is already assigned to a provider.",
        success: false,
        error: true,
      });
    }

    // 🛠 Step 2: Proceed to assign provider
    const assignment = await AssignedProvider.create({ providerId, orderId });

    res.status(201).json({
      message: "Provider assigned successfully.",
      assignment,
      success: true,
    });
  } catch (error) {
    console.error("Assign Provider Error:", error);
    res.status(500).json({
      message: "Error assigning provider.",
      error: error.message,
      success: false,
    });
  }
};




// ✅ Get All Assignments for a Specific Provider (Admin)
const getProviderAssignments = async (req, res) => {
  try {
    const { providerId } = req.params;

    const assignments = await AssignedProvider.find({
      providerId,
      isDeleted: false,
    }).populate("orderId");

    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ error: "Error fetching assigned orders" });
  }
};


// ✅ Get all assignments (for admin)
export const getAllAssignments = async (req, res) => {
  try {
    const assignments = await AssignedProvider.find({ isDeleted: false }).populate("orderId");
    res.status(200).json(assignments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching all assignments", error: error.message });
  }
};


// ✅ Get Single Assignment by ID
const getAssignedProviderById = async (req, res) => {
  try {
    const assignedProvider = await AssignedProvider.findById(req.params.id);
    if (!assignedProvider || assignedProvider.isDeleted) {
      return res.status(404).json({ message: "Assigned provider not found" });
    }
    res.status(200).json(assignedProvider);
  } catch (error) {
    res.status(500).json({ message: "Error fetching assigned provider", error: error.message });
  }
};

// ✅ Mark as Delivered (Provider)
const markAsDelivered = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Assignment ID received:", id);

    // Step 1: Mark the assignment as delivered
    const updatedAssignment = await AssignedProvider.findByIdAndUpdate(
      id,
      { isDelivered: true },
      { new: true }
    );

    console.log("Updated assignment:", updatedAssignment);

    if (!updatedAssignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    // Step 2: Update the order status
    const updatedOrder = await Order.findByIdAndUpdate(
      updatedAssignment.orderId,
      { status: "Delivered" },
      { new: true }
    );

    console.log("Updated order:", updatedOrder);

    res.status(200).json({ message: "Marked as delivered", updated: updatedAssignment });
  } catch (error) {
    console.error("❌ Error updating delivery status:", error);
    res.status(500).json({ error: "Error updating delivery status" });
  }
};



// ✅ Report Delivery Issue (Provider)
const reportDeliveryIssue = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { issue } = req.body;

    const updated = await AssignedProvider.findByIdAndUpdate(
      assignmentId,
      { deliveryIssue: issue },
      { new: true }
    );

    res.status(200).json({ message: "Issue reported", updated });
  } catch (error) {
    res.status(500).json({ error: "Error reporting issue" });
  }
};

// ✅ Add Delivery Issue (Alternate endpoint)
const addDeliveryIssue = async (req, res) => {
  try {
    const assignedProvider = await AssignedProvider.findById(req.params.id);
    if (!assignedProvider || assignedProvider.isDeleted) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    assignedProvider.deliveryIssue = req.body.deliveryIssue;
    await assignedProvider.save();

    res.status(200).json({ message: "Delivery issue added successfully", assignedProvider });
  } catch (error) {
    res.status(500).json({ message: "Error adding delivery issue", error: error.message });
  }
};

// ✅ Soft Delete Assignment (Admin)
const deleteAssignedProvider = async (req, res) => {
  try {
    const assignedProvider = await AssignedProvider.findById(req.params.id);
    if (!assignedProvider || assignedProvider.isDeleted) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    assignedProvider.isDeleted = true;
    await assignedProvider.save();

    res.status(200).json({ message: "Assignment deleted (soft)", assignedProvider });
  } catch (error) {
    res.status(500).json({ message: "Error deleting assignment", error: error.message });
  }
};

// ✅ Get Assignments for the Logged-in Provider (Provider Dashboard)
const getMyAssignedOrders = async (req, res) => {
  try {
    const providerId = req.userId;

    const assignments = await AssignedProvider.find({
      providerId,
      isDeleted: false,
    })
      .populate({
        path: "orderId",
        populate: {
          path: "userId",
          model: "User",
          select: "name", // only name is needed from User
        },
      })
      .lean();
    

      const formattedAssignments = assignments.map((a) => ({
        _id: a._id,
        customerName: a.orderId?.userId?.name || "N/A",
        address: a.orderId?.address || "N/A", // ✅ this is correct
        status: a.isDelivered ? "delivered" : "pending",
        updatedAt: a.updatedAt,
      }));
      
    res.status(200).json({ assignments: formattedAssignments });
  } catch (error) {
    console.error("Assignment Fetch Error:", error);
    res.status(500).json({ message: "Error fetching your assigned orders" });
  }
};


// ✅ Get Assigned Provider by Order ID
const getAssignedProviderByOrderId = async (req, res) => {
  try {
    const assignment = await AssignedProvider.findOne({
      orderId: req.params.orderId,
      isDeleted: false
    });
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }
    res.status(200).json(assignment);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const checkIfAssigned = async (req, res) => {
  try {
    const { orderId } = req.params;

    const assigned = await AssignedProvider.findOne({
      orderId,
      isDeleted: false,
    });

    if (!assigned) {
      // Instead of 404, return success with isAssigned: false
      return res.status(200).json({
        isAssigned: false,
        message: "No provider assigned yet",
      });
    }

    return res.status(200).json({
      isAssigned: true,
      message: "Provider already assigned",
      assignedProvider: assigned,
    });
  } catch (error) {
    console.error("Error checking provider assignment:", error);
    res.status(500).json({ message: "Server Error" });
  }
};




export const setProviderPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ msg: "Token and new password are required" });
    }

    const decoded = jwt.verify(token, process.env.JSON_WEB_TOKEN_SECRET_KEY);

    const user = await User.findOne({ _id: decoded.id, email: decoded.email });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ msg: "Password set successfully. You can now login." });
  } catch (error) {
    console.error("Set password error:", error);
    res.status(500).json({ msg: "Invalid or expired token" });
  }
};

// ✅ Export all functions
export {
  assignProvider,
  getProviderAssignments,
  getAssignedProviderById,
  markAsDelivered,
  reportDeliveryIssue,
  addDeliveryIssue,
  deleteAssignedProvider,
  getMyAssignedOrders,
  getAssignedProviderByOrderId,
};
