import { useAuth } from "../contexts/useAuth";

function Navbar() {
  const { logout, user } = useAuth();

  return (
    <header className="sticky top-0 z-20 border-b border-white/40 bg-white/45 px-6 py-4 shadow-sm shadow-slate-200/40 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-950 text-lg font-black text-white shadow-lg shadow-slate-400/30">
            TS
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-700">
              TripSplitter
            </p>
            <h1 className="text-lg font-bold text-slate-950 sm:text-xl">
              Shared travel expenses
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
            <p className="text-xs text-slate-500">{user?.email}</p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="rounded-full border border-white/70 bg-white/50 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur transition hover:border-cyan-300 hover:bg-white/80 hover:text-cyan-700"
          >
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;