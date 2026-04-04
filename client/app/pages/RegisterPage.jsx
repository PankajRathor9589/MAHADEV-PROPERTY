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
      navigate(createdUser.role === "admin" ? "/admin" : "/properties", { replace: true });
    } catch (registerError) {
      setError(registerError.message);
    }
  };

  return (
    <section className="section-shell">
      <div className="mx-auto max-w-2xl card">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-200/80">Admin Access</p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-white">Create an account</h1>
        <p className="mt-3 text-sm leading-7 text-white/60">
          Register as a user for browsing access, or use an admin registration key to unlock the property management console.
        </p>

        <form className="mt-8 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
          <input className="input-field" name="name" value={form.name} onChange={handleChange} placeholder="Full name" required />
          <input className="input-field" type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email address" required />
          <input className="input-field" name="phone" value={form.phone} onChange={handleChange} placeholder="Phone number" />
          <input className="input-field" type="password" name="password" value={form.password} onChange={handleChange} placeholder="Password" required />

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
            <div className="rounded-[24px] border border-white/10 bg-slate-950/35 p-4 text-sm text-white/60">
              User accounts can browse listings and submit property requirements through the lead desk.
            </div>
          )}

          {error ? <p className="rounded-2xl bg-rose-500/12 p-4 text-sm text-rose-200 md:col-span-2">{error}</p> : null}

          <div className="md:col-span-2">
            <button className="btn-primary" disabled={loading}>
              {loading ? "Creating account..." : "Register"}
            </button>
          </div>
        </form>

        <p className="mt-6 text-sm text-white/60">
          Already registered?{" "}
          <Link className="font-semibold text-gold-100 underline underline-offset-4" to="/login">
            Login instead
          </Link>
        </p>
      </div>
    </section>
  );
};

export default RegisterPage;
