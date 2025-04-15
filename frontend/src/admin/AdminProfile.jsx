import { useEffect, useState } from "react";
import axios from "axios";
import { UserCircle2, Mail, ShieldCheck, Pencil } from "lucide-react";

const AdminProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "admin",
  });

  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.get("http://localhost:8000/api/user/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { name, email, role } = res.data.data;
      setFormData({ name, email, role });
    } catch (error) {
      console.error("Failed to fetch admin profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.put(
        "http://localhost:8000/api/user/update-profile", // <-- fixed endpoint
        {
          name: formData.name,
          email: formData.email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating admin profile:", error);
    }
  };
  
  if (loading) return <div className="text-center mt-10">Loading profile...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 sm:p-10">
      <div className="bg-gradient-to-br from-blue-50 to-white rounded-3xl shadow-xl p-8 sm:p-10">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <UserCircle2 className="w-24 h-24 text-blue-500" />
          </div>
          <div>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="text-3xl font-bold text-gray-800 bg-transparent border-b border-blue-400 focus:outline-none"
              />
            ) : (
              <h2 className="text-3xl font-bold text-gray-800">{formData.name}</h2>
            )}
            <p className="text-blue-600 font-medium capitalize">{formData.role}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
          <div className="flex items-start space-x-4">
            <Mail className="text-blue-500 w-6 h-6 mt-1" />
            <div>
              <h4 className="text-sm text-gray-500">Email</h4>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="text-lg font-medium text-gray-800 bg-transparent border-b border-blue-400 focus:outline-none"
                />
              ) : (
                <p className="text-lg font-medium text-gray-800">{formData.email}</p>
              )}
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <ShieldCheck className="text-blue-500 w-6 h-6 mt-1" />
            <div>
              <h4 className="text-sm text-gray-500">Role</h4>
              <p className="text-lg font-medium text-gray-800 capitalize">{formData.role}</p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex justify-end">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 mr-3 text-gray-600 hover:text-red-500 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition shadow-md"
              >
                Save
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition shadow-md"
            >
              <Pencil className="w-4 h-4 mr-2" /> Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
