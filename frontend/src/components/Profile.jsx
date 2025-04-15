import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import { useAuth } from "../pages/Login/AuthContext";

export default function Profile() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="text-center mt-32 text-lg text-gray-600">Loading...</div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center pt-24 bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Profile
        </h2>
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center text-white text-3xl">
            <User size={50} />
          </div>
          <h3 className="mt-4 text-xl font-semibold text-gray-800">{user.name}</h3>
          <p className="text-gray-600">{user.email}</p>
        </div>

        {/* Profile Options */}
        <div className="mt-6 space-y-3">
          <Link to="/orders" className="block w-full text-left px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200">
            My Orders
          </Link>
          <Link to="/wishlist" className="block w-full text-left px-4 py-2 bg-pink-100 text-pink-800 rounded-lg hover:bg-pink-200">
            Wishlist
          </Link>
          
          
          <Link to="/editprofile" className="block w-full text-left px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
            Edit Profile
          </Link>
        </div>

        {/* Logout Button */}
        <button
          onClick={() => {
            localStorage.clear();
            navigate("/login");
          }}
          className="mt-10 w-full py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 shadow-md transition duration-300"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
