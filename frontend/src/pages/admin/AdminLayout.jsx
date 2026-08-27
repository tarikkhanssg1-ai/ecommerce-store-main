import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { FiGrid, FiLogOut, FiArrowLeft, FiBox, FiUsers } from "react-icons/fi";
import { useAuth } from "../../context/useAuth";

const AdminLayout = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-60 shrink-0 bg-white border-r border-gray-100 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <Link to="/admin" className="text-xl font-extrabold tracking-tight text-brand-600">
            Shop<span className="text-gray-900">Ease</span>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? "bg-brand-50 text-brand-600" : "text-gray-600 hover:bg-gray-50"
              }`
            }
          >
            <FiGrid size={18} />
            Dashboard
          </NavLink>
          <NavLink
            to="/admin/products"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? "bg-brand-50 text-brand-600" : "text-gray-600 hover:bg-gray-50"
              }`
            }
          >
            <FiBox size={18} />
            Products
          </NavLink>
          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? "bg-brand-50 text-brand-600" : "text-gray-600 hover:bg-gray-50"
              }`
            }
          >
            <FiUsers size={18} />
            Users
          </NavLink>
        </nav>

        <div className="p-3 border-t border-gray-100 space-y-1">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <FiArrowLeft size={18} />
            Back to store
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <FiLogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6">
          <h1 className="text-lg font-bold text-gray-900">Admin Dashboard</h1>
          <span className="text-sm text-gray-500">{user?.name}</span>
        </header>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
