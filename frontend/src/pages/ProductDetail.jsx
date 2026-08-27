import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiMinus, FiPlus, FiShoppingCart, FiCheck } from "react-icons/fi";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../api/axios";
import { useAuth } from "../context/useAuth";
import { useCart } from "../context/useCart";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/products/product-detail/${id}`);
        setProduct(data.product);
        setQuantity(1);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load product.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setAdding(true);
    try {
      await addToCart(product._id, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add to cart.");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <Link to="/shop" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-brand-600 mb-6">
          <FiArrowLeft size={16} /> Back to shop
        </Link>

        {loading ? (
          <p className="text-sm text-gray-500">Loading product...</p>
        ) : error && !product ? (
          <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3 max-w-md">
            {error}
          </div>
        ) : product ? (
          <div className="grid md:grid-cols-2 gap-10">
            <div className="aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
              <img
                src={product.images?.[0]?.url}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide">{product.category}</p>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{product.title}</h1>
              <p className="text-2xl font-bold text-brand-600 mt-4">${product.price}</p>

              <p className="text-gray-600 mt-6 leading-relaxed">{product.description}</p>

              <p className="mt-6 text-sm">
                {product.stocks > 0 ? (
                  <span className="text-green-600 font-medium">In stock ({product.stocks} available)</span>
                ) : (
                  <span className="text-red-600 font-medium">Out of stock</span>
                )}
              </p>

              {error && (
                <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-2">
                  {error}
                </div>
              )}

              {product.stocks > 0 && (
                <div className="mt-6 flex items-center gap-4">
                  <div className="flex items-center border border-gray-200 rounded-full">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-brand-600"
                      aria-label="Decrease quantity"
                    >
                      <FiMinus size={16} />
                    </button>
                    <span className="w-10 text-center text-sm font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(product.stocks, q + 1))}
                      className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-brand-600"
                      aria-label="Increase quantity"
                    >
                      <FiPlus size={16} />
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={adding}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-semibold px-6 py-3 rounded-full transition-colors"
                  >
                    {added ? <FiCheck size={18} /> : <FiShoppingCart size={18} />}
                    {added ? "Added to cart" : adding ? "Adding..." : "Add to Cart"}
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
