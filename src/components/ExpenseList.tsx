import type { Expense } from "../types";

type ExpenseListProps = {
  expenses: Expense[];
};

function ExpenseList({ expenses }: ExpenseListProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="text-2xl font-semibold mb-4">Expenses</h3>

      <div className="space-y-4">
        {expenses.map((expense) => (
          <div
            key={expense.id}
            className="border rounded-lg p-4 flex justify-between items-center"
          >
            <div>
              <h4 className="font-semibold">{expense.title}</h4>
              <p className="text-sm text-gray-600">
                Paid by {expense.paidBy} • {expense.category}
              </p>
              <p className="text-sm text-gray-500">{expense.date}</p>
            </div>

            <div className="text-lg font-bold text-green-600">
              ${expense.amount}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExpenseList;