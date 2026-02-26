import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";
import { useT } from "../../hooks/useTranslation";

const Header = () => {
  const { user, logout } = useAuth();
  const { language, toggleLanguage } = useApp();
  const t = useT();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const navLinks = (
    <>
      <NavLink onClick={closeMenu} to="/properties" className="text-sm font-semibold text-slate-700">{t.explore}</NavLink>
      <NavLink onClick={closeMenu} to="/compare" className="text-sm font-semibold text-slate-700">Compare</NavLink>
      <NavLink onClick={closeMenu} to="/collections" className="text-sm font-semibold text-slate-700">Saved</NavLink>
      <NavLink onClick={closeMenu} to="/contact" className="text-sm font-semibold text-slate-700">{t.contact}</NavLink>
    </>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <Link to="/" className="text-lg font-bold text-brand-700">{t.brand}</Link>
          <nav className="hidden gap-5 md:flex">
            {navLinks}
          </nav>
          <div className="hidden items-center gap-2 md:flex">
            <button onClick={toggleLanguage} className="btn-outline px-3 py-1.5">{language === "en" ? "HI" : "EN"}</button>
            {user ? (
              <>
                {user.role === "admin" && (
                  <Link to="/admin" className="btn-outline px-3 py-1.5">{t.dashboard}</Link>
                )}
                <button onClick={logout} className="btn-primary px-3 py-1.5">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-outline px-3 py-1.5">{t.login}</Link>
                <Link to="/signup" className="btn-primary px-3 py-1.5">{t.signup}</Link>
              </>
            )}
          </div>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 p-2 text-slate-700 md:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        <div className={`${menuOpen ? "mt-3 grid gap-3" : "hidden"} md:hidden`}>
          <nav className="grid gap-3 rounded-xl border border-slate-200 bg-white p-3">
            {navLinks}
          </nav>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={toggleLanguage} className="btn-outline px-3 py-2">{language === "en" ? "HI" : "EN"}</button>
            {user ? (
              <button
                onClick={() => {
                  closeMenu();
                  logout();
                }}
                className="btn-primary px-3 py-2"
              >
                Logout
              </button>
            ) : (
              <Link onClick={closeMenu} to="/login" className="btn-outline px-3 py-2">{t.login}</Link>
            )}
          </div>
          {user?.role === "admin" && (
            <Link onClick={closeMenu} to="/admin" className="btn-outline px-3 py-2">{t.dashboard}</Link>
          )}
          {!user && <Link onClick={closeMenu} to="/signup" className="btn-primary px-3 py-2">{t.signup}</Link>}
        </div>
      </div>
    </header>
  );
};

export default Header;
