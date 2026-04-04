import { KeyRound, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginAdmin, loading } = useAuth();
  const [adminKey, setAdminKey] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setError("");
      await loginAdmin(adminKey);
      navigate(location.state?.from || "/admin", { replace: true });
    } catch (loginError) {
      setError(loginError.message);
    }
  };

  return (
    <section className="section-shell">
      <div className="mx-auto max-w-lg rounded-[36px] border border-white/10 bg-slate-950/80 p-8 text-white shadow-panel backdrop-blur">
        <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-gold-200/80">
          <ShieldCheck size={14} />
          Secure Admin Access
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold">Enter admin key to access the dashboard</h1>
        <p className="mt-3 text-sm leading-7 text-white/65">
          The admin key is verified only on the backend. It is never hardcoded in the frontend and is required before
          the Sagar Infra admin dashboard becomes available.
        </p>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-white/75">Admin key</span>
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gold-100">
                <KeyRound size={16} />
              </span>
              <input
                className="input-field pl-11"
                type="password"
                name="adminKey"
                value={adminKey}
                onChange={(event) => setAdminKey(event.target.value)}
                placeholder="Enter admin key"
                autoComplete="current-password"
                required
              />
            </div>
          </label>

          {error ? <p className="rounded-2xl bg-rose-500/15 p-3 text-sm text-rose-100">{error}</p> : null}

          <button className="btn-primary w-full" disabled={loading}>
            {loading ? "Verifying..." : "Unlock Admin Dashboard"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default AdminLoginPage;
