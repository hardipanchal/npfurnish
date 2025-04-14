import express from "express";
import {
  loginUserController,
  registerUserController,
  verifyEmailController
} from "../controllers/userController.js";
import { setProviderPassword } from "../controllers/assignedProviderController.js";


const authRoutes = express.Router();

authRoutes.post("/register", registerUserController);
authRoutes.post("/login", loginUserController);
authRoutes.post("/verify-email", verifyEmailController);

// Public route for provider to set their password
authRoutes.post("/set-password", setProviderPassword);

export default authRoutes;
