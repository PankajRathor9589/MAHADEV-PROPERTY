import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const LoginPage = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setError("");
      const user = await login(form);
      const fallback = user.role === "admin" ? "/admin/dashboard" : user.role === "seller" ? "/seller/dashboard" : "/";
      navigate(location.state?.from || fallback, { replace: true });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="mx-auto w-full max-w-md card">
      <h1 className="text-2xl font-bold text-slate-900">Login</h1>
      <p className="mt-1 text-sm text-slate-600">Access your admin or seller dashboard.</p>

      <form className="mt-5 space-y-3" onSubmit={handleSubmit}>
        <input
          className="input-field"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
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

        {error ? <p className="rounded-lg bg-rose-50 p-2 text-sm text-rose-700">{error}</p> : null}

        <button className="btn-primary w-full" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="mt-4 text-sm text-slate-600">
        No account? <Link className="font-semibold text-brand-700" to="/register">Register here</Link>
      </p>
    </section>
  );
};

export default LoginPage;
