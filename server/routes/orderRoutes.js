import express from 'express';
import * as orderController from '../controllers/orderController.js';
import auth from '../middlewares/auth.js'; // ensures user is logged in

const router = express.Router();

router.post("/", auth, orderController.createOrder);

// 🛠️ This route allows both customers and admins
router.get("/", orderController.getOrders);
router.get("/myorders", auth, orderController.getMyOrders);
router.get("/:id", auth, orderController.getOrderById);
router.put("/:id", auth, orderController.updateOrder);
router.delete("/:id", auth, orderController.deleteOrder);
router.put("/:id/cancel", auth, orderController.cancelOrder);
router.put("/:id/confirm", auth, orderController.confirmOrder);
// Get orders for the logged-in user

export default router;
