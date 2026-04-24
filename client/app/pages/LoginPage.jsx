import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { COMPANY_INFO } from "../data/siteContent.js";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginAsAdmin, loading } = useAuth();
  const [mode, setMode] = useState("user");
  const [form, setForm] = useState({ email: "", password: "" });
  const [adminForm, setAdminForm] = useState({ adminKey: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = `Login | ${COMPANY_INFO.metaTitle}`;
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleAdminChange = (event) => {
    const { name, value } = event.target;
    setAdminForm((current) => ({ ...current, [name]: value }));
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

  const handleAdminSubmit = async (event) => {
    event.preventDefault();

    try {
      setError("");
      await loginAsAdmin(adminForm);
      navigate(location.state?.from || "/admin", { replace: true });
    } catch (loginError) {
      setError(loginError.message);
    }
  };

  return (
    <section className="section-shell">
      <div className="mx-auto max-w-2xl card">
        <p className="section-kicker">Login</p>
        <h1 className="mt-2 text-4xl font-semibold text-ink-800">Sign in to {COMPANY_INFO.name}</h1>
        <p className="mt-3 text-sm leading-7 text-ink-500">
          Use a normal account for leads and browsing, or enter the secure backend <strong>ADMIN_SECRET_KEY</strong>
          for admin access.
        </p>

        <div className="mt-8 flex rounded-full border border-brand-200 bg-brand-50 p-1">
          <button
            type="button"
            onClick={() => {
              setMode("user");
              setError("");
            }}
            className={`flex-1 rounded-full px-4 py-3 text-sm font-semibold transition ${
              mode === "user" ? "bg-white text-brand-700 shadow-sm" : "text-ink-500"
            }`}
          >
            User Login
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("admin");
              setError("");
            }}
            className={`flex-1 rounded-full px-4 py-3 text-sm font-semibold transition ${
              mode === "admin" ? "bg-white text-brand-700 shadow-sm" : "text-ink-500"
            }`}
          >
            Admin Login
          </button>
        </div>

        {mode === "user" ? (
          <form className="mt-6 space-y-4" onSubmit={handleUserSubmit}>
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
        ) : (
          <form className="mt-6 space-y-4" onSubmit={handleAdminSubmit}>
            <input
              className="input-field"
              type="password"
              name="adminKey"
              value={adminForm.adminKey}
              onChange={handleAdminChange}
              placeholder="Enter admin secret key"
              required
            />

            {error ? <p className="rounded-2xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p> : null}

            <button className="btn-primary w-full" disabled={loading}>
              {loading ? "Verifying key..." : "Login as Admin"}
            </button>
          </form>
        )}

        <p className="mt-6 text-sm text-ink-500">
          Need a user account?{" "}
          <Link className="font-semibold text-brand-700 underline underline-offset-4" to="/register">
            Register here
          </Link>
        </p>
      </div>
    </section>
  );
};

export default LoginPage;
