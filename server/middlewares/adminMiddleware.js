import User from "../models/userModel.js"; // Ensure path is correct

const adminAuth = async (req, res, next) => {
  try {
    const userId = req.user?._id || req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: No user ID provided" });
    }

    const user = await User.findById(userId).select("role");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }

    next();
  } catch (error) {
    console.error("Admin Auth Error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export default adminAuth;
