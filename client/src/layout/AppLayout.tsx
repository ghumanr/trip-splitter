import { Outlet } from "react-router-dom";
import NavBar from "../components/Navbar";
import Sidebar, { MobileNav } from "../components/Sidebar";

function AppLayout() {
  return (
    <div className="app-shell">
      <NavBar />
      <MobileNav />
      <div className="mx-auto flex max-w-7xl">
        <Sidebar />
        <main className="min-w-0 flex-1 p-4 pb-12 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;