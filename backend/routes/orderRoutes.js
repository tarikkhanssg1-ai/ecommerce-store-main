import express from "express";
const orderRouter = express.Router();
import { isAuthenticatedUser } from "../utils/userAuth.js";
import { createOrder, getMyOrders, getOrderDetail } from "../controllers/orderController.js";

orderRouter.post("/create-order", isAuthenticatedUser, createOrder);
orderRouter.get("/my-orders", isAuthenticatedUser, getMyOrders);
orderRouter.get("/order-detail/:id", isAuthenticatedUser, getOrderDetail);

export default orderRouter;
