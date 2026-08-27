import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMinus, FiPlus, FiTrash2, FiShoppingBag, FiArrowLeft } from "react-icons/fi";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../context/useCart";

const Cart = () => {
  const navigate = useNavigate();
  const { items, loading, subtotal, updateQty, removeItem } = useCart();
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");

  const handleQtyChange = async (productId, quantity) => {
    setBusyId(productId);
    try {
      await updateQty(productId, quantity);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update quantity.");
    } finally {
      setBusyId(null);
    }
  };

  const handleRemove = async (productId) => {
    setBusyId(productId);
    try {
      await removeItem(productId);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to remove item.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <Link to="/shop" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-brand-600 mb-6">
          <FiArrowLeft size={16} /> Continue shopping
        </Link>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-2">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-sm text-gray-500">Loading cart...</p>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-gray-400">
            <FiShoppingBag size={32} />
            <p className="text-sm">Your cart is empty.</p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors"
            >
              Browse products
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center gap-4 bg-white border border-gray-100 rounded-2xl shadow-sm p-4"
                >
                  <Link to={`/product/${item.product._id}`} className="w-20 h-20 rounded-xl overflow-hidden bg-gray-50 shrink-0">
                    <img
                      src={item.product.images?.[0]?.url}
                      alt={item.product.title}
                      className="w-full h-full object-cover"
                    />
                  </Link>

                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/product/${item.product._id}`}
                      className="font-semibold text-gray-900 text-sm truncate hover:text-brand-600 block"
                    >
                      {item.product.title}
                    </Link>
                    <p className="text-sm text-gray-500 mt-1">${item.product.price}</p>
                  </div>

                  <div className="flex items-center border border-gray-200 rounded-full shrink-0">
                    <button
                      onClick={() => handleQtyChange(item.product._id, item.quantity - 1)}
                      disabled={busyId === item.product._id}
                      className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-brand-600 disabled:opacity-40"
                      aria-label="Decrease quantity"
                    >
                      <FiMinus size={14} />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => handleQtyChange(item.product._id, item.quantity + 1)}
                      disabled={busyId === item.product._id || item.quantity >= item.product.stocks}
                      className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-brand-600 disabled:opacity-40"
                      aria-label="Increase quantity"
                    >
                      <FiPlus size={14} />
                    </button>
                  </div>

                  <p className="w-16 text-right font-semibold text-gray-900 shrink-0">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>

                  <button
                    onClick={() => handleRemove(item.product._id)}
                    disabled={busyId === item.product._id}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-40 shrink-0"
                    aria-label="Remove item"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6 h-fit">
              <h2 className="font-semibold text-gray-900 mb-4">Order Summary</h2>
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <p className="text-xs text-gray-400 mb-4">Shipping and taxes calculated at checkout.</p>
              <button
                onClick={() => navigate("/checkout")}
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 rounded-full transition-colors"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
