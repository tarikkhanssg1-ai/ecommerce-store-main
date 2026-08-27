import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../api/axios";
import { useCart } from "../context/useCart";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const emptyShipping = {
  fullName: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  phone: "",
};

const cardElementOptions = {
  style: {
    base: {
      fontSize: "14px",
      color: "#111827",
      "::placeholder": { color: "#9ca3af" },
    },
    invalid: {
      color: "#dc2626",
    },
  },
};

const CheckoutForm = ({ items, subtotal }) => {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const { refreshCart } = useCart();
  const [shipping, setShipping] = useState(emptyShipping);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setError("");
    setSubmitting(true);
    try {
      const { data: intentData } = await api.post("/payment/create-payment-intent");

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        intentData.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: shipping.fullName,
              phone: shipping.phone,
              address: {
                line1: shipping.address,
                city: shipping.city,
                state: shipping.state,
                postal_code: shipping.pincode,
              },
            },
          },
        }
      );

      if (stripeError) {
        setError(stripeError.message || "Payment failed. Please check your card details.");
        return;
      }

      if (paymentIntent.status !== "succeeded") {
        setError("Payment was not completed. Please try again.");
        return;
      }

      const { data } = await api.post("/orders/create-order", {
        shippingInfo: shipping,
        paymentIntentId: paymentIntent.id,
      });
      await refreshCart();
      navigate(`/orders/${data.order._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place order.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-2">
          {error}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-4">
          <h2 className="font-semibold text-gray-900">Shipping Information</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
            <input
              type="text"
              name="fullName"
              required
              value={shipping.fullName}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input
              type="text"
              name="address"
              required
              value={shipping.address}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input
                type="text"
                name="city"
                required
                value={shipping.city}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
              <input
                type="text"
                name="state"
                required
                value={shipping.state}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
              <input
                type="text"
                name="pincode"
                required
                value={shipping.pincode}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                name="phone"
                required
                value={shipping.phone}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              />
            </div>
          </div>

          <h2 className="font-semibold text-gray-900 pt-2">Payment</h2>
          <div className="w-full border border-gray-200 rounded-lg px-3 py-3 focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-brand-500">
            <CardElement options={cardElementOptions} />
          </div>
          <p className="text-xs text-gray-500">Your card is charged securely via Stripe.</p>

          <button
            type="submit"
            disabled={submitting || !stripe}
            className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-semibold py-3 rounded-full transition-colors"
          >
            {submitting ? "Processing payment..." : `Pay & Place Order · $${subtotal.toFixed(2)}`}
          </button>
        </form>

        <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6 h-fit space-y-3">
          <h2 className="font-semibold text-gray-900 mb-2">Order Summary</h2>
          {items.map((item) => (
            <div key={item._id} className="flex items-center justify-between text-sm text-gray-600">
              <span className="truncate pr-2">
                {item.product.title} × {item.quantity}
              </span>
              <span className="shrink-0">${(item.product.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t border-gray-200 pt-3 flex items-center justify-between font-semibold text-gray-900">
            <span>Total</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </>
  );
};

const Checkout = () => {
  const { items, subtotal, loading } = useCart();

  if (!loading && items.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        {!loading && items.length > 0 && (
          <Elements stripe={stripePromise}>
            <CheckoutForm items={items} subtotal={subtotal} />
          </Elements>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
