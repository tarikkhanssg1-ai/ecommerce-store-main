import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";

const getOrCreateCart = async (userId) => {
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
        cart = await Cart.create({ user: userId, items: [] });
    }
    return cart;
};

export const getCart = async (req, res) => {
    try {
        const cart = await getOrCreateCart(req.user._id);
        await cart.populate("items.product");

        return res.status(200).json({
            success: true,
            cart,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error,
        });
    }
};

export const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const qtyToAdd = Number(quantity) > 0 ? Number(quantity) : 1;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(400).json({
                success: false,
                message: "Product not found",
            });
        }

        const cart = await getOrCreateCart(req.user._id);
        const existingItem = cart.items.find((item) => item.product.toString() === productId);

        if (existingItem) {
            existingItem.quantity = Math.min(existingItem.quantity + qtyToAdd, product.stocks);
        } else {
            cart.items.push({ product: productId, quantity: Math.min(qtyToAdd, product.stocks) });
        }

        await cart.save();
        await cart.populate("items.product");

        return res.status(200).json({
            success: true,
            message: "Product added to cart",
            cart,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error,
        });
    }
};

export const updateCartItem = async (req, res) => {
    try {
        const { productId } = req.params;
        const { quantity } = req.body;

        const cart = await getOrCreateCart(req.user._id);
        const item = cart.items.find((item) => item.product.toString() === productId);
        if (!item) {
            return res.status(400).json({
                success: false,
                message: "Item not found in cart",
            });
        }

        if (Number(quantity) <= 0) {
            cart.items = cart.items.filter((item) => item.product.toString() !== productId);
        } else {
            const product = await Product.findById(productId);
            item.quantity = product ? Math.min(Number(quantity), product.stocks) : Number(quantity);
        }

        await cart.save();
        await cart.populate("items.product");

        return res.status(200).json({
            success: true,
            message: "Cart updated",
            cart,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error,
        });
    }
};

export const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;
        const cart = await getOrCreateCart(req.user._id);
        cart.items = cart.items.filter((item) => item.product.toString() !== productId);

        await cart.save();
        await cart.populate("items.product");

        return res.status(200).json({
            success: true,
            message: "Item removed from cart",
            cart,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error,
        });
    }
};

export const clearCart = async (req, res) => {
    try {
        const cart = await getOrCreateCart(req.user._id);
        cart.items = [];
        await cart.save();

        return res.status(200).json({
            success: true,
            message: "Cart cleared",
            cart,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error,
        });
    }
};
