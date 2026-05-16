import { LockKeyhole, ShieldCheck, UserRound } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Seo from "../components/Seo.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { COMPANY_INFO } from "../data/siteContent.js";

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginAsAdmin, loading } = useAuth();
  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  });
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCredentials((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setError("");
      await loginAsAdmin(credentials);
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

      <div className="relative mx-auto max-w-xl overflow-hidden rounded-[32px] border border-gold-300/30 bg-[#07111e] p-7 text-white shadow-[0_30px_100px_rgba(4,10,18,0.34)] sm:p-9">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(212,175,55,0.18),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0))]" />
        <span className="relative inline-flex h-14 w-14 items-center justify-center rounded-full border border-gold-300 bg-gold-300/15 text-gold-200">
          <ShieldCheck size={24} />
        </span>
        <p className="luxury-kicker relative mt-6 text-gold-200">Secure Admin Access</p>
        <h1 className="relative mt-3 text-4xl font-semibold text-white">Sagar Infra property command</h1>
        <p className="relative mt-4 text-sm leading-8 text-white/68 sm:text-base">
          Sign in with your admin username and password to publish live listings, edit property details, manage images, and review leads.
        </p>

        <form className="relative mt-8 space-y-4" onSubmit={handleSubmit}>
          <label className="space-y-2">
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-white/82">
              <UserRound size={15} className="text-gold-200" />
              Username
            </span>
            <input
              className="input-field border-white/10 bg-white/10 text-white placeholder:text-white/38 focus:border-gold-300 focus:ring-gold-300/20"
              type="text"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              placeholder="Enter admin username"
              autoComplete="username"
              required
            />
          </label>

          <label className="space-y-2">
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-white/82">
              <LockKeyhole size={15} className="text-gold-200" />
              Password
            </span>
            <input
              className="input-field border-white/10 bg-white/10 text-white placeholder:text-white/38 focus:border-gold-300 focus:ring-gold-300/20"
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              placeholder="Enter admin password"
              autoComplete="current-password"
              required
            />
          </label>

          {error ? <p className="rounded-2xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p> : null}

          <button className="btn-primary w-full" disabled={loading}>
            {loading ? "Verifying access..." : "Open Admin Dashboard"}
          </button>
        </form>

        <p className="relative mt-6 text-sm text-white/58">
          Need standard account access instead?{" "}
          <Link className="font-semibold text-gold-200 underline underline-offset-4" to="/login">
            User login
          </Link>
        </p>
      </div>
    </section>
  );
};

export default AdminLoginPage;
