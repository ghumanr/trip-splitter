import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import BalanceSummary from "../components/BalanceSummary";
import ExpenseList from "../components/ExpenseList";
import { useAuth } from "../contexts/useAuth";
import api from "../services/api";
import type { Category, Trip } from "../types";

type ExpenseForm = {
  title: string;
  amount: string;
  category: string;
  expenseDate: string;
  paidByUserId: string;
  notes: string;
};

function TripDetailsPage() {
  const { tripId } = useParams<{ tripId: string }>();
  const { user } = useAuth();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [memberName, setMemberName] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const [recordingPaymentKey, setRecordingPaymentKey] = useState<string | null>(null);
  const [expenseForm, setExpenseForm] = useState<ExpenseForm>({
    title: "",
    amount: "",
    category: "Food",
    expenseDate: new Date().toISOString().slice(0, 10),
    paidByUserId: "",
    notes: "",
  });

  const members = useMemo(() => trip?.members || [], [trip?.members]);

  useEffect(() => {
    const loadTrip = async () => {
      try {
        const [tripResponse, categoriesResponse] = await Promise.all([
          api.get(`/trips/${tripId}`),
          api.get("/categories"),
        ]);

        setTrip(tripResponse.data);
        setCategories(categoriesResponse.data);

        const currentMember = tripResponse.data.members.find(
          (member: Trip["members"][number]) => member.user.id === user?.id
        );
        const fallbackMember = tripResponse.data.members[0];

        setExpenseForm((prev) => ({
          ...prev,
          paidByUserId: currentMember?.user.id || fallbackMember?.user.id || "",
          category: categoriesResponse.data[0]?.name || "Food",
        }));
      } catch {
        setError("Could not load this trip.");
      } finally {
        setLoading(false);
      }
    };

    loadTrip();
  }, [tripId, user?.id]);

  const submitExpense = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const response = await api.post("/expenses", {
        tripId,
        ...expenseForm,
      });
      setTrip(response.data);
      setExpenseForm((prev) => ({
        ...prev,
        title: "",
        amount: "",
        notes: "",
      }));
    } catch {
      setError("Could not add expense.");
    } finally {
      setSaving(false);
    }
  };

  const submitMember = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const response = await api.post(`/trips/${tripId}/members`, {
        name: memberName,
        email: memberEmail,
      });
      setTrip(response.data);
      setMemberName("");
      setMemberEmail("");
    } catch {
      setError("Could not add member.");
    } finally {
      setSaving(false);
    }
  };

  const recordSettlementPayment = async (
    fromUserId: string,
    toUserId: string,
    amount: number,
    key: string
  ) => {
    setRecordingPaymentKey(key);
    setError("");

    try {
      const response = await api.post(`/trips/${tripId}/payments`, {
        fromUserId,
        toUserId,
        amount,
      });
      setTrip(response.data);
    } catch {
      setError("Could not record payment.");
    } finally {
      setRecordingPaymentKey(null);
    }
  };

  const deleteExpense = async (expenseId: string) => {
    setSaving(true);
    setError("");

    try {
      const response = await api.delete(`/expenses/${expenseId}`);
      setTrip(response.data);
    } catch {
      setError("Could not delete expense.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="glass-panel-strong rounded-[2rem] p-8 text-slate-600">
        Loading trip...
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="glass-panel-strong rounded-[2rem] p-8 text-slate-600">
        <p className="text-lg font-bold text-slate-950">Trip not found.</p>
        <Link to="/" className="mt-4 inline-block font-bold text-cyan-700">
          Back to dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="glass-dark overflow-hidden rounded-[2.5rem] p-8 text-white">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <Link to="/" className="text-sm font-bold text-cyan-300">
              Back to trips
            </Link>
            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.35em] text-cyan-300">
              {trip.destination || "Trip"}
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
              {trip.title}
            </h2>
            <p className="mt-4 max-w-2xl text-slate-300">
              {trip.description || "Shared travel expenses and settlements."}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-3xl border border-white/10 bg-white/10 p-4 text-center shadow-inner shadow-white/5 backdrop-blur">
              <p className="text-xs text-slate-300">Spent</p>
              <p className="mt-1 text-2xl font-black">${trip.totalSpent.toFixed(2)}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/10 p-4 text-center shadow-inner shadow-white/5 backdrop-blur">
              <p className="text-xs text-slate-300">Members</p>
              <p className="mt-1 text-2xl font-black">{trip.members.length}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/10 p-4 text-center shadow-inner shadow-white/5 backdrop-blur">
              <p className="text-xs text-slate-300">Expenses</p>
              <p className="mt-1 text-2xl font-black">{trip.expenses.length}</p>
            </div>
          </div>
        </div>
      </section>

      {error ? (
        <div className="rounded-3xl border border-red-200/70 bg-red-50/80 p-5 text-sm font-semibold text-red-700 shadow-lg shadow-red-100/50 backdrop-blur">
          {error}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1fr_0.85fr]">
        <div className="space-y-6">
          <form
            onSubmit={submitExpense}
            className="glass-panel-strong rounded-[2rem] p-6"
          >
            <h3 className="text-2xl font-bold text-slate-950">Add Expense</h3>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <input
                type="text"
                placeholder="Expense title"
                className="field"
                value={expenseForm.title}
                onChange={(e) =>
                  setExpenseForm((prev) => ({ ...prev, title: e.target.value }))
                }
                required
              />
              <input
                type="number"
                min="0.01"
                step="0.01"
                placeholder="Amount"
                className="field"
                value={expenseForm.amount}
                onChange={(e) =>
                  setExpenseForm((prev) => ({ ...prev, amount: e.target.value }))
                }
                required
              />
              <select
                className="field"
                value={expenseForm.category}
                onChange={(e) =>
                  setExpenseForm((prev) => ({ ...prev, category: e.target.value }))
                }
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
              <select
                className="field"
                value={expenseForm.paidByUserId}
                onChange={(e) =>
                  setExpenseForm((prev) => ({ ...prev, paidByUserId: e.target.value }))
                }
                required
              >
                {members.map((member) => (
                  <option key={member.user.id} value={member.user.id}>
                    Paid by {member.user.name}
                  </option>
                ))}
              </select>
              <input
                type="date"
                className="field"
                value={expenseForm.expenseDate}
                onChange={(e) =>
                  setExpenseForm((prev) => ({
                    ...prev,
                    expenseDate: e.target.value,
                  }))
                }
              />
              <input
                type="text"
                placeholder="Notes"
                className="field"
                value={expenseForm.notes}
                onChange={(e) =>
                  setExpenseForm((prev) => ({ ...prev, notes: e.target.value }))
                }
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="primary-button mt-5 w-full px-5 py-3"
            >
              {saving ? "Saving..." : "Add Expense"}
            </button>
          </form>

          <ExpenseList expenses={trip.expenses} onDelete={deleteExpense} />
        </div>

        <div className="space-y-6">
          <BalanceSummary balances={trip.balances} />

          <div className="glass-panel-strong rounded-[2rem] p-6">
            <h3 className="text-2xl font-bold text-slate-950">Members</h3>
            <div className="mt-5 space-y-3">
              {members.map((member) => (
                <div key={member.id} className="soft-card rounded-3xl p-4">
                  <p className="font-bold text-slate-950">{member.user.name}</p>
                  <p className="text-sm text-slate-500">{member.user.email}</p>
                </div>
              ))}
            </div>

            <form onSubmit={submitMember} className="mt-5 space-y-3">
              <input
                type="text"
                placeholder="Name"
                className="field"
                value={memberName}
                onChange={(e) => setMemberName(e.target.value)}
              />
              <input
                type="email"
                placeholder="Email"
                className="field"
                value={memberEmail}
                onChange={(e) => setMemberEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-full border border-white/70 bg-white/45 px-5 py-3 font-bold text-slate-700 shadow-sm backdrop-blur transition hover:border-cyan-300 hover:bg-white/75 hover:text-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Add Member
              </button>
            </form>
          </div>

          <div className="glass-panel-strong rounded-[2rem] p-6">
            <h3 className="text-2xl font-bold text-slate-950">Spending by Category</h3>
            <div className="mt-5 space-y-3">
              {trip.categoryTotals.length ? (
                trip.categoryTotals.map((category) => (
                  <div key={category.name} className="soft-card rounded-3xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <p className="font-bold text-slate-950">{category.name}</p>
                      </div>
                      <p className="font-black text-slate-950">
                        ${category.total.toFixed(2)}
                      </p>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/60">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.min(
                            100,
                            (category.total / Math.max(trip.totalSpent, 1)) * 100
                          )}%`,
                          backgroundColor: category.color,
                        }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="soft-card rounded-3xl p-4 text-sm text-slate-500">
                  Add expenses to see category totals.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="glass-panel-strong rounded-[2rem] p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-slate-950">Settle Up</h3>
          {trip.settlements.length > 0 && (
            <span className="rounded-full bg-cyan-100 px-3 py-1 text-sm font-bold text-cyan-700">
              {trip.settlements.length} payment{trip.settlements.length !== 1 ? "s" : ""} needed
            </span>
          )}
        </div>

        {trip.settlements.length ? (
          <div className="mt-5 divide-y divide-white/60">
            {trip.settlements.map((settlement) => {
              const key = `${settlement.from.id}-${settlement.to.id}-${settlement.amount}`;
              const isRecording = recordingPaymentKey === key;
              return (
                <div
                  key={key}
                  className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between first:pt-0 last:pb-0"
                >
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="rounded-2xl bg-slate-100 px-3 py-1.5 text-sm font-bold text-slate-950">
                      {settlement.from.name}
                    </span>
                    <span className="text-sm text-slate-500">pays</span>
                    <span className="rounded-2xl bg-slate-100 px-3 py-1.5 text-sm font-bold text-slate-950">
                      {settlement.to.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-black text-cyan-600">
                      ${settlement.amount.toFixed(2)}
                    </span>
                    <button
                      disabled={isRecording || saving}
                      onClick={() =>
                        recordSettlementPayment(
                          settlement.from.id,
                          settlement.to.id,
                          settlement.amount,
                          key
                        )
                      }
                      className="primary-button px-5 py-2 text-sm disabled:opacity-50"
                    >
                      {isRecording ? "Recording..." : "Record Payment"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="mt-5 rounded-3xl bg-emerald-50 p-5 text-sm font-semibold text-emerald-700">
            Everyone is settled up.
          </p>
        )}
      </div>

    </div>
  );
}

export default TripDetailsPage;