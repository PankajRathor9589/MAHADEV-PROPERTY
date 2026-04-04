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
      navigate(location.state?.from || (loggedInUser.role === "admin" ? "/admin" : "/properties"), {
        replace: true
      });
    } catch (loginError) {
      setError(loginError.message);
    }
  };

  return (
    <section className="section-shell">
      <div className="mx-auto max-w-lg rounded-[36px] border border-white/10 bg-slate-950/75 p-8 text-white shadow-panel backdrop-blur">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-200/80">Welcome back</p>
        <h1 className="mt-3 font-display text-4xl font-semibold">Sign in to manage premium listings</h1>
        <p className="mt-3 text-sm leading-7 text-white/65">
          Use your account to access the admin panel or continue browsing verified properties.
        </p>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
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

          {error ? <p className="rounded-2xl bg-rose-500/15 p-3 text-sm text-rose-100">{error}</p> : null}

          <button className="btn-primary w-full" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-sm text-white/65">
          Need an account?{" "}
          <Link className="font-semibold text-gold-100 underline underline-offset-4" to="/register">
            Register here
          </Link>
        </p>
      </div>
    </section>
  );
};

export default LoginPage;
