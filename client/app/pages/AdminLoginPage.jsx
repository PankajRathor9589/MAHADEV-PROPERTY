import { ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Seo from "../components/Seo.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { COMPANY_INFO } from "../data/siteContent.js";

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginAsAdmin, loading } = useAuth();
  const [adminKey, setAdminKey] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setError("");
      await loginAsAdmin({ adminKey });
      navigate(location.state?.from || "/admin", { replace: true });
    } catch (loginError) {
      setError(loginError.message);
    }
  };

  return (
    <section className="section-shell">
      <Seo
        title={`Admin Login | ${COMPANY_INFO.name}`}
        description={`Secure admin access for ${COMPANY_INFO.name}.`}
        canonical={`${COMPANY_INFO.canonicalUrl}/admin/login`}
        robots="noindex, nofollow"
      />

      <div className="mx-auto max-w-xl rounded-[32px] border border-[#eadfcf] bg-white p-7 shadow-[0_20px_58px_rgba(15,23,42,0.08)] sm:p-9">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-gold-300 bg-[#f7ecd7] text-gold-700">
          <ShieldCheck size={24} />
        </span>
        <p className="section-kicker mt-6">Admin Access</p>
        <h1 className="mt-3 text-4xl font-semibold text-ink-900">Unlock the owner dashboard</h1>
        <p className="mt-4 text-sm leading-8 text-ink-500 sm:text-base">
          Enter the secure admin key to manage live property inventory, update listings, and review incoming leads.
        </p>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-ink-700">Admin Key</span>
            <input
              className="input-field"
              type="password"
              name="adminKey"
              value={adminKey}
              onChange={(event) => setAdminKey(event.target.value)}
              placeholder="Enter admin key"
              required
            />
          </label>

          {error ? <p className="rounded-2xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p> : null}

          <button className="btn-primary w-full" disabled={loading}>
            {loading ? "Verifying key..." : "Continue to Dashboard"}
          </button>
        </form>

        <p className="mt-6 text-sm text-ink-500">
          Need standard account access instead?{" "}
          <Link className="font-semibold text-gold-700 underline underline-offset-4" to="/login">
            User login
          </Link>
        </p>
      </div>
    </section>
  );
};

export default AdminLoginPage;
