import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

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

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setError("");
      const loggedInUser = await login(form);
      navigate(location.state?.from || (loggedInUser.role === "admin" ? "/admin" : "/dashboard"), {
        replace: true
      });
    } catch (loginError) {
      setError(loginError.message);
    }
  };

  return (
    <section className="mx-auto max-w-lg rounded-[36px] bg-slate-900 p-8 text-white shadow-panel">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-100">Welcome back</p>
      <h1 className="mt-3 text-3xl font-bold">Sign in to manage your property dashboard</h1>
      <p className="mt-3 text-sm text-slate-300">
        Use your account to post listings, save favorites, and manage property inquiries.
      </p>

      <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
        <input
          className="input-field border-white/10 bg-white text-slate-900"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email address"
          required
        />
        <input
          className="input-field border-white/10 bg-white text-slate-900"
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          required
        />

        {error ? <p className="rounded-2xl bg-rose-500/15 p-3 text-sm text-rose-100">{error}</p> : null}

        <button className="btn-primary w-full" disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>

      <p className="mt-6 text-sm text-slate-300">
        No account yet?{" "}
        <Link className="font-semibold text-white underline underline-offset-4" to="/register">
          Create one here
        </Link>
      </p>
    </section>
  );
};

export default LoginPage;
