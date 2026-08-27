import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiSearch, FiHeart, FiShoppingCart, FiUser, FiMenu, FiX, FiLogOut, FiGrid, FiPackage } from "react-icons/fi";
import { useAuth } from "../context/useAuth";
import { useCart } from "../context/useCart";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "Categories", to: "/categories" },
  { label: "Deals", to: "/deals" },
];

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleProfileClick = () => {
    if (user) {
      setProfileMenuOpen((open) => !open);
    } else {
      navigate("/login");
    }
  };

  const handleGoToProfile = () => {
    setProfileMenuOpen(false);
    navigate("/profile");
  };

  const handleGoToOrders = () => {
    setProfileMenuOpen(false);
    navigate("/orders");
  };

  const handleGoToAdmin = () => {
    setProfileMenuOpen(false);
    navigate("/admin");
  };

  const handleLogout = async () => {
    setProfileMenuOpen(false);
    await logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="text-2xl font-extrabold tracking-tight text-brand-600">
              Shop<span className="text-gray-900">Ease</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} className="hover:text-brand-600 transition-colors">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden sm:flex flex-1 max-w-md items-center bg-gray-100 rounded-full px-4 py-2">
            <FiSearch className="text-gray-400 mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Search products..."
              className="bg-transparent outline-none text-sm w-full placeholder:text-gray-400"
            />
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button className="hidden sm:inline-flex p-2 rounded-full hover:bg-gray-100 text-gray-700 transition-colors" aria-label="Wishlist">
              <FiHeart size={20} />
            </button>
            <Link
              to="/cart"
              className="p-2 rounded-full hover:bg-gray-100 text-gray-700 transition-colors relative"
              aria-label="Cart"
            >
              <FiShoppingCart size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={handleProfileClick}
                className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 text-gray-700 transition-colors"
                aria-label="Profile"
              >
                {user?.profile?.url ? (
                  <img src={user.profile.url} alt={user.name} className="w-7 h-7 rounded-full object-cover" />
                ) : (
                  <FiUser size={20} />
                )}
                <span className="hidden lg:inline text-sm font-medium">
                  {user ? user.name.split(" ")[0] : "Sign in"}
                </span>
              </button>

              {user && profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg border border-gray-100 py-1 text-sm text-gray-700">
                  <button
                    onClick={handleGoToProfile}
                    className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-left"
                  >
                    <FiUser size={16} />
                    Profile
                  </button>
                  <button
                    onClick={handleGoToOrders}
                    className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-left"
                  >
                    <FiPackage size={16} />
                    My Orders
                  </button>
                  {user.role === "admin" && (
                    <button
                      onClick={handleGoToAdmin}
                      className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-left"
                    >
                      <FiGrid size={16} />
                      Admin Dashboard
                    </button>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-left text-red-600"
                  >
                    <FiLogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
            <button
              className="md:hidden p-2 rounded-full hover:bg-gray-100 text-gray-700"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-4 flex flex-col gap-3 text-sm font-medium text-gray-700 border-t border-gray-100 pt-3">
            <div className="flex sm:hidden items-center bg-gray-100 rounded-full px-4 py-2 mb-1">
              <FiSearch className="text-gray-400 mr-2 shrink-0" />
              <input
                type="text"
                placeholder="Search products..."
                className="bg-transparent outline-none text-sm w-full placeholder:text-gray-400"
              />
            </div>
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} className="hover:text-brand-600" onClick={() => setMenuOpen(false)}>
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
