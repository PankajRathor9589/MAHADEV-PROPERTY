import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, loading } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "user",
    adminKey: ""
  });
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setError("");
      const createdUser = await register(form);
      navigate(createdUser.role === "admin" ? "/admin" : "/dashboard", { replace: true });
    } catch (registerError) {
      setError(registerError.message);
    }
  };

  return (
    <section className="mx-auto max-w-2xl card">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-700">Create account</p>
      <h1 className="mt-3 text-3xl font-bold text-slate-900">Start listing or saving properties</h1>
      <p className="mt-3 text-sm text-slate-500">
        Sign up as a user by default. Admin signup is protected by an admin registration key.
      </p>

      <form className="mt-8 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
        <input
          className="input-field"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Full name"
          required
        />
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
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone number"
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
        <select className="input-field" name="role" value={form.role} onChange={handleChange}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        {form.role === "admin" ? (
          <input
            className="input-field"
            name="adminKey"
            value={form.adminKey}
            onChange={handleChange}
            placeholder="Admin registration key"
          />
        ) : (
          <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
            Users can browse listings, save favorites, send inquiries, and post properties for admin approval.
          </div>
        )}

        {error ? <p className="rounded-2xl bg-rose-50 p-4 text-sm text-rose-700 md:col-span-2">{error}</p> : null}

        <div className="md:col-span-2">
          <button className="btn-primary" disabled={loading}>
            {loading ? "Creating account..." : "Register"}
          </button>
        </div>
      </form>

      <p className="mt-6 text-sm text-slate-500">
        Already registered?{" "}
        <Link className="font-semibold text-brand-700" to="/login">
          Login instead
        </Link>
      </p>
    </section>
  );
};

export default RegisterPage;
