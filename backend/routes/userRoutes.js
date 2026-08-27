import express from "express";
const userRouter = express.Router();
import { registerUser, loginUser, logoutUser, updateUser, deleteUser, getUserProfile, resetPasswordRequest, resetPassword, updatePassword } from "../controllers/userController.js";
import { isAuthenticatedUser, authorizeRoles } from "../utils/userAuth.js";

userRouter.post("/register-user", registerUser);
userRouter.post("/login-user", loginUser);
userRouter.get("/logout-user", isAuthenticatedUser, logoutUser);
userRouter.put("/update-user/:id", isAuthenticatedUser, updateUser);
userRouter.delete("/delete-user/:id", isAuthenticatedUser, authorizeRoles("admin"), deleteUser);
userRouter.get("/get-user/:id", isAuthenticatedUser, getUserProfile);
userRouter.post("/reset-password", resetPasswordRequest);
userRouter.post("/reset-password/:token", resetPassword);
userRouter.put("/update-password/:id", isAuthenticatedUser, updatePassword);

export default userRouter;