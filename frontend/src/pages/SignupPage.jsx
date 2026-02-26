import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Seo from "../components/ui/Seo";
import { useAuth } from "../context/AuthContext";

const SignupPage = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const { signup } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await signup(form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <Seo title="Signup" />
      <form className="card space-y-3" onSubmit={submit}>
        <h1 className="text-2xl font-bold">Create Account</h1>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <input className="input" required placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="input" type="email" required placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="input" required placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <input className="input" type="password" required placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button className="btn-primary w-full">Signup</button>
        <p className="text-sm">Already have account? <Link className="text-brand-600" to="/login">Login</Link></p>
      </form>
    </div>
  );
};

export default SignupPage;
