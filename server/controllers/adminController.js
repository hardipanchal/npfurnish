import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import sendSetPasswordEmail from "../utils/sendSetPasswordEmail.js";

// 🔹 Get all users (excluding passwords)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
};



export const getAllProviders = async (req, res) => {
  try {
    const providers = await User.find({
      role: "provider",
      isDeleted: false,
    }).select("-password -refresh_token -access_token");

    return res.status(200).json({
      message: "All providers fetched successfully",
      success: true,
      error: false,
      data: providers,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to fetch providers",
      success: false,
      error: true,
    });
  }
};



export async function getLoggedInProviders(req, res) {
  try {
    const providers = await User.find({
      role: "provider",
      isLoggedIn: true,
      isDeleted: false,
      status: "active",
    }).select("-password -refresh_token -access_token"); // Exclude sensitive data

    return res.json({
      message: "Currently logged-in providers fetched successfully",
      success: true,
      error: false,
      data: providers,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to fetch logged-in providers",
      success: false,
      error: true,
    });
  }
}
// 🔹 Update a user's role (e.g., make them admin or provider)
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!role) {
    return res.status(400).json({ message: "Role is required" });
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = role;
    await user.save();

    res.status(200).json({ message: "User role updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error: error.message });
  }
};

// 🔹 Delete a user
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.deleteOne();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error: error.message });
  }
};

// 🔹 Add a provider (Admin-initiated, sends email to set password)
export const addProvider = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ msg: "Provider already exists" });
    }

    const dummyPassword = await bcrypt.hash("TemporaryPassword@123", 10);

    const newProvider = new User({
      name,
      email,
      phone,
      role: "provider",
      password: dummyPassword,
    });

    await newProvider.save();

    // Create a token
    const token = jwt.sign(
      { email: newProvider.email, id: newProvider._id },
      process.env.JSON_WEB_TOKEN_SECRET_KEY,
      { expiresIn: "15m" }
    );

    // Full password setup link
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const setPasswordLink = `${frontendUrl}/provider/set-password/${token}`;

    // 🟢 Make sure sendSetPasswordEmail sends the FULL LINK
    await sendSetPasswordEmail(email, setPasswordLink);

    res.status(201).json({ msg: "Provider added and password setup link sent." });
  } catch (error) {
    console.error("Add provider error:", error);
    res.status(500).json({ msg: "Server error" });
  }
};


// 🔹 Set new password via emailed token
// backend/controllers/adminController.js


