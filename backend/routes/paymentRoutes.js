import express from "express";
const paymentRouter = express.Router();
import { isAuthenticatedUser } from "../utils/userAuth.js";
import { createPaymentIntent, getStripeKey } from "../controllers/paymentController.js";

paymentRouter.post("/create-payment-intent", isAuthenticatedUser, createPaymentIntent);
paymentRouter.get("/stripe-key", isAuthenticatedUser, getStripeKey);

export default paymentRouter;
