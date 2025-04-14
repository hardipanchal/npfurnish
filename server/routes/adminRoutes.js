// routes/adminRoutes.js

import express from "express";
import {
  getAllUsers,
  updateUser,
  deleteUser,
  addProvider,
  getAllProviders,
} from "../controllers/adminController.js";

// ❌ Removed auth and adminAuth middleware
// import auth from "../middlewares/auth.js";
// import adminAuth from "../middlewares/adminMiddleware.js";

const router = express.Router();

// ✅ Public access to all routes below

// 🚫 PUBLIC: Get all users
router.get("/users", getAllUsers);

// 🚫 PUBLIC: Update a user role
router.put("/users/:id", updateUser);

// 🚫 PUBLIC: Delete a user
router.delete("/users/:id", deleteUser);

// 🚫 PUBLIC: Add a provider
router.post("/add-provider", addProvider);

// 🚫 PUBLIC: Get all providers
router.get("/providers", getAllProviders);

export default router;
