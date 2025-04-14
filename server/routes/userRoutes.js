import { Router } from "express";
import { deleteUserController, forgotPasswordController, getProfile, loginUserController, logoutController, refreshToken, registerUserController, resetPassword, updateProfile, userDetails, verifyEmailController, verifyForgotPasswordOtp } from "../controllers/userController.js";
import auth from "../middlewares/auth.js";  // Make sure to import the auth middleware

const userRouter = Router();

userRouter.post("/register", registerUserController);
userRouter.post("/verifyemail", verifyEmailController);
userRouter.post("/login", loginUserController);
userRouter.get("/logout", auth, logoutController);  // Added auth middleware
userRouter.post("/forgot-password", forgotPasswordController);
userRouter.post("/verify-forgot-password-otp", verifyForgotPasswordOtp);
userRouter.post("/reset-password", resetPassword);
userRouter.post("/refresh-token", refreshToken);
userRouter.get("/user-details", auth, userDetails);  // Added auth middleware
userRouter.delete("/delete", auth, deleteUserController);  // Added auth middleware
userRouter.get("/profile", auth, getProfile);

userRouter.put("/update-profile", auth, updateProfile);
export default userRouter;
