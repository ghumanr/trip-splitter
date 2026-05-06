import { Link } from "react-router-dom";
import type { Trip } from "../types";

type TripCardProps = {
  trip: Trip;
  onDelete: (tripId: string) => void;
};

function TripCard({ trip, onDelete }: TripCardProps) {
  const latestExpense = trip.expenses[0];

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`Delete "${trip.title}"? This cannot be undone.`)) {
      onDelete(trip.id);
    }
  };

  return (
    <Link
      to={`/trips/${trip.id}`}
      className="glass-panel-strong group block overflow-hidden rounded-[2rem] p-6 transition hover:-translate-y-1 hover:shadow-2xl"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-cyan-600">
            {trip.destination || "Group trip"}
          </p>
          <h3 className="mt-2 text-2xl font-bold text-slate-950">{trip.title}</h3>
        </div>
        <div className="rounded-2xl bg-slate-950/95 px-4 py-2 text-right text-white shadow-lg shadow-slate-400/20">
          <p className="text-xs text-slate-300">Spent</p>
          <p className="font-bold">${trip.totalSpent.toFixed(2)}</p>
        </div>
      </div>

      <p className="mt-4 line-clamp-2 min-h-12 text-sm leading-6 text-slate-600">
        {trip.description || "Track shared costs, balances, and payments in one place."}
      </p>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <div className="soft-card rounded-2xl p-3">
          <p className="text-xs text-slate-500">Members</p>
          <p className="text-lg font-bold text-slate-950">{trip.members.length}</p>
        </div>
        <div className="soft-card rounded-2xl p-3">
          <p className="text-xs text-slate-500">Expenses</p>
          <p className="text-lg font-bold text-slate-950">{trip.expenses.length}</p>
        </div>
        <div className="soft-card rounded-2xl p-3">
          <p className="text-xs text-slate-500">Payments</p>
          <p className="text-lg font-bold text-slate-950">{trip.payments.length}</p>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-white/60 pt-4">
        <p className="text-sm text-slate-500">
          {latestExpense
            ? `${latestExpense.title} was added for $${latestExpense.amount.toFixed(2)}`
            : "No expenses yet"}
        </p>
        <button
          onClick={handleDelete}
          className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-bold text-red-500 transition hover:bg-red-100 hover:text-red-700"
        >
          Delete
        </button>
      </div>
    </Link>
  );
}

export default TripCard;