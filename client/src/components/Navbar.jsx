import { Link, NavLink } from 'react-router-dom';
import { Languages, PhoneCall } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Navbar = () => {
  const { lang, setLang } = useApp();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200">
      <nav className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-brand-500">Mahadev Property</Link>
        <div className="hidden md:flex items-center gap-5 text-sm font-medium">
          {['/', '/properties', '/compare', '/admin'].map((path, idx) => (
            <NavLink key={path} to={path} className="hover:text-brand-500">
              {['Home', 'Properties', 'Compare', 'Admin'][idx]}
            </NavLink>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setLang(lang === 'en' ? 'hi' : 'en')} className="touch-btn bg-slate-100 text-slate-700 text-xs">
            <Languages className="inline w-4 h-4 mr-1" /> {lang === 'en' ? 'हिन्दी' : 'English'}
          </button>
          <a href="tel:+919999999999" className="touch-btn bg-brand-500 text-white text-xs">
            <PhoneCall className="inline w-4 h-4 mr-1" /> Call
          </a>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
