import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const RegisterPage = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "seller",
    adminKey: ""
  });
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setError("");
      const user = await register(form);
      navigate(user.role === "admin" ? "/admin/dashboard" : user.role === "seller" ? "/seller/dashboard" : "/", {
        replace: true
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="mx-auto w-full max-w-lg card">
      <h1 className="text-2xl font-bold text-slate-900">Create Account</h1>
      <p className="mt-1 text-sm text-slate-600">Register as seller/dealer or visitor.</p>

      <form className="mt-5 grid gap-3" onSubmit={handleSubmit}>
        <input className="input-field" name="name" value={form.name} onChange={handleChange} placeholder="Full name" required />
        <input className="input-field" type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" required />
        <input className="input-field" name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" />
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
          <option value="seller">Seller / Dealer</option>
          <option value="visitor">Visitor / Buyer</option>
          <option value="admin">Admin</option>
        </select>

        {form.role === "admin" && (
          <input
            className="input-field"
            name="adminKey"
            value={form.adminKey}
            onChange={handleChange}
            placeholder="Admin registration key"
          />
        )}

        {error ? <p className="rounded-lg bg-rose-50 p-2 text-sm text-rose-700">{error}</p> : null}

        <button className="btn-primary" disabled={loading}>
          {loading ? "Creating account..." : "Register"}
        </button>
      </form>

      <p className="mt-4 text-sm text-slate-600">
        Already have an account? <Link className="font-semibold text-brand-700" to="/login">Login</Link>
      </p>
    </section>
  );
};

export default RegisterPage;
