import { CirclePlus, Heart, Home, Newspaper, UserRound } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const MobileBottomNav = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const profilePath = isAuthenticated ? (isAdmin ? "/admin" : "/properties") : "/login";

  return (
    <nav className="fixed inset-x-4 bottom-4 z-40 md:hidden" aria-label="Mobile bottom navigation">
      <div className="grid grid-cols-5 items-center rounded-[26px] border border-white/80 bg-white/95 px-2 py-2 shadow-[0_18px_48px_rgba(34,28,24,0.16)] backdrop-blur-xl">
        <a href="#home" className="flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-medium text-brand-700">
          <Home size={18} />
          Home
        </a>
        <a href="#government-projects" className="flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-medium text-ink-500 transition hover:bg-brand-50 hover:text-brand-700">
          <Newspaper size={18} />
          Insights
        </a>
        <a href="#contact" className="flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-medium text-ink-500 transition hover:bg-brand-50 hover:text-brand-700">
          <CirclePlus size={18} />
          Post
        </a>
        <a href="#featured-properties" className="flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-medium text-ink-500 transition hover:bg-brand-50 hover:text-brand-700">
          <Heart size={18} />
          Shortlist
        </a>
        <NavLink
          to={profilePath}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-medium transition ${
              isActive ? "bg-brand-50 text-brand-700" : "text-ink-500 hover:bg-brand-50 hover:text-brand-700"
            }`
          }
        >
          <UserRound size={18} />
          Profile
        </NavLink>
      </div>
    </nav>
  );
};

export default MobileBottomNav;
