import { NavLink, Outlet } from "react-router-dom";
import { PackageCheck, User } from "lucide-react";

const ProviderLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6 hidden md:block">
        <h2 className="text-2xl font-bold text-blue-600 mb-8">Provider Panel</h2>
        <nav className="space-y-4">
          

          <NavLink
            to="/provider"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                isActive
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-200"
              }`
            }
          >
            <PackageCheck className="w-5 h-5" />
            Orders
          </NavLink>

          <NavLink
            to="/provider/profile"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                isActive
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-200"
              }`
            }
          >
            <User className="w-5 h-5" />
            Profile
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default ProviderLayout;
