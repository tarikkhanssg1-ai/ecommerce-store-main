import express from "express";
const cartRouter = express.Router();
import { isAuthenticatedUser } from "../utils/userAuth.js";
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from "../controllers/cartController.js";

cartRouter.get("/", isAuthenticatedUser, getCart);
cartRouter.post("/add", isAuthenticatedUser, addToCart);
cartRouter.put("/update/:productId", isAuthenticatedUser, updateCartItem);
cartRouter.delete("/remove/:productId", isAuthenticatedUser, removeFromCart);
cartRouter.delete("/clear", isAuthenticatedUser, clearCart);

export default cartRouter;
