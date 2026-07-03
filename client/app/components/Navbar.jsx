import { AnimatePresence, motion } from "framer-motion";
import { Heart, LayoutDashboard, LogOut, Menu, Phone, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { COMPANY_INFO } from "../data/siteContent.js";
import { toPhoneHref } from "../utils/format.js";
import BrandMark from "./BrandMark.jsx";

const navigationLinks = [
  { label: "Home", href: "/", hash: "" },
  { label: "Properties", href: "/properties", hash: "" },
  { label: "About", href: "/about", hash: "" },
  { label: "Services", href: "/property-management", hash: "" },
  { label: "Blog", href: "/blog", hash: "" },
  { label: "Contact", href: "/contact", hash: "" }
];

const Navbar = () => {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isHeroRoute = location.pathname === "/";
  const useLightChrome = isHeroRoute && !isScrolled;

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname, location.search, location.hash]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 16);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navLinkClass = (active = false) =>
    `rounded-full px-4 py-2 text-sm font-semibold transition duration-300 ${
      useLightChrome
        ? active
          ? "bg-white/14 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.28)]"
          : "text-white/78 hover:bg-white/10 hover:text-white"
        : active
          ? "bg-[#f2e7cf] text-ink-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]"
          : "text-ink-600 hover:bg-white hover:text-ink-900"
    }`;

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4 lg:px-8">
      <motion.div
        layout
        className={`mx-auto flex w-full max-w-[1320px] items-center justify-between gap-3 rounded-[28px] border px-3 py-3 transition duration-500 sm:rounded-full sm:px-5 ${
          useLightChrome
            ? "border-white/14 bg-white/[0.05] shadow-[0_18px_54px_rgba(6,12,20,0.16)] backdrop-blur-[22px]"
            : isScrolled
            ? "border-[#e5d9c7] bg-white/88 shadow-[0_18px_50px_rgba(15,23,42,0.1)] backdrop-blur-2xl"
            : "border-[#ece3d7] bg-[#fbf8f2]/84 shadow-[0_14px_34px_rgba(15,23,42,0.06)] backdrop-blur-xl"
        }`}
      >
        <Link to="/" className="min-w-0 shrink">
          <BrandMark compact tone={useLightChrome ? "light" : "dark"} />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navigationLinks.map((item) => {
            if (item.hash) {
              const isActive = location.pathname === "/" && location.hash === item.hash;

              return (
                <Link key={item.label} to={item.href} className={navLinkClass(isActive)}>
                  {item.label}
                </Link>
              );
            }

            return (
              <NavLink key={item.label} to={item.href} className={({ isActive }) => navLinkClass(isActive)}>
                {item.label}
              </NavLink>
            );
          })}

          {isAuthenticated ? (
            <NavLink to="/favorites" className={({ isActive }) => navLinkClass(isActive)}>
              Favorites
            </NavLink>
          ) : null}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {isAuthenticated && isAdmin ? (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  useLightChrome
                    ? isActive
                      ? "border-white/20 bg-white/12 text-white"
                      : "border-white/16 bg-white/[0.04] text-white/82 hover:border-white/28 hover:bg-white/10 hover:text-white"
                    : isActive
                      ? "border-gold-300 bg-[#f7eedb] text-gold-700"
                      : "border-[#e3d7c7] bg-white text-ink-700 hover:border-gold-300 hover:text-ink-900"
                }`
              }
            >
              <span className="inline-flex items-center gap-2">
                <LayoutDashboard size={16} />
                Dashboard
              </span>
            </NavLink>
          ) : null}

          {!isAuthenticated ? (
            <Link
              to="/admin/login"
              className={`min-h-[46px] px-4 text-[13px] ${useLightChrome ? "btn-secondary border-white/16 bg-white/[0.08] text-white hover:border-white/28 hover:bg-white/14" : "btn-ghost"}`}
            >
              Admin Access
            </Link>
          ) : null}

          {isAuthenticated ? (
            <button
              type="button"
              onClick={handleLogout}
              className={`min-h-[46px] px-4 text-[13px] ${useLightChrome ? "btn-secondary border-white/16 bg-white/[0.08] text-white hover:border-white/28 hover:bg-white/14" : "btn-ghost"}`}
            >
              <LogOut size={16} />
              {user?.name ? `Logout ${user.name.split(" ")[0]}` : "Logout"}
            </button>
          ) : null}

          <a
            href={toPhoneHref(COMPANY_INFO.phoneDisplay)}
            className={`min-h-[46px] px-5 text-[13px] ${useLightChrome ? "btn-primary border-white/10 bg-white text-ink-900 shadow-[0_18px_45px_rgba(0,0,0,0.18)] hover:bg-[#f8f3ea]" : "btn-primary"}`}
          >
            <Phone size={16} />
            Call Now
          </a>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <a
            href={toPhoneHref(COMPANY_INFO.phoneDisplay)}
            className={`inline-flex h-11 w-11 items-center justify-center rounded-full border shadow-[0_12px_30px_rgba(212,175,55,0.18)] ${
              useLightChrome
                ? "border-white/16 bg-white/[0.08] text-white"
                : "border-gold-300 bg-[#f7ecd7] text-gold-700"
            }`}
            aria-label="Call now"
          >
            <Phone size={18} />
          </a>

          <button
            type="button"
            onClick={() => setMenuOpen((current) => !current)}
            className={`inline-flex h-11 w-11 items-center justify-center rounded-full border shadow-[0_14px_32px_rgba(15,23,42,0.08)] backdrop-blur-xl transition ${
              useLightChrome
                ? "border-white/14 bg-white/[0.08] text-white hover:bg-white/14"
                : "border-[#e6ddcf] bg-white text-ink-800 hover:bg-[#fbf8f1]"
            }`}
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mt-3 w-full max-w-[1320px] lg:hidden"
          >
            <div className="glass-panel overflow-hidden p-3 sm:p-4">
              <div className="space-y-2">
                {navigationLinks.map((item) =>
                  item.hash ? (
                    <Link
                      key={item.label}
                      to={item.href}
                      className={`block rounded-[22px] border px-4 py-3 text-sm font-semibold transition duration-300 ${
                        location.pathname === "/" && location.hash === item.hash
                          ? "border-gold-300/60 bg-[#C89B3C] text-white shadow-[0_14px_34px_rgba(200,155,60,0.18)]"
                          : "border-[#e5e7eb] bg-white text-ink-700 hover:border-gold-300 hover:bg-[#fafafa] hover:text-ink-900"
                      }`}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <NavLink
                      key={item.label}
                      to={item.href}
                      className={({ isActive }) =>
                        `block rounded-[22px] border px-4 py-3 text-sm font-semibold transition duration-300 ${
                          isActive
                            ? "border-gold-300/60 bg-[#C89B3C] text-white shadow-[0_14px_34px_rgba(200,155,60,0.18)]"
                            : "border-[#e5e7eb] bg-white text-ink-700 hover:border-gold-300 hover:bg-[#fafafa] hover:text-ink-900"
                        }`
                      }
                    >
                      {item.label}
                    </NavLink>
                  )
                )}

                {isAuthenticated && isAdmin ? (
                  <NavLink
                    to="/admin"
                    className={({ isActive }) =>
                      `block rounded-[22px] border px-4 py-3 text-sm font-semibold transition duration-300 ${
                        isActive
                          ? "border-gold-300/60 bg-[#C89B3C] text-white"
                          : "border-[#e5e7eb] bg-white text-ink-700 hover:border-gold-300 hover:bg-[#fafafa] hover:text-ink-900"
                      }`
                    }
                  >
                    Dashboard
                  </NavLink>
                ) : null}

                {isAuthenticated ? (
                  <NavLink
                    to="/favorites"
                    className={({ isActive }) =>
                      `block rounded-[22px] px-4 py-3 text-sm font-semibold transition ${
                        isActive
                          ? "bg-[#C89B3C] text-white"
                          : "border border-[#e5e7eb] bg-white text-ink-700 hover:border-gold-300 hover:bg-[#fafafa] hover:text-ink-900"
                      }`
                    }
                  >
                    <span className="inline-flex items-center gap-2">
                      <Heart size={16} />
                      Favorites
                    </span>
                  </NavLink>
                ) : null}
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <a href={toPhoneHref(COMPANY_INFO.phoneDisplay)} className="btn-primary w-full">
                  <Phone size={16} />
                  Call {COMPANY_INFO.phoneDisplay}
                </a>

                {isAuthenticated ? (
                  <button type="button" onClick={handleLogout} className="btn-ghost w-full">
                    <LogOut size={16} />
                    Logout
                  </button>
                ) : (
                  <Link to="/admin/login" className="btn-ghost w-full">
                    Admin Access
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
