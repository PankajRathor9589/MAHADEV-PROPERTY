import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";
import { useT } from "../../hooks/useTranslation";

const Header = () => {
  const { user, logout } = useAuth();
  const { language, toggleLanguage } = useApp();
  const t = useT();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-lg font-bold text-brand-700">{t.brand}</Link>
        <nav className="hidden gap-5 md:flex">
          <NavLink to="/properties" className="text-sm font-semibold text-slate-700">{t.explore}</NavLink>
          <NavLink to="/compare" className="text-sm font-semibold text-slate-700">Compare</NavLink>
          <NavLink to="/collections" className="text-sm font-semibold text-slate-700">Saved</NavLink>
          <NavLink to="/contact" className="text-sm font-semibold text-slate-700">{t.contact}</NavLink>
        </nav>
        <div className="flex items-center gap-2">
          <button onClick={toggleLanguage} className="btn-outline px-3 py-1.5">{language === "en" ? "???" : "EN"}</button>
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
      </div>
    </header>
  );
};

export default Header;
