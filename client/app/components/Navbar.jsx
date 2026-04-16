import { Building2, LayoutDashboard, LogIn, MapPin, Menu, Phone, UserCircle2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { COMPANY_INFO } from "../data/siteContent.js";
import { toPhoneHref } from "../utils/format.js";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Services", href: "/#services" },
  { label: "Contracts", href: "/#contractor" },
  { label: "Properties", to: "/properties" },
  { label: "Proof", href: "/#documents" },
  { label: "Contact", href: "/#contact" }
];

const navClass = ({ isActive }) =>
  `rounded-full px-4 py-2 text-sm font-semibold transition ${
    isActive ? "bg-brand-500 text-white shadow-sm" : "text-ink-600 hover:bg-brand-50 hover:text-brand-700"
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
    <header className="sticky top-0 z-40 border-b border-brand-100/70 bg-cream-100/90 backdrop-blur-xl">
      <div className="section-shell py-3">
        <div className="glass-panel flex items-center justify-between gap-3 rounded-2xl bg-white/80 px-4 py-3">
          <NavLink to="/" className="flex min-w-0 items-center gap-3">
            <span className="rounded-2xl bg-brand-500 p-2.5 text-white shadow-sm">
              <Building2 size={20} />
            </span>
            <div className="min-w-0">
              <span className="block text-[11px] uppercase tracking-[0.3em] text-brand-600">Sagar, Madhya Pradesh</span>
              <span className="block truncate text-lg font-bold text-ink-700">{COMPANY_INFO.name}</span>
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
                  className="rounded-full px-4 py-2 text-sm font-semibold text-ink-600 transition hover:bg-brand-50 hover:text-brand-700"
                >
                  {item.label}
                </a>
              )
            )}
            {isAuthenticated && isAdmin ? (
              <NavLink className={navClass} to="/admin">
                Dashboard
              </NavLink>
            ) : null}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <a href={toPhoneHref(COMPANY_INFO.phoneDisplay)} className="btn-secondary">
              <Phone size={16} />
              Call Now
            </a>

            {!isAuthenticated ? (
              <NavLink to="/login" className="btn-primary">
                <LogIn size={16} />
                Login / Admin
              </NavLink>
            ) : (
              <>
                <span className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-brand-50 px-4 py-3 text-xs font-semibold text-ink-600">
                  <UserCircle2 size={14} /> {user?.name}
                </span>
                {isAdmin ? (
                  <NavLink to="/admin" className="btn-secondary">
                    <LayoutDashboard size={16} />
                    Dashboard
                  </NavLink>
                ) : null}
                <button onClick={handleLogout} className="btn-secondary">
                  Logout
                </button>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((current) => !current)}
            className="btn-secondary px-4 lg:hidden"
            aria-expanded={menuOpen}
            aria-label="Toggle navigation"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {menuOpen ? (
          <div className="card mt-3 space-y-4 lg:hidden">
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
                    className="rounded-full px-4 py-3 text-sm font-semibold text-ink-600 transition hover:bg-brand-50 hover:text-brand-700"
                  >
                    {item.label}
                  </a>
                )
              )}
            </div>

            <div className="rounded-2xl border border-brand-100 bg-brand-50 p-4 text-sm text-ink-600">
              <p className="inline-flex items-center gap-2 font-semibold text-brand-700">
                <MapPin size={16} />
                {COMPANY_INFO.location}
              </p>
              <p className="mt-2">Owner: {COMPANY_INFO.owner}</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <a href={toPhoneHref(COMPANY_INFO.phoneDisplay)} className="btn-secondary w-full">
                <Phone size={16} />
                Contact Now
              </a>

              {!isAuthenticated ? (
                <NavLink to="/login" className="btn-primary w-full">
                  Login / Admin
                </NavLink>
              ) : (
                <button onClick={handleLogout} className="btn-secondary w-full">
                  Logout
                </button>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
};

export default Navbar;
