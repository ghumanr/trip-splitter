import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../contexts/useAuth";

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/");
    } catch {
      setError("Invalid email or password.");
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
            Split group trips clearly.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
            Track travelers, shared expenses, automatic equal splits, payments, and balances.
          </p>
        </section>

        <section className="glass-panel-strong rounded-[2rem] p-8">
          <h2 className="text-3xl font-bold text-slate-950">Welcome back</h2>
          <p className="mt-2 text-sm text-slate-500">Log in to manage your trips.</p>

          {error ? (
            <div className="mt-5 rounded-2xl border border-red-200/70 bg-red-50/80 p-3 text-sm font-semibold text-red-700 backdrop-blur">
              {error}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="primary-button w-full py-3"
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Need an account?{" "}
            <Link to="/register" className="font-bold text-cyan-700">
              Create one
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}

export default LoginPage;