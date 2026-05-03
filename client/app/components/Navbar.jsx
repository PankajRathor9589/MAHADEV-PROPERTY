import { AnimatePresence, motion } from "framer-motion";
import { LayoutDashboard, LogOut, Menu, Phone, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { COMPANY_INFO } from "../data/siteContent.js";
import { toPhoneHref } from "../utils/format.js";
import BrandMark from "./BrandMark.jsx";

const navigationLinks = [
  { label: "Home", href: "/", hash: "" },
  { label: "Properties", href: "/properties", hash: "" },
  { label: "Services", href: "/#services", hash: "#services" },
  { label: "Contact", href: "/#contact", hash: "#contact" }
];

const Navbar = () => {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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
    `rounded-full px-4 py-2 text-sm font-semibold transition ${
      active
        ? "bg-[#f2e7cf] text-ink-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]"
        : "text-ink-600 hover:bg-white hover:text-ink-900"
    }`;

  return (
    <header className="sticky top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8">
      <motion.div
        layout
        className={`mx-auto flex w-full max-w-[1320px] items-center justify-between rounded-full border px-4 py-3 transition duration-500 sm:px-5 ${
          isScrolled
            ? "border-[#e5d9c7] bg-white/88 shadow-[0_18px_50px_rgba(15,23,42,0.1)] backdrop-blur-2xl"
            : "border-[#ece3d7] bg-[#fbf8f2]/84 shadow-[0_14px_34px_rgba(15,23,42,0.06)] backdrop-blur-xl"
        }`}
      >
        <Link to="/" className="min-w-0">
          <BrandMark compact />
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
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {isAuthenticated && isAdmin ? (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  isActive
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
            <Link to="/admin/login" className="btn-ghost min-h-[46px] px-4 text-[13px]">
              Admin Access
            </Link>
          ) : null}

          {isAuthenticated ? (
            <button type="button" onClick={handleLogout} className="btn-ghost min-h-[46px] px-4 text-[13px]">
              <LogOut size={16} />
              {user?.name ? `Logout ${user.name.split(" ")[0]}` : "Logout"}
            </button>
          ) : null}

          <a href={toPhoneHref(COMPANY_INFO.phoneDisplay)} className="btn-primary min-h-[46px] px-5 text-[13px]">
            <Phone size={16} />
            Call Now
          </a>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <a
            href={toPhoneHref(COMPANY_INFO.phoneDisplay)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-gold-300 bg-[#f7ecd7] text-gold-700 shadow-[0_12px_30px_rgba(212,175,55,0.18)]"
            aria-label="Call now"
          >
            <Phone size={18} />
          </a>

          <button
            type="button"
            onClick={() => setMenuOpen((current) => !current)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#e6ddcf] bg-white text-ink-800 shadow-[0_14px_32px_rgba(15,23,42,0.08)] backdrop-blur-xl transition hover:bg-[#fbf8f1]"
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
            <div className="glass-panel overflow-hidden p-4">
              <div className="space-y-2">
                {navigationLinks.map((item) =>
                  item.hash ? (
                    <Link
                      key={item.label}
                      to={item.href}
                      className={`block rounded-[22px] px-4 py-3 text-sm font-semibold transition ${
                        location.pathname === "/" && location.hash === item.hash
                          ? "bg-[#f7ecd7] text-ink-900"
                          : "bg-[#fbf8f1] text-ink-700 hover:bg-white hover:text-ink-900"
                      }`}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <NavLink
                      key={item.label}
                      to={item.href}
                      className={({ isActive }) =>
                        `block rounded-[22px] px-4 py-3 text-sm font-semibold transition ${
                          isActive
                            ? "bg-[#f7ecd7] text-ink-900"
                            : "bg-[#fbf8f1] text-ink-700 hover:bg-white hover:text-ink-900"
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
                    className="block rounded-[22px] bg-[#fbf8f1] px-4 py-3 text-sm font-semibold text-ink-700 transition hover:bg-white hover:text-ink-900"
                  >
                    Dashboard
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
