import express from "express";
const productRouter = express.Router();
import {isAuthenticatedUser, authorizeRoles} from "../utils/userAuth.js";
import { createProduct, getAllProducts, updateProduct, productDetail, deleteProduct } from "../controllers/productController.js";

productRouter.post("/create-product", isAuthenticatedUser, authorizeRoles("admin"), createProduct);
productRouter.get("/get-all-products", getAllProducts);
productRouter.put("/update-product/:id", isAuthenticatedUser, authorizeRoles("admin"), updateProduct);
productRouter.delete("/delete-product/:id", isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);
productRouter.get("/product-detail/:id", productDetail);

export default productRouter