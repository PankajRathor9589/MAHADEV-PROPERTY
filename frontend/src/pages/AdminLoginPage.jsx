import { useState } from "react";
import { FaArrowRight, FaKey, FaShieldAlt } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Seo from "../components/ui/Seo";
import { useAuth } from "../context/AuthContext";

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginAdmin, loading } = useAuth();
  const [adminKey, setAdminKey] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      await loginAdmin(adminKey);
      navigate(location.state?.from?.pathname || "/admin", { replace: true });
    } catch (loginError) {
      setError(loginError.response?.data?.message || loginError.message || "Admin login failed.");
    }
  };

  return (
    <>
      <Seo title="Secure Admin Access" description="Verify the admin key to access the protected Sagar Infra admin dashboard." />

      <div className="grid min-h-[70vh] items-center gap-8 lg:grid-cols-[1fr_0.95fr]">
        <section className="panel-card overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(250,204,21,0.16),transparent_32%),linear-gradient(145deg,#0f172a,#111827)] p-6 text-white sm:p-8">
          <p className="surface-label text-sand-100">Restricted workspace</p>
          <h1 className="section-heading mt-2 text-5xl leading-tight text-white">
            Verify the admin key before entering the Sagar Infra dashboard.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-200">
            Admin access is checked only on the backend using the protected environment secret. The key is never
            embedded in the frontend, and regular login credentials cannot unlock the admin workspace.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="glass-card border-white/10 bg-white/6 px-5 py-5">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-amber-300/15 text-amber-200">
                <FaShieldAlt />
              </div>
              <h2 className="mt-4 text-xl font-semibold">Backend verified</h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                The admin key is validated on the server before any admin token is issued.
              </p>
            </div>

            <div className="glass-card border-white/10 bg-white/6 px-5 py-5">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-amber-300/15 text-amber-200">
                <FaKey />
              </div>
              <h2 className="mt-4 text-xl font-semibold">Timed session</h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Admin sessions expire automatically based on the JWT lifetime for safer production use.
              </p>
            </div>
          </div>
        </section>

        <form className="panel-card p-6 sm:p-8" onSubmit={handleSubmit}>
          <p className="surface-label">Admin login</p>
          <h2 className="mt-2 text-3xl font-semibold text-ink">Secure dashboard access</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Enter the authorized admin key to continue. If you only need buyer or agent access, use the regular login
            page instead.
          </p>

          {error ? <p className="mt-5 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</p> : null}

          <div className="mt-6 grid gap-4">
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-slate-700">Admin key</span>
              <div className="relative">
                <FaKey className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-brand-500" />
                <input
                  className="field pl-11"
                  type="password"
                  name="adminKey"
                  value={adminKey}
                  onChange={(event) => setAdminKey(event.target.value)}
                  autoComplete="current-password"
                  placeholder="Enter admin key"
                  required
                />
              </div>
            </label>

            <button type="submit" className="btn-primary w-full justify-center" disabled={loading}>
              {loading ? "Verifying access..." : "Unlock admin dashboard"}
              {!loading ? <FaArrowRight /> : null}
            </button>
          </div>

          <p className="mt-5 text-sm text-slate-600">
            Need regular access?{" "}
            <Link to="/login" className="font-semibold text-brand-700">
              Go to user login
            </Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default AdminLoginPage;
