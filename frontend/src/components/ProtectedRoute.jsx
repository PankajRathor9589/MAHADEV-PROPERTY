import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({
  children,
  roles = [],
  redirectTo = "/login",
  unauthorizedTo = "/",
  requireAdminSession = false
}) => {
  const { user, loading, isAdminSession } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="grid min-h-[50vh] place-items-center">
        <div className="panel-card flex items-center gap-3 px-5 py-4 text-sm text-slate-600">
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-brand-500" />
          Loading your workspace...
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (requireAdminSession && !isAdminSession) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to={unauthorizedTo} replace />;
  }

  return children;
};

export default ProtectedRoute;
