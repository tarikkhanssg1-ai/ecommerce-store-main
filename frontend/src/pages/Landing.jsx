import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiTruck, FiShield, FiRefreshCw, FiHeadphones } from "react-icons/fi";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { categories } from "../data/dummyData";
import api from "../api/axios";
import heroImage from "../assets/hero.png";

const perks = [
  { icon: FiTruck, title: "Free Shipping", desc: "On all orders over $50" },
  { icon: FiRefreshCw, title: "Easy Returns", desc: "30-day return policy" },
  { icon: FiShield, title: "Secure Payment", desc: "100% protected checkout" },
  { icon: FiHeadphones, title: "24/7 Support", desc: "Dedicated support team" },
];

const Landing = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await api.get("/products/get-all-products");
        setFeaturedProducts((data.products || []).slice(0, 4));
      } catch {
        setFeaturedProducts([]);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="bg-gradient-to-br from-brand-50 via-white to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block bg-brand-100 text-brand-700 text-xs font-semibold px-3 py-1 rounded-full">
              New Season Collection
            </span>
            <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
              Shop the Look, <br />
              <span className="text-brand-600">Own the Moment</span>
            </h1>
            <p className="mt-5 text-gray-600 text-lg max-w-md">
              Discover curated collections across fashion, electronics, and home essentials — all in one place.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 bg-brand-600 text-white font-semibold px-6 py-3 rounded-full hover:bg-brand-700 transition-colors"
              >
                Shop Now <FiArrowRight />
              </Link>
              <Link
                to="/categories"
                className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-full hover:border-brand-600 hover:text-brand-600 transition-colors"
              >
                Browse Categories
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-3xl overflow-hidden bg-brand-100 shadow-xl">
              <img src={heroImage} alt="Featured products" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {perks.map((perk) => (
            <div key={perk.title} className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                <perk.icon size={20} />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{perk.title}</p>
                <p className="text-xs text-gray-500">{perk.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Shop by Category</h2>
            <p className="text-gray-500 mt-1 text-sm">Find exactly what you're looking for</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to="/categories"
              className="flex flex-col items-center justify-center gap-2 bg-gray-50 hover:bg-brand-50 border border-gray-100 rounded-2xl py-6 transition-colors"
            >
              <span className="text-3xl">{cat.emoji}</span>
              <span className="text-sm font-medium text-gray-700">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Featured Products</h2>
              <p className="text-gray-500 mt-1 text-sm">Hand-picked favorites just for you</p>
            </div>
            <Link to="/shop" className="hidden sm:inline-flex items-center gap-1 text-brand-600 font-semibold text-sm hover:gap-2 transition-all">
              View All <FiArrowRight size={16} />
            </Link>
          </div>
          {featuredProducts.length === 0 ? (
            <p className="text-sm text-gray-500">No products available yet.</p>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gray-900 rounded-3xl px-8 py-12 sm:py-16 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Join Our Newsletter</h2>
          <p className="text-gray-400 mt-2 max-w-md mx-auto">
            Get 10% off your first order and stay up to date with the latest drops and deals.
          </p>
          <form className="mt-6 flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-5 py-3 rounded-full outline-none text-sm"
            />
            <button className="bg-brand-600 hover:bg-brand-700 text-white font-semibold px-6 py-3 rounded-full transition-colors">
              Subscribe
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
