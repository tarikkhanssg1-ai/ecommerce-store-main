import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const RequireAdmin = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default RequireAdmin;
