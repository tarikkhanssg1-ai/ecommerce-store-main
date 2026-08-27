import express from "express";
const adminRouter = express.Router();
import { isAuthenticatedUser, authorizeRoles } from "../utils/userAuth.js";
import { getDashboardStats, getAllUsers } from "../controllers/adminController.js";

adminRouter.get("/stats", isAuthenticatedUser, authorizeRoles("admin"), getDashboardStats);
adminRouter.get("/users", isAuthenticatedUser, authorizeRoles("admin"), getAllUsers);

export default adminRouter;
