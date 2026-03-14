import { FaBalanceScale, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useApp } from "../../context/AppContext";

const CompareTray = () => {
  const { compareCount, compareLimit, clearCompare } = useApp();

  if (compareCount === 0) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-40 px-4">
      <div className="pointer-events-auto mx-auto flex w-full max-w-3xl flex-wrap items-center justify-between gap-3 rounded-[26px] border border-white/70 bg-ink/95 px-4 py-3 text-white shadow-card backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 text-sand-100">
            <FaBalanceScale />
          </div>
          <div>
            <p className="text-sm font-semibold">
              Compare {compareCount}/{compareLimit} properties
            </p>
            <p className="text-xs text-slate-300">
              {compareCount < compareLimit ? `Select ${compareLimit - compareCount} more property to compare.` : "Your comparison is ready."}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link to="/compare" className="btn-primary bg-white text-ink hover:bg-sand-50">
            <FaBalanceScale />
            Compare now
          </Link>
          <button type="button" onClick={clearCompare} className="btn-secondary border-white/20 bg-white/10 text-white hover:bg-white/15">
            <FaTimes />
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompareTray;
