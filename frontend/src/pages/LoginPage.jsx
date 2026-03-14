import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Seo from "../components/ui/Seo";
import { DEMO_LOGIN_HINTS, HERO_MEDIA } from "../config/site";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const data = await login(form);
      const redirectPath =
        location.state?.from?.pathname || (data.user.role === "admin" ? "/admin" : data.user.role === "agent" ? "/agent" : "/properties");
      navigate(redirectPath);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed.");
    }
  };

  return (
    <>
      <Seo title="Login" description="Sign in to access saved listings, agent tools, and admin moderation." />

      <div className="grid min-h-[70vh] items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="panel-card overflow-hidden p-0">
          <div className="grid gap-6 p-6 sm:p-8">
            <div>
              <p className="surface-label">Welcome back</p>
              <h1 className="section-heading mt-2 text-5xl leading-tight">Sign in to continue browsing, listing, and moderating properties.</h1>
              <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600">
                The interface supports buyer discovery, agent inventory management, and admin moderation from the same responsive frontend shell.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {DEMO_LOGIN_HINTS.map((account) => (
                <button
                  key={account.role}
                  type="button"
                  onClick={() => setForm({ email: account.email, password: account.password })}
                  className="rounded-[24px] border border-slate-100 bg-slate-50 px-4 py-4 text-left transition hover:-translate-y-0.5 hover:border-brand-200 hover:bg-brand-50/40"
                >
                  <p className="text-sm font-semibold text-ink">{account.role}</p>
                  <p className="mt-1 text-xs text-slate-500">{account.email}</p>
                </button>
              ))}
            </div>

            <div className="overflow-hidden rounded-[28px] bg-slate-100">
              <img src={HERO_MEDIA.realEstateGif} alt="Real estate animation" className="h-56 w-full object-cover" />
            </div>
          </div>
        </section>

        <form className="panel-card p-6 sm:p-8" onSubmit={handleSubmit}>
          <h2 className="text-2xl font-semibold text-ink">Login</h2>
          <p className="mt-2 text-sm text-slate-600">Use your account credentials or tap a demo role on the left.</p>
          {error && <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</p>}
          <div className="mt-6 grid gap-4">
            <input
              className="field"
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              required
            />
            <input
              className="field"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
              required
            />
            <button type="submit" className="btn-primary w-full">
              Login
            </button>
          </div>
          <p className="mt-5 text-sm text-slate-600">
            New here?{" "}
            <Link to="/signup" className="font-semibold text-brand-700">
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default LoginPage;
