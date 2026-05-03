import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../contexts/useAuth";

type RegisterFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await register(formData.name, formData.email, formData.password);
      navigate("/");
    } catch {
      setError("Could not create account with that email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell px-4 py-10">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="text-slate-950">
          <p className="text-sm font-bold uppercase tracking-[0.4em] text-cyan-600">
            TripSplitter
          </p>
          <h1 className="mt-5 text-5xl font-black tracking-tight sm:text-7xl">
            Start your next trip right.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
            Create a group, add travelers, record shared costs, and settle up.
          </p>
        </section>

        <section className="glass-panel-strong rounded-[2rem] p-8">
          <h2 className="text-3xl font-bold text-slate-950">Create account</h2>
          <p className="mt-2 text-sm text-slate-500">Use your email to manage trips.</p>

          {error ? (
            <div className="mt-5 rounded-2xl border border-red-200/70 bg-red-50/80 p-3 text-sm font-semibold text-red-700 backdrop-blur">
              {error}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <input
              name="name"
              type="text"
              placeholder="Full name"
              className="field"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <input
              name="email"
              type="email"
              placeholder="Email"
              className="field"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              className="field"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm password"
              className="field"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="primary-button w-full py-3"
            >
              {loading ? "Creating..." : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-cyan-700">
              Log in
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}

export default RegisterPage;