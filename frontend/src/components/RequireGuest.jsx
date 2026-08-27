import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const RequireGuest = ({ children }) => {
  const { user } = useAuth();
  if (user) {
    return <Navigate to={user.role === "admin" ? "/admin" : "/"} replace />;
  }
  return children;
};

export default RequireGuest;
