import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="w-64 bg-white min-h-[calc(100vh-72px)] shadow-md p-4">
      <nav className="flex flex-col gap-3">
        <Link to="/" className="text-gray-700 hover:text-blue-600">
          Dashboard
        </Link>
        <Link to="/trips/new" className="text-gray-700 hover:text-blue-600">
          Create Trip
        </Link>
      </nav>
    </aside>
  );
}

export default Sidebar;