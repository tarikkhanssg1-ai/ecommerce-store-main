import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiArrowLeft, FiCamera } from "react-icons/fi";
import api from "../api/axios";
import { useAuth } from "../context/useAuth";

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const Signup = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [preview, setPreview] = useState(null);
  const [profileFile, setProfileFile] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProfileFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!profileFile) {
      setError("Please upload a profile picture.");
      return;
    }

    setLoading(true);
    try {
      const base64 = await fileToBase64(profileFile);
      const { data } = await api.post("/users/register-user", {
        name: form.name,
        email: form.email,
        password: form.password,
        profile: {
          public_id: profileFile.name,
          url: base64,
        },
      });
      login(data.user);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-brand-600 mb-6">
          <FiArrowLeft size={16} /> Back to home
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="text-center mb-8">
            <span className="text-2xl font-extrabold tracking-tight text-brand-600">
              Shop<span className="text-gray-900">Ease</span>
            </span>
            <h1 className="text-xl font-bold text-gray-900 mt-4">Create your account</h1>
            <p className="text-gray-500 text-sm mt-1">Join us and start shopping today</p>
          </div>

          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-2">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex justify-center">
              <label htmlFor="profile" className="relative cursor-pointer group">
                <div className="w-20 h-20 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden group-hover:border-brand-500 transition-colors">
                  {preview ? (
                    <img src={preview} alt="Profile preview" className="w-full h-full object-cover" />
                  ) : (
                    <FiCamera className="text-gray-400" size={24} />
                  )}
                </div>
                <span className="absolute -bottom-1 -right-1 bg-brand-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                  +
                </span>
                <input
                  id="profile"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
              <div className="flex items-center border border-gray-200 rounded-lg px-3 focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-brand-500">
                <FiUser className="text-gray-400 shrink-0" size={18} />
                <input
                  type="text"
                  name="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full px-3 py-2.5 outline-none text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
              <div className="flex items-center border border-gray-200 rounded-lg px-3 focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-brand-500">
                <FiMail className="text-gray-400 shrink-0" size={18} />
                <input
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full px-3 py-2.5 outline-none text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="flex items-center border border-gray-200 rounded-lg px-3 focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-brand-500">
                <FiLock className="text-gray-400 shrink-0" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  minLength={6}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-3 py-2.5 outline-none text-sm"
                />
                <button type="button" onClick={() => setShowPassword((v) => !v)} className="text-gray-400 shrink-0">
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm password</label>
              <div className="flex items-center border border-gray-200 rounded-lg px-3 focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-brand-500">
                <FiLock className="text-gray-400 shrink-0" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  required
                  minLength={6}
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-3 py-2.5 outline-none text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-brand-600 font-semibold hover:underline">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
