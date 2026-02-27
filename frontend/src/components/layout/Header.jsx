import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { FaBars, FaMapMarkerAlt, FaPhoneAlt, FaTimes, FaWhatsapp } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";
import { GOOGLE_MAPS_LINK, OWNER_PROFILE } from "../../config/site";
import { useT } from "../../hooks/useTranslation";

const Header = () => {
  const { user, logout } = useAuth();
  const { language, toggleLanguage } = useApp();
  const t = useT();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);
  const phoneHref = `tel:${OWNER_PROFILE.phoneRaw}`;
  const whatsappHref = `https://wa.me/${OWNER_PROFILE.whatsappRaw}`;

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
      <div className="bg-slate-900 text-slate-100">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-2 text-xs sm:text-sm">
          <p className="font-semibold">{OWNER_PROFILE.name} | {OWNER_PROFILE.phoneDisplay}</p>
          <p className="max-w-xl truncate text-slate-300">{OWNER_PROFILE.address}</p>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <Link to="/" className="text-lg font-bold text-brand-700">Mahadev Property | Sagar MP</Link>
          <nav className="hidden gap-5 md:flex">
            {navLinks}
          </nav>
          <div className="hidden items-center gap-2 md:flex">
            <a href={phoneHref} className="btn-primary px-3 py-2"><FaPhoneAlt /> Call Now</a>
            <a href={whatsappHref} target="_blank" rel="noreferrer" className="btn-outline px-3 py-2"><FaWhatsapp /> WhatsApp</a>
            <a href={GOOGLE_MAPS_LINK} target="_blank" rel="noreferrer" className="btn-outline px-3 py-2"><FaMapMarkerAlt /> Map</a>
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
          <div className="grid grid-cols-2 gap-2">
            <a href={phoneHref} className="btn-primary px-3 py-2"><FaPhoneAlt /> Call</a>
            <a href={whatsappHref} target="_blank" rel="noreferrer" className="btn-outline px-3 py-2"><FaWhatsapp /> WhatsApp</a>
            <a href={GOOGLE_MAPS_LINK} target="_blank" rel="noreferrer" className="btn-outline col-span-2 px-3 py-2"><FaMapMarkerAlt /> Open Office Map</a>
          </div>
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
