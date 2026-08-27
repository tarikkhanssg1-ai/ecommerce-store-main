import express from "express";
const app = express();
import Connection from "./db/conn.js";
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"

import productRouter from "./routes/productRoutes.js";
import userRouter from "./routes/userRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import cartRouter from "./routes/cartRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import paymentRouter from "./routes/paymentRoutes.js";

dotenv.config()
const PORT = process.env.PORT || 5000
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser())
app.use("/api/v1/products", productRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/payment", paymentRouter);
Connection();
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// http://localhost:5000/api/v1/products/create-product
