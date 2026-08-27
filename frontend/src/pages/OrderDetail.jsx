import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FiArrowLeft, FiCheckCircle } from "react-icons/fi";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../api/axios";

const statusStyles = {
  Processing: "bg-amber-50 text-amber-600",
  Shipped: "bg-blue-50 text-blue-600",
  Delivered: "bg-green-50 text-green-600",
  Cancelled: "bg-red-50 text-red-600",
};

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/orders/order-detail/${id}`);
        setOrder(data.order);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load order.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <Link to="/orders" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-brand-600 mb-6">
          <FiArrowLeft size={16} /> Back to orders
        </Link>

        {loading ? (
          <p className="text-sm text-gray-500">Loading order...</p>
        ) : error ? (
          <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3 max-w-md">
            {error}
          </div>
        ) : order ? (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-100 rounded-2xl p-5 flex items-center gap-3">
              <FiCheckCircle className="text-green-600 shrink-0" size={24} />
              <div>
                <p className="font-semibold text-green-800">Order placed successfully</p>
                <p className="text-sm text-green-700">Order #{order._id.slice(-8).toUpperCase()}</p>
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-900">Order Status</h2>
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusStyles[order.status] || "bg-gray-100 text-gray-600"}`}
                >
                  {order.status}
                </span>
              </div>
              <p className="text-xs text-gray-500">Placed on {new Date(order.createdAt).toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">
                Payment:{" "}
                <span className={order.isPaid ? "text-green-600 font-medium" : "text-amber-600 font-medium"}>
                  {order.isPaid ? "Paid" : "Unpaid"}
                </span>
              </p>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Items</h2>
              <div className="space-y-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">
                      {item.title} × {item.quantity}
                    </span>
                    <span className="font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 mt-4 pt-4 flex items-center justify-between font-semibold text-gray-900">
                <span>Total</span>
                <span>${order.totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
              <h2 className="font-semibold text-gray-900 mb-3">Shipping Information</h2>
              <div className="text-sm text-gray-600 space-y-1">
                <p className="text-gray-900 font-medium">{order.shippingInfo.fullName}</p>
                <p>{order.shippingInfo.address}</p>
                <p>
                  {order.shippingInfo.city}, {order.shippingInfo.state} {order.shippingInfo.pincode}
                </p>
                <p>{order.shippingInfo.phone}</p>
              </div>
            </div>
          </div>
        ) : null}
      </main>

      <Footer />
    </div>
  );
};

export default OrderDetail;
