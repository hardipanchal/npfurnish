import { Link } from "react-router-dom";
import { LayoutDashboard, Package, Users, FileText, LogOut, List, Truck } from "lucide-react";
import { useAuth } from "../pages/Login/AuthContext";

const AdminSidebar = () => {
  const { logout } = useAuth(); // Get logout function

  return (
    <div className="w-64 h-screen bg-gray-800 text-white p-5">
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
      <ul className="space-y-4">
        <li>
          <Link to="/admin/" className="flex items-center gap-2 hover:text-gray-400">
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </Link>
        </li>
        <li>
          <Link to="/admin/orders" className="flex items-center gap-2 hover:text-gray-400">
            <FileText className="w-5 h-5" /> Orders
          </Link>
        </li>
        <li>
          <Link to="/admin/categories" className="flex items-center gap-2 hover:text-gray-400">
            <List className="w-5 h-5" /> Categories
          </Link>
        </li>
        <li>
          <Link to="/admin/products" className="flex items-center gap-2 hover:text-gray-400">
            <Package className="w-5 h-5" /> Products
          </Link>
        </li>
        <li>
          <Link to="/admin/users" className="flex items-center gap-2 hover:text-gray-400">
            <Users className="w-5 h-5" /> Users
          </Link>
        </li>
        <li>
          <Link to="/admin/provider" className="flex items-center gap-2 hover:text-gray-400">
            <Truck className="w-5 h-5" /> Providers
          </Link>
        </li>
        
        <li>
          <button onClick={logout} className="flex items-center gap-2 hover:text-gray-400 w-full text-left">
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default AdminSidebar;
