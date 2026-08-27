import { Link } from "react-router-dom";
import { FiUser, FiMail, FiArrowLeft } from "react-icons/fi";
import { useAuth } from "../context/useAuth";

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-brand-600 mb-6">
          <FiArrowLeft size={16} /> Back to home
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex flex-col items-center text-center mb-6">
            {user?.profile?.url ? (
              <img
                src={user.profile.url}
                alt={user.name}
                className="w-20 h-20 rounded-full object-cover mb-4"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <FiUser className="text-gray-400" size={28} />
              </div>
            )}
            <h1 className="text-xl font-bold text-gray-900">{user?.name}</h1>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-3">
              <FiUser className="text-gray-400 shrink-0" size={18} />
              <div>
                <p className="text-xs text-gray-500">Full name</p>
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-3">
              <FiMail className="text-gray-400 shrink-0" size={18} />
              <div>
                <p className="text-xs text-gray-500">Email address</p>
                <p className="text-sm font-medium text-gray-900">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
