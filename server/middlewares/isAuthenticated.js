import jwt from "jsonwebtoken";

const isAuthenticated = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ 
        message: "Unauthorized: No token provided", 
        error: true,
        success: false,
      });
    }

    const token = authHeader.split(" ")[1];

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);
    console.log("✅ isAuthenticated - Token Verified:", decoded);

    // Attach user ID for use in other middleware
    req.userId = decoded.id;

    next();
  } catch (error) {
    console.error("❌ isAuthenticated Error:", error.message);
    return res.status(401).json({ 
      message: "Unauthorized: Invalid token", 
      error: true,
      success: false,
    });
  }
};

export default isAuthenticated;
