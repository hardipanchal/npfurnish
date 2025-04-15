import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import { useAuth } from "../pages/Login/AuthContext"; // ✅ Corrected path
// Adjust the path if needed

const ProviderProfile = () => {
  const { user, loading: authLoading, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // If the user isn't logged in, redirect to login
    if (!user && !authLoading) {
      navigate("/login");
    } else {
      setLoading(false); // Set loading to false once the user data is available
    }
  }, [user, authLoading, navigate]);

  const handleLogout = () => {
    logout();  // Using the logout function from context to clear user session
    navigate("/login");
  };

  if (loading || authLoading) {
    return <div className="text-center mt-32 text-lg text-gray-600">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 pt-8">
      <div className="max-w-md w-full bg-gradient-to-br from-indigo-50 to-white p-8 rounded-2xl shadow-xl">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-indigo-600 flex items-center justify-center text-white">
            <User size={50} />
          </div>
          <h2 className="mt-4 text-2xl font-bold text-gray-800">{user?.name}</h2>
          <p className="text-gray-600 text-sm">{user?.email}</p>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          Logged in as{" "}
          <span className="font-medium text-gray-700 capitalize">
            {user?.role || "provider"}
          </span>
        </div>

        <button
          onClick={handleLogout}
          className="mt-8 w-full py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition shadow"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProviderProfile;
