import express from "express";
import {
  assignProvider,
  getAllAssignments,
  getProviderAssignments,
  getAssignedProviderById,
  markAsDelivered,
  addDeliveryIssue,
  deleteAssignedProvider,
  getMyAssignedOrders,
  setProviderPassword,
  getAssignedProviderByOrderId,
  checkIfAssigned,
} from "../controllers/assignedProviderController.js";

import providerAuthMiddleware from "../middlewares/ProviderMiddleware.js";
import adminAuth from "../middlewares/adminMiddleware.js";
import auth from "../middlewares/auth.js"; // ✅ import auth middleware

const router = express.Router();

// ✅ Admin routes (use both auth + adminAuth)
router.post("/", auth, adminAuth, assignProvider);
router.get("/", auth, adminAuth, getAllAssignments);
router.get("/provider/:providerId", auth, adminAuth, getProviderAssignments);

// ✅ Provider-only route
router.put("/deliver/:id", auth, markAsDelivered);

router.get("/assigned", providerAuthMiddleware, getMyAssignedOrders);
router.get('/assigned/order/:orderId', auth, getAssignedProviderByOrderId);
router.get("/check/:orderId", auth, checkIfAssigned);

router.get("/:id", auth, adminAuth, getAssignedProviderById);
router.put("/issue/:id", auth, adminAuth, addDeliveryIssue);
router.delete("/:id", auth, adminAuth, deleteAssignedProvider);


// ✅ Open to provider (used after admin shares link)
router.post("/provider/set-password", setProviderPassword);

export default router;
