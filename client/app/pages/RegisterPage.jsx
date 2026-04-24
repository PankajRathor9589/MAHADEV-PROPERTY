import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { COMPANY_INFO } from "../data/siteContent.js";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, loading } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: ""
  });
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = `Register | ${COMPANY_INFO.metaTitle}`;
  }, []);

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
        <p className="section-kicker">Register</p>
        <h1 className="mt-2 text-4xl font-semibold text-ink-800">Create your {COMPANY_INFO.name} account</h1>
        <p className="mt-3 text-sm leading-7 text-ink-500">
          User accounts can browse listings, submit property or contractor requirements, and stay connected for
          follow-up. Admin access stays protected behind the secure secret key.
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

          <div className="rounded-2xl border border-brand-100 bg-brand-50 p-4 text-sm leading-7 text-ink-500 md:col-span-2">
            Register once to submit property requirements faster and keep your details saved for follow-up from Sagar
            Infra.
          </div>

          {error ? <p className="rounded-2xl bg-rose-50 p-4 text-sm text-rose-700 md:col-span-2">{error}</p> : null}

          <div className="md:col-span-2">
            <button className="btn-primary w-full sm:w-auto" disabled={loading}>
              {loading ? "Creating account..." : "Register"}
            </button>
          </div>
        </form>

        <p className="mt-6 text-sm text-ink-500">
          Already registered?{" "}
          <Link className="font-semibold text-brand-700 underline underline-offset-4" to="/login">
            Login instead
          </Link>
        </p>
      </div>
    </section>
  );
};

export default RegisterPage;
