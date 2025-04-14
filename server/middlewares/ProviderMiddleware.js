import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const providerAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN); // ✅ decode token

    const userId = decoded.id;
    const role = decoded.role;

    if (!userId || role !== "provider") {
      return res.status(403).json({ message: "Access denied: Providers only" });
    }

    // ✅ Attach user info to request
    req.userId = userId;
    req.userRole = role;

    next();
  } catch (error) {
    console.error("Provider auth middleware error:", error);
    return res.status(401).json({ message: "Invalid or expired token", error: error.message });
  }
};

export default providerAuth;
