import { Building2, LayoutDashboard, LogIn, MapPin, Menu, Phone, UserCircle2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { COMPANY_INFO } from "../data/siteContent.js";
import { toPhoneHref } from "../utils/format.js";

const navItems = [
  { label: "Home", to: "/" },
  { label: "About", href: "/#about" },
  { label: "Services", href: "/#services" },
  { label: "Properties", to: "/properties" },
  { label: "Contact", href: "/#contact" }
];

const navClass = ({ isActive }) =>
  `rounded-full px-4 py-2 text-sm font-medium transition ${
    isActive ? "bg-white/12 text-white premium-outline" : "text-white/70 hover:bg-white/8 hover:text-white"
  }`;

const Navbar = () => {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname, location.hash]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-4">
      <div className="section-shell">
        <div className="glass-panel relative flex items-center justify-between gap-3 rounded-full px-4 py-3 shadow-panel">
          <NavLink to="/" className="flex items-center gap-3">
            <span className="rounded-2xl bg-gradient-to-br from-gold-300 to-gold-500 p-2.5 text-slate-950">
              <Building2 size={20} />
            </span>
            <div>
              <span className="block text-[11px] uppercase tracking-[0.35em] text-white/50">Sagar, Madhya Pradesh</span>
              <span className="text-lg font-semibold text-white">{COMPANY_INFO.name}</span>
            </div>
          </NavLink>

          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) =>
              item.to ? (
                <NavLink key={item.label} className={navClass} to={item.to}>
                  {item.label}
                </NavLink>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  className="rounded-full px-4 py-2 text-sm font-medium text-white/70 transition hover:bg-white/8 hover:text-white"
                >
                  {item.label}
                </a>
              )
            )}
            {isAuthenticated && isAdmin && (
              <NavLink className={navClass} to="/admin">
                Dashboard
              </NavLink>
            )}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <a href={toPhoneHref(COMPANY_INFO.phoneDisplay)} className="btn-secondary">
              <Phone size={16} />
              Contact Now
            </a>

            {!isAuthenticated ? (
              <NavLink to="/login" className="btn-secondary">
                <LogIn size={16} />
                Admin Login
              </NavLink>
            ) : (
              <>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-xs font-medium text-white/80">
                  <UserCircle2 size={14} /> {user?.name}
                </span>
                {isAdmin && (
                  <NavLink to="/admin" className="btn-secondary">
                    <LayoutDashboard size={16} />
                    Dashboard
                  </NavLink>
                )}
                <button onClick={handleLogout} className="btn-primary">
                  Logout
                </button>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((current) => !current)}
            className="btn-secondary lg:hidden"
            aria-label="Toggle navigation"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {menuOpen && (
          <div className="glass-panel mt-3 rounded-[28px] p-4 shadow-panel lg:hidden">
            <div className="grid gap-2">
              {navItems.map((item) =>
                item.to ? (
                  <NavLink key={item.label} className={navClass} to={item.to}>
                    {item.label}
                  </NavLink>
                ) : (
                  <a
                    key={item.label}
                    href={item.href}
                    className="rounded-full px-4 py-3 text-sm font-medium text-white/80 transition hover:bg-white/8 hover:text-white"
                  >
                    {item.label}
                  </a>
                )
              )}

              <div className="rounded-[24px] border border-white/10 bg-white/5 p-4 text-sm text-white/70">
                <p className="inline-flex items-center gap-2 text-gold-100">
                  <MapPin size={16} />
                  {COMPANY_INFO.location}
                </p>
                <p className="mt-2">Owner: {COMPANY_INFO.owner}</p>
              </div>

              <a href={toPhoneHref(COMPANY_INFO.phoneDisplay)} className="btn-secondary">
                <Phone size={16} />
                Contact Now
              </a>

              {!isAuthenticated ? (
                <NavLink to="/login" className="btn-secondary">
                  Admin Login
                </NavLink>
              ) : (
                <button onClick={handleLogout} className="btn-primary">
                  Logout
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
