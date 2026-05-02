import type { Balance } from "../types";

type BalanceSummaryProps = {
  balances: Balance[];
};

function BalanceSummary({ balances }: BalanceSummaryProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="text-2xl font-semibold mb-4">Balances</h3>

      <div className="space-y-3">
        {balances.map((item) => (
          <div
            key={item.user}
            className="flex justify-between border-b pb-2 last:border-b-0"
          >
            <span>{item.user}</span>
            <span
              className={
                item.balance >= 0
                  ? "text-green-600 font-semibold"
                  : "text-red-500 font-semibold"
              }
            >
              {item.balance >= 0
                ? `+$${item.balance}`
                : `-$${Math.abs(item.balance)}`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BalanceSummary;