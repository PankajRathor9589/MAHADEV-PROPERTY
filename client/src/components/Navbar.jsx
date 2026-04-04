import { Building2, LayoutDashboard, LogOut, UserCircle2 } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const navClass = ({ isActive }) =>
  `rounded-full px-4 py-2 text-sm font-medium transition ${
    isActive ? "bg-brand-600 text-white" : "text-slate-700 hover:bg-slate-200"
  }`;

const Navbar = () => {
  const { isAuthenticated, isAdmin, isSeller, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const dashboardPath = isAdmin ? "/admin/dashboard" : isSeller ? "/seller/dashboard" : "/";

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <NavLink to="/" className="flex items-center gap-2">
          <span className="rounded-xl bg-brand-600 p-2 text-white">
            <Building2 size={20} />
          </span>
          <span className="text-lg font-bold text-slate-900">Sagar Infra</span>
        </NavLink>

        <nav className="hidden items-center gap-2 md:flex">
          <NavLink className={navClass} to="/">
            Home
          </NavLink>
          <NavLink className={navClass} to="/properties">
            Listings
          </NavLink>
          {isAuthenticated && (isAdmin || isSeller) && (
            <NavLink className={navClass} to={dashboardPath}>
              Dashboard
            </NavLink>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {!isAuthenticated ? (
            <>
              <NavLink to="/login" className="btn-secondary">
                Login
              </NavLink>
              <NavLink to="/register" className="btn-primary hidden sm:inline-flex">
                Register
              </NavLink>
            </>
          ) : (
            <>
              <span className="hidden items-center gap-1 rounded-full bg-slate-100 px-3 py-2 text-xs font-medium text-slate-700 sm:inline-flex">
                <UserCircle2 size={14} /> {user?.name}
              </span>
              {(isAdmin || isSeller) && (
                <NavLink to={dashboardPath} className="btn-secondary">
                  <LayoutDashboard size={16} />
                  <span className="hidden sm:inline">Dashboard</span>
                </NavLink>
              )}
              <button onClick={handleLogout} className="btn-danger">
                <LogOut size={16} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
