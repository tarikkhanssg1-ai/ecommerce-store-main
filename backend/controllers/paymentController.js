import getStripe from "../utils/stripe.js";
import Cart from "../models/cartModel.js";

export const createPaymentIntent = async (req, res) => {
    try {
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

        const totalAmount = cart.items.reduce(
            (sum, item) => sum + item.product.price * item.quantity,
            0
        );
        const amountInCents = Math.round(totalAmount * 100);

        const paymentIntent = await getStripe().paymentIntents.create({
            amount: amountInCents,
            currency: "usd",
            automatic_payment_methods: { enabled: true },
            metadata: { userId: req.user._id.toString() },
        });

        return res.status(200).json({
            success: true,
            clientSecret: paymentIntent.client_secret,
            amount: totalAmount,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error,
        });
    }
};

export const getStripeKey = (req, res) => {
    return res.status(200).json({
        success: true,
        stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    });
};
