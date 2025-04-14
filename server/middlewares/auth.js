import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const auth = async (req, res, next) => {
  try {
    let token = req.cookies?.accessToken || req.headers.authorization;

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized: Token is required",
        error: true,
        success: false,
      });
    }

    // Handle Bearer prefix
    if (token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);
    console.log("✅ Auth Middleware - Token Verified:", decoded);

    if (!decoded?.id || !decoded?.role) {
      return res.status(401).json({
        message: "Unauthorized: Invalid token data",
        error: true,
        success: false,
      });
    }

    // Fetch user details
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }

    // Attach user to request
    req.user = user;
    next();

  } catch (error) {
    console.error("❌ Auth Middleware Error:", error.message);
    return res.status(403).json({
      message: "Forbidden: Invalid or expired token",
      error: true,
      success: false,
    });
  }
};

export default auth;
