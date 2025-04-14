// utils/generateAccessToken.js

import jwt from "jsonwebtoken";

/**
 * Generate a signed access token with user ID and role
 * @param {string} userId - MongoDB ObjectId of the user
 * @param {string} role - Role of the user (e.g., admin, customer, provider)
 * @returns {string} JWT access token
 */
const generateAccessToken = (userId, role) => {
  try {
    const token = jwt.sign(
      { id: userId, role }, // id instead of userId for consistency in decoding
      process.env.SECRET_KEY_ACCESS_TOKEN,
      { expiresIn: "5h" }
    );
    return token;
  } catch (error) {
    console.error("Error generating access token:", error.message);
    throw new Error("Token generation failed");
  }
};

export default generateAccessToken;
