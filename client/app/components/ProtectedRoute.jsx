import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const ProtectedRoute = ({ allowedRoles = [], children, redirectTo = "/login" }) => {
  const { bootstrapping, isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (bootstrapping) {
    return (
      <section className="section-shell">
        <div className="card flex min-h-[220px] items-center justify-center text-sm text-ink-500">
          Loading your account...
        </div>
      </section>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace state={{ from: `${location.pathname}${location.search}${location.hash}` }} />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
