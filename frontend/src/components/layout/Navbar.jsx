import { useState } from "react";
import { FaBalanceScale, FaBars, FaBuilding, FaHeart, FaPhoneAlt, FaTimes } from "react-icons/fa";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { BRAND, CONTACT } from "../../config/site";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";

const linkClass = ({ isActive }) =>
  [
    "rounded-full px-4 py-2 text-sm font-medium transition",
    isActive ? "bg-brand-50 text-brand-700" : "text-slate-700 hover:bg-white hover:text-slate-900"
  ].join(" ");

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { compareCount } = useApp();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const dashboardPath = user?.role === "admin" ? "/admin" : user?.role === "agent" ? "/agent" : null;

  const handleLogout = () => {
    logout();
    navigate("/");
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-[1440px]">
        <div className="hidden items-center justify-between rounded-[28px] bg-ink px-4 py-2 text-xs text-white shadow-soft md:flex">
          <p>Verified listings, map-backed browsing, saved properties, and quick compare flows in one responsive portal.</p>
          <a href={`tel:${CONTACT.phoneRaw}`} className="inline-flex items-center gap-2 font-semibold text-sand-100">
            <FaPhoneAlt />
            {CONTACT.phone}
          </a>
        </div>

        <div className="mt-3 flex items-center justify-between rounded-[28px] border border-white/70 bg-white/82 px-4 py-3 shadow-soft backdrop-blur sm:px-5">
          <Link to="/" className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-500 text-white shadow-soft">
              <FaBuilding />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-700">Real estate portal</p>
              <h1 className="text-lg font-bold text-ink">{BRAND.name}</h1>
            </div>
          </Link>

          <nav className="hidden items-center gap-2 lg:flex">
            <NavLink to="/" className={linkClass}>
              Home
            </NavLink>
            <NavLink to="/properties" className={linkClass}>
              Properties
            </NavLink>
            {user && (
              <NavLink to="/favorites" className={linkClass}>
                Saved
              </NavLink>
            )}
            <NavLink to="/compare" className={linkClass}>
              Compare{compareCount > 0 ? ` (${compareCount})` : ""}
            </NavLink>
            {dashboardPath && (
              <NavLink to={dashboardPath} className={linkClass}>
                Dashboard
              </NavLink>
            )}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <Link to="/compare" className="btn-secondary">
              <FaBalanceScale />
              Compare{compareCount > 0 ? ` (${compareCount})` : ""}
            </Link>
            {user && (
              <Link to="/favorites" className="btn-secondary">
                <FaHeart />
                Saved
              </Link>
            )}
            <Link to="/agent" className="btn-secondary">
              Post property
            </Link>
            {!user && (
              <>
                <Link to="/login" className="btn-secondary">
                  Login
                </Link>
                <Link to="/signup" className="btn-primary">
                  Create account
                </Link>
              </>
            )}
            {user && (
              <>
                <div className="rounded-full bg-sand-50 px-4 py-2 text-sm font-semibold text-slate-700">
                  {user.name} · {user.role}
                </div>
                <button type="button" onClick={handleLogout} className="btn-primary">
                  Logout
                </button>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="grid h-11 w-11 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-700 lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {open && (
          <div className="mt-3 rounded-[28px] border border-white/70 bg-white/92 p-4 shadow-card backdrop-blur lg:hidden">
            <nav className="grid gap-2">
              <NavLink to="/" onClick={() => setOpen(false)} className={linkClass}>
                Home
              </NavLink>
              <NavLink to="/properties" onClick={() => setOpen(false)} className={linkClass}>
                Properties
              </NavLink>
              {user && (
                <NavLink to="/favorites" onClick={() => setOpen(false)} className={linkClass}>
                  Saved
                </NavLink>
              )}
              <NavLink to="/compare" onClick={() => setOpen(false)} className={linkClass}>
                Compare{compareCount > 0 ? ` (${compareCount})` : ""}
              </NavLink>
              {dashboardPath && (
                <NavLink to={dashboardPath} onClick={() => setOpen(false)} className={linkClass}>
                  Dashboard
                </NavLink>
              )}
            </nav>

            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <a href={`tel:${CONTACT.phoneRaw}`} className="btn-secondary justify-center">
                <FaPhoneAlt />
                Call now
              </a>
              <Link to="/compare" onClick={() => setOpen(false)} className="btn-secondary justify-center">
                <FaBalanceScale />
                Compare
              </Link>
              {user && (
                <Link to="/favorites" onClick={() => setOpen(false)} className="btn-secondary justify-center">
                  <FaHeart />
                  Saved
                </Link>
              )}
              <Link to="/agent" onClick={() => setOpen(false)} className="btn-secondary justify-center">
                Post property
              </Link>
              {!user ? (
                <>
                  <Link to="/login" onClick={() => setOpen(false)} className="btn-secondary justify-center">
                    Login
                  </Link>
                  <Link to="/signup" onClick={() => setOpen(false)} className="btn-primary justify-center sm:col-span-2">
                    Create account
                  </Link>
                </>
              ) : (
                <button type="button" onClick={handleLogout} className="btn-primary justify-center sm:col-span-2">
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
