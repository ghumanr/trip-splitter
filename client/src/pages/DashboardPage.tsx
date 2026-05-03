import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TripCard from "../components/TripCard";
import { useAuth } from "../contexts/useAuth";
import api from "../services/api";
import type { Trip } from "../types";

function DashboardPage() {
  const { user } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await api.get("/trips", {
          params: {
            userId: user?.id,
          },
        });
        setTrips(response.data);
      } catch {
        setError("Could not load trips. Check that the server and database are running.");
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchTrips();
    }
  }, [user?.id]);

  if (loading) {
    return (
      <div className="glass-panel-strong rounded-[2rem] p-8 text-slate-600">
        Loading trips...
      </div>
    );
  }

  const totalSpent = trips.reduce((sum, trip) => sum + trip.totalSpent, 0);
  const totalExpenses = trips.reduce((sum, trip) => sum + trip.expenses.length, 0);
  const totalMembers = new Set(
    trips.flatMap((trip) => trip.members.map((member) => member.user.id))
  ).size;

  return (
    <div className="space-y-8">
      <section className="glass-dark overflow-hidden rounded-[2.5rem] p-8 text-white">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-300">
            Dashboard
          </p>
          <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
            Split every trip without the spreadsheet mess.
          </h2>
          <p className="mt-4 max-w-2xl text-slate-300">
            Create groups, add shared costs, track who paid, and settle balances.
          </p>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-inner shadow-white/5 backdrop-blur">
            <p className="text-sm text-slate-300">Trips</p>
            <p className="mt-2 text-3xl font-bold">{trips.length}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-inner shadow-white/5 backdrop-blur">
            <p className="text-sm text-slate-300">Total spent</p>
            <p className="mt-2 text-3xl font-bold">${totalSpent.toFixed(2)}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-inner shadow-white/5 backdrop-blur">
            <p className="text-sm text-slate-300">People</p>
            <p className="mt-2 text-3xl font-bold">{totalMembers}</p>
          </div>
        </div>
      </section>

      {error ? (
        <div className="rounded-3xl border border-red-200/70 bg-red-50/80 p-5 text-sm font-semibold text-red-700 shadow-lg shadow-red-100/50 backdrop-blur">
          {error}
        </div>
      ) : null}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-2xl font-bold text-slate-950">Your Trips</h3>
          <p className="text-sm text-slate-600">
            {totalExpenses} expenses across {trips.length} trips
          </p>
        </div>
        <Link
          to="/trips/new"
          className="primary-button px-5 py-3 text-center text-sm"
        >
          Create Trip
        </Link>
      </div>

      {trips.length ? (
        <div className="grid gap-5 xl:grid-cols-2">
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      ) : (
        <div className="glass-panel rounded-[2rem] border-dashed p-10 text-center">
          <h3 className="text-xl font-bold text-slate-950">No trips yet</h3>
          <p className="mt-2 text-slate-600">Create a trip and invite your group.</p>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;