import { Menu,  User  } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Header = () => {
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState("Admin");

  useEffect(() => {
    const storedAdmin = JSON.parse(localStorage.getItem("admin"));
    if (storedAdmin?.name) {
      setAdminName(storedAdmin.name);
    }
  }, []);

  return (
    <header className="flex items-center justify-between bg-white p-4 shadow-md border-b">
      {/* Left Section: Logo & Menu Icon */}
      <div className="flex items-center gap-3">
        <Menu className="w-6 h-6 cursor-pointer md:hidden text-gray-600" />
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
      </div>


      {/* Right Section: Notifications, Settings, Profile */}
      <div className="flex items-center gap-4">
       

        {/* Profile */}
        <div
  onClick={() => navigate("/admin/profile")}
  className="flex items-center gap-2 cursor-pointer p-2 bg-gray-100 rounded-full hover:bg-gray-200"
>

          <User className="w-6 h-6 text-gray-600" />
          <span className="hidden md:inline text-gray-700 font-medium">
            {adminName}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
