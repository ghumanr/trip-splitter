import type { Expense } from "../types";

type ExpenseListProps = {
  expenses: Expense[];
  onDelete?: (expenseId: string) => void;
};

function ExpenseList({ expenses, onDelete }: ExpenseListProps) {
  return (
    <div className="glass-panel-strong rounded-[2rem] p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-slate-950">Expenses</h3>
        <span className="rounded-full bg-white/60 px-3 py-1 text-sm font-bold text-slate-600 shadow-sm">
          {expenses.length}
        </span>
      </div>

      <div className="mt-5 space-y-3">
        {expenses.length ? (
          expenses.map((expense) => (
            <div
              key={expense.id}
              className="soft-card rounded-3xl p-4"
            >
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: expense.categoryColor }}
                    />
                    <h4 className="font-bold text-slate-950">{expense.title}</h4>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">
                    Paid by {expense.paidBy.name} • {expense.category}
                  </p>
                  <p className="text-sm text-slate-400">
                    {new Date(expense.expenseDate).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xl font-black text-slate-950">
                      ${expense.amount.toFixed(2)}
                    </p>
                    <p className="text-xs text-slate-500">
                      {expense.splits.length} splits
                    </p>
                  </div>
                  {onDelete ? (
                    <button
                      type="button"
                      onClick={() => onDelete(expense.id)}
                      className="rounded-full border border-red-100/80 bg-white/50 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-50"
                    >
                      Delete
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-3xl border border-dashed border-white/80 bg-white/35 p-8 text-center text-slate-500">
            No expenses yet.
          </div>
        )}
      </div>
    </div>
  );
}

export default ExpenseList;