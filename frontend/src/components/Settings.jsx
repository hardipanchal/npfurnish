import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center pt-24 bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Settings</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Enable Notifications</span>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`px-4 py-2 rounded-lg text-white ${notifications ? "bg-green-500" : "bg-gray-400"}`}
            >
              {notifications ? "On" : "Off"}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-700">Dark Mode</span>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`px-4 py-2 rounded-lg text-white ${darkMode ? "bg-blue-500" : "bg-gray-400"}`}
            >
              {darkMode ? "Enabled" : "Disabled"}
            </button>
          </div>
        </div>

        <div className="mt-6 flex justify-between">
          <Link
            to="/profile"
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
          >
            Back to Profile
          </Link>
        </div>

        {/* Enhanced Logout Button */}
        <button
          onClick={handleLogout}
          className="mt-10 w-full py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 shadow-md transition duration-300"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
