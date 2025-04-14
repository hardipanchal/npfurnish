import express from "express";
import * as cartController from "../controllers/cartController.js";

const router = express.Router();

router.post("/", cartController.addToCart); // Add to cart
router.get("/", cartController.getCartItems); // Get all cart items
router.get("/:userId", cartController.getCartItemsByUser); // Get cart items by user ID
router.delete("/:id", cartController.removeFromCart); // Remove an item from cart
router.delete("/clear/:userId", cartController.clearCart); // Clear all cart items for a user

export default router;
