import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const ProtectedRoute = ({
  allowedRoles = [],
  redirectTo = "/login",
  unauthorizedTo = "/",
  children
}) => {
  const { bootstrapping, isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (bootstrapping) {
    return (
      <div className="card flex min-h-[240px] items-center justify-center text-sm text-slate-500">
        Loading your account...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace state={{ from: location.pathname }} />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to={unauthorizedTo} replace />;
  }

  return children;
};

export default ProtectedRoute;
