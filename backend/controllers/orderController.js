import Order from "../models/orderModel.js";
import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";
import getStripe from "../utils/stripe.js";

export const createOrder = async (req, res) => {
    try {
        const { shippingInfo, paymentIntentId } = req.body;

        if (!paymentIntentId) {
            return res.status(400).json({
                success: false,
                message: "Payment is required to place an order",
            });
        }

        const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Your cart is empty",
            });
        }

        for (const item of cart.items) {
            if (!item.product || item.product.stocks < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `${item.product?.title || "A product"} does not have enough stock`,
                });
            }
        }

        const items = cart.items.map((item) => ({
            product: item.product._id,
            title: item.product.title,
            price: item.product.price,
            quantity: item.quantity,
        }));
        const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

        const paymentIntent = await getStripe().paymentIntents.retrieve(paymentIntentId);
        if (
            !paymentIntent ||
            paymentIntent.status !== "succeeded" ||
            paymentIntent.metadata?.userId !== req.user._id.toString() ||
            paymentIntent.amount !== Math.round(totalAmount * 100)
        ) {
            return res.status(400).json({
                success: false,
                message: "Payment could not be verified",
            });
        }

        const order = await Order.create({
            user: req.user._id,
            items,
            shippingInfo,
            totalAmount,
            paymentInfo: { id: paymentIntent.id, status: paymentIntent.status },
            isPaid: true,
            paidAt: Date.now(),
        });

        await Promise.all(
            cart.items.map((item) =>
                Product.findByIdAndUpdate(item.product._id, { $inc: { stocks: -item.quantity } })
            )
        );

        cart.items = [];
        await cart.save();

        return res.status(201).json({
            success: true,
            message: "Order placed successfully",
            order,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error,
        });
    }
};

export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            orders,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error,
        });
    }
};

export const getOrderDetail = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(400).json({
                success: false,
                message: "Order not found",
            });
        }

        if (order.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to view this order",
            });
        }

        return res.status(200).json({
            success: true,
            order,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error,
        });
    }
};
