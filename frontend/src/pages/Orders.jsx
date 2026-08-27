import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiPackage, FiChevronRight } from "react-icons/fi";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../api/axios";

const statusStyles = {
  Processing: "bg-amber-50 text-amber-600",
  Shipped: "bg-blue-50 text-blue-600",
  Delivered: "bg-green-50 text-green-600",
  Cancelled: "bg-red-50 text-red-600",
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get("/orders/my-orders");
        setOrders(data.orders || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-2">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-sm text-gray-500">Loading orders...</p>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-gray-400">
            <FiPackage size={32} />
            <p className="text-sm">You haven't placed any orders yet.</p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors"
            >
              Browse products
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <Link
                key={order._id}
                to={`/orders/${order._id}`}
                className="flex items-center justify-between bg-white border border-gray-100 rounded-2xl shadow-sm p-5 hover:shadow-md transition-shadow"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-900">Order #{order._id.slice(-8).toUpperCase()}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(order.createdAt).toLocaleDateString()} · {order.items.length} item
                    {order.items.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusStyles[order.status] || "bg-gray-100 text-gray-600"}`}
                  >
                    {order.status}
                  </span>
                  <span className="font-semibold text-gray-900">${order.totalAmount.toFixed(2)}</span>
                  <FiChevronRight className="text-gray-400" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Orders;
