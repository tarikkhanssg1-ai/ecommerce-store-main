import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiShoppingCart, FiCheck } from "react-icons/fi";
import { useAuth } from "../context/useAuth";
import { useCart } from "../context/useCart";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const outOfStock = product.stocks <= 0;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }
    setAdding(true);
    try {
      await addToCart(product._id, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    } finally {
      setAdding(false);
    }
  };

  return (
    <Link
      to={`/product/${product._id}`}
      className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow overflow-hidden block"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img
          src={product.images?.[0]?.url}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {outOfStock && (
          <span className="absolute top-3 left-3 bg-gray-900/80 text-white text-[10px] font-semibold px-2 py-1 rounded-full">
            Out of stock
          </span>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs text-gray-400 uppercase tracking-wide">{product.category}</p>
        <h3 className="font-semibold text-gray-900 text-sm truncate mt-0.5">{product.title}</h3>
        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-bold text-gray-900">${product.price}</span>
          <button
            onClick={handleAddToCart}
            disabled={outOfStock || adding}
            className="w-9 h-9 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center hover:bg-brand-600 hover:text-white transition-colors disabled:opacity-40 disabled:hover:bg-brand-50 disabled:hover:text-brand-600"
            aria-label="Add to cart"
          >
            {added ? <FiCheck size={16} /> : <FiShoppingCart size={16} />}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
