import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Seo from "../components/Seo.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { COMPANY_INFO } from "../data/siteContent.js";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleUserSubmit = async (event) => {
    event.preventDefault();

    try {
      setError("");
      const loggedInUser = await login(form);
      navigate(location.state?.from || (loggedInUser.role === "admin" ? "/admin" : "/properties"), {
        replace: true
      });
    } catch (loginError) {
      setError(loginError.message);
    }
  };

  return (
    <section className="section-shell">
      <Seo
        title={`Login | ${COMPANY_INFO.name}`}
        description={`Sign in to ${COMPANY_INFO.name} to manage your account and enquiries.`}
        canonical={`${COMPANY_INFO.canonicalUrl}/login`}
        robots="noindex, nofollow"
      />

      <div className="mx-auto max-w-2xl card">
        <p className="section-kicker">Login</p>
        <h1 className="mt-2 text-4xl font-semibold text-ink-800">Sign in to {COMPANY_INFO.name}</h1>
        <p className="mt-3 text-sm leading-7 text-ink-500">
          Use your account to track enquiries and continue browsing the live Sagar Infra inventory.
        </p>

        <form className="mt-8 space-y-4" onSubmit={handleUserSubmit}>
          <input
            className="input-field"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email address"
            required
          />
          <input
            className="input-field"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            required
          />

          {error ? <p className="rounded-2xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p> : null}

          <button className="btn-primary w-full" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-sm text-ink-500">
          Need a user account?{" "}
          <Link className="font-semibold text-brand-700 underline underline-offset-4" to="/register">
            Register here
          </Link>
        </p>
        <p className="mt-3 text-sm text-ink-500">
          Looking for owner access?{" "}
          <Link className="font-semibold text-brand-700 underline underline-offset-4" to="/admin/login">
            Open admin login
          </Link>
        </p>
      </div>
    </section>
  );
};

export default LoginPage;
