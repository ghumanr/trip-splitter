import { NavLink } from "react-router-dom";

function Sidebar() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-2xl px-4 py-3 text-sm font-semibold transition ${
      isActive
        ? "bg-slate-950/95 text-white shadow-lg shadow-slate-950/20"
        : "text-slate-600 hover:bg-white/60 hover:text-slate-950"
    }`;

  return (
    <aside className="hidden w-72 shrink-0 p-6 lg:block">
      <nav className="glass-panel sticky top-28 flex flex-col gap-2 rounded-[2rem] p-3">
        <NavLink to="/" end className={linkClass}>
          Dashboard
        </NavLink>
        <NavLink to="/trips/new" className={linkClass}>
          Create Trip
        </NavLink>
      </nav>
    </aside>
  );
}

export function MobileNav() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex-1 rounded-2xl px-4 py-3 text-center text-sm font-semibold ${
      isActive
        ? "bg-slate-950/95 text-white shadow-lg shadow-slate-400/20"
        : "glass-panel text-slate-600"
    }`;

  return (
    <nav className="grid grid-cols-2 gap-3 px-4 pt-4 lg:hidden">
      <NavLink to="/" end className={linkClass}>
        Dashboard
      </NavLink>
      <NavLink to="/trips/new" className={linkClass}>
        Create Trip
      </NavLink>
    </nav>
  );
}

export default Sidebar;