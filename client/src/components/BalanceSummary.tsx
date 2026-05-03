import type { Balance } from "../types";

type BalanceSummaryProps = {
  balances: Balance[];
};

function BalanceSummary({ balances }: BalanceSummaryProps) {
  return (
    <div className="glass-panel-strong rounded-[2rem] p-6">
      <h3 className="text-2xl font-bold text-slate-950">Balances</h3>

      <div className="mt-5 space-y-3">
        {balances.map((item) => (
          <div
            key={item.user.id}
            className="soft-card flex items-center justify-between rounded-2xl p-4"
          >
            <div>
              <p className="font-bold text-slate-950">{item.user.name}</p>
              <p className="text-xs text-slate-500">{item.user.email}</p>
            </div>
            <span
              className={
                item.balance >= 0
                  ? "font-black text-emerald-600"
                  : "font-black text-red-500"
              }
            >
              {item.balance >= 0
                ? `+$${item.balance.toFixed(2)}`
                : `-$${Math.abs(item.balance).toFixed(2)}`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BalanceSummary;