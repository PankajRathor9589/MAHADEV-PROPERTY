import {
  LayoutDashboard,
  LogOut,
  Menu,
  Phone,
  X
} from "lucide-react";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import BrandMark from "./BrandMark.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { COMPANY_INFO } from "../data/siteContent.js";
import { toPhoneHref } from "../utils/format.js";

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
      setIsScrolled(window.scrollY > 18);
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
        ? "bg-white/[0.12] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16)]"
        : "text-white/78 hover:bg-white/[0.08] hover:text-white"
    }`;

  return (
    <header className="sticky top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8">
      <motion.div
        layout
        className={`mx-auto flex w-full max-w-[1320px] items-center justify-between rounded-full border px-4 py-3 transition duration-500 sm:px-5 ${
          isScrolled
            ? "border-white/16 bg-navy-950/74 shadow-glass backdrop-blur-2xl"
            : "border-white/10 bg-white/[0.05] backdrop-blur-xl"
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
              <NavLink
                key={item.label}
                to={item.href}
                className={({ isActive }) => navLinkClass(isActive)}
              >
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
                    ? "border-gold-400/70 bg-gold-400/15 text-gold-200"
                    : "border-white/16 bg-white/[0.06] text-white/80 hover:border-gold-400/60 hover:text-white"
                }`
              }
            >
              <span className="inline-flex items-center gap-2">
                <LayoutDashboard size={16} />
                Dashboard
              </span>
            </NavLink>
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
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-gold-300/40 bg-gold-400/15 text-gold-200 shadow-[0_12px_30px_rgba(212,175,55,0.18)]"
            aria-label="Call now"
          >
            <Phone size={18} />
          </a>

          <button
            type="button"
            onClick={() => setMenuOpen((current) => !current)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/[0.06] text-white shadow-[0_14px_32px_rgba(5,13,28,0.22)] backdrop-blur-xl transition hover:bg-white/[0.1]"
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
                          ? "bg-white/[0.12] text-white"
                          : "bg-white/[0.04] text-white/80 hover:bg-white/[0.08] hover:text-white"
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
                            ? "bg-white/[0.12] text-white"
                            : "bg-white/[0.04] text-white/80 hover:bg-white/[0.08] hover:text-white"
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
                    className="block rounded-[22px] bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/[0.08] hover:text-white"
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
                  <Link to="/login" className="btn-ghost w-full">
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
