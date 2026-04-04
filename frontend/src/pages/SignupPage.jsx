import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Seo from "../components/ui/Seo";
import { useAuth } from "../context/AuthContext";

const SignupPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "buyer"
  });
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const data = await register(form);
      navigate(data.user.role === "agent" ? "/agent" : "/properties");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed.");
    }
  };

  return (
    <>
      <Seo title="Create Account" description="Create a buyer or agent account for the real estate marketplace." />

      <div className="grid min-h-[70vh] items-center gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="space-y-4">
          <p className="surface-label">Create account</p>
          <h1 className="section-heading text-5xl leading-tight">Join the platform as a buyer or agent.</h1>
          <p className="max-w-xl text-sm leading-7 text-slate-600">
            Buyers can shortlist and inquire, while agents can add and manage listings. Admin access is protected separately through the secure key flow.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { id: "buyer", title: "Buyer", copy: "Search, compare, and contact agents." },
              { id: "agent", title: "Agent", copy: "Upload images and manage listings." }
            ].map((role) => (
              <div key={role.id} className="rounded-[24px] border border-white/70 bg-white/70 px-4 py-4 shadow-soft">
                <p className="font-semibold text-ink">{role.title}</p>
                <p className="mt-2 text-sm text-slate-600">{role.copy}</p>
              </div>
            ))}
          </div>
        </section>

        <form className="panel-card p-6 sm:p-8" onSubmit={handleSubmit}>
          <h2 className="text-2xl font-semibold text-ink">Create your account</h2>
          {error && <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</p>}

          <div className="mt-6 grid gap-4">
            <input
              className="field"
              placeholder="Full name"
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              required
            />
            <input
              className="field"
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              required
            />
            <input
              className="field"
              placeholder="Phone number"
              value={form.phone}
              onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
              required
            />
            <input
              className="field"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
              required
            />

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { id: "buyer", label: "Buyer" },
                { id: "agent", label: "Agent" }
              ].map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, role: option.id }))}
                  className={`rounded-3xl border px-4 py-4 text-left text-sm transition ${
                    form.role === option.id
                      ? "border-brand-500 bg-brand-50 text-brand-800"
                      : "border-slate-200 bg-white text-slate-600"
                  }`}
                >
                  <p className="font-semibold">{option.label}</p>
                </button>
              ))}
            </div>

            <button type="submit" className="btn-primary w-full">
              Create account
            </button>
          </div>

          <p className="mt-5 text-sm text-slate-600">
            Already registered?{" "}
            <Link to="/login" className="font-semibold text-brand-700">
              Login
            </Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default SignupPage;
