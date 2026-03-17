import { Building2, Heart, LayoutDashboard, LogOut, Menu, Search, ShieldCheck, User2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const linkClass = ({ isActive }) =>
  `rounded-full px-4 py-2 text-sm font-semibold transition ${
    isActive
      ? "bg-brand-600 text-white shadow-panel"
      : "text-slate-700 hover:bg-white/80 hover:text-brand-700"
  }`;

const Navbar = () => {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const dashboardPath = isAdmin ? "/admin" : "/dashboard";
  const dashboardLabel = isAdmin ? "Admin" : "Dashboard";

  return (
    <header className="sticky top-0 z-30 border-b border-white/60 bg-[#f8fbf9]/85 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
        <NavLink to="/" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-panel">
            <Building2 size={22} />
          </span>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-700">Mahadev</p>
            <p className="text-lg font-bold text-slate-900">Property</p>
          </div>
        </NavLink>

        <nav className="hidden items-center gap-2 lg:flex">
          <NavLink to="/" className={linkClass}>
            Home
          </NavLink>
          <NavLink to="/properties" className={linkClass}>
            Browse
          </NavLink>
          {isAuthenticated && (
            <NavLink to="/favorites" className={linkClass}>
              Favorites
            </NavLink>
          )}
          {isAuthenticated && (
            <NavLink to={dashboardPath} className={linkClass}>
              {dashboardLabel}
            </NavLink>
          )}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {!isAuthenticated ? (
            <>
              <NavLink to="/login" className="btn-secondary">
                Login
              </NavLink>
              <NavLink to="/register" className="btn-primary">
                Post Property
              </NavLink>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 rounded-full border border-white/70 bg-white/80 px-4 py-2 shadow-sm">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                  {isAdmin ? <ShieldCheck size={18} /> : <User2 size={18} />}
                </span>
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
                  <p className="text-xs uppercase tracking-wide text-slate-500">{user?.role}</p>
                </div>
              </div>
              <NavLink to="/properties" className="btn-secondary">
                <Search size={16} />
                Browse
              </NavLink>
              <NavLink to="/favorites" className="btn-secondary">
                <Heart size={16} />
                Saved
              </NavLink>
              <NavLink to={dashboardPath} className="btn-secondary">
                <LayoutDashboard size={16} />
                {dashboardLabel}
              </NavLink>
              <button type="button" onClick={handleLogout} className="btn-danger">
                <LogOut size={16} />
                Logout
              </button>
            </>
          )}
        </div>

        <button
          type="button"
          className="btn-secondary lg:hidden"
          onClick={() => setMenuOpen((current) => !current)}
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-white/60 bg-white/95 px-4 py-4 lg:hidden sm:px-6">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-2">
            <NavLink to="/" className={linkClass}>
              Home
            </NavLink>
            <NavLink to="/properties" className={linkClass}>
              Browse
            </NavLink>
            {isAuthenticated && (
              <NavLink to="/favorites" className={linkClass}>
                Favorites
              </NavLink>
            )}
            {isAuthenticated && (
              <NavLink to={dashboardPath} className={linkClass}>
                {dashboardLabel}
              </NavLink>
            )}
            {!isAuthenticated ? (
              <>
                <NavLink to="/login" className="btn-secondary">
                  Login
                </NavLink>
                <NavLink to="/register" className="btn-primary">
                  Post Property
                </NavLink>
              </>
            ) : (
              <button type="button" onClick={handleLogout} className="btn-danger">
                <LogOut size={16} />
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
