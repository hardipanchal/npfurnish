import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { FiEye, FiTrash2 } from "react-icons/fi";
import ProviderList from "./Provider/ProviderList";

// Token helper
const getToken = () => localStorage.getItem("token") || "";

// Subcomponent for provider row
const ProviderRow = ({ provider, onDelete, onView }) => (
  <tr key={provider._id} className="border-b hover:bg-gray-50 transition-all">
    <td className="py-3 px-4 text-gray-800">{provider.name || "Unnamed"}</td>
    <td className="py-3 px-4 text-gray-800">{provider.email || "No email"}</td>
    <td className="py-3 px-4 text-gray-800">{provider.phone || "N/A"}</td>
    <td className="py-3 px-4">
      {provider.isVerified ? (
        <span className="bg-green-100 text-green-700 px-3 py-1 text-xs rounded-full font-medium">
          Verified
        </span>
      ) : (
        <span className="bg-red-100 text-red-700 px-3 py-1 text-xs rounded-full font-medium">
          Not Verified
        </span>
      )}
    </td>
    <td className="py-3 px-4 space-x-3 flex items-center gap-4">
      <button
        onClick={() => onView(provider._id)}
        title="View Provider"
        className="text-blue-600 hover:text-blue-800"
      >
        <FiEye size={18} />
      </button>
      <button
        onClick={() => onDelete(provider._id)}
        title="Delete Provider"
        className="text-red-600 hover:text-red-800"
      >
        <FiTrash2 size={18} />
      </button>
    </td>
  </tr>
);

ProviderRow.propTypes = {
  provider: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    isVerified: PropTypes.bool.isRequired,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
  onView: PropTypes.func.isRequired,
};

const Provider = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = getToken();
      if (!token) {
        console.warn("Token not found — skipping fetchProviders");
        return;
      }
    };
    fetchData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">All Providers</h2>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email"
          className="w-full sm:w-1/2 px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/admin/add-provider")}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md font-medium shadow"
          >
            + Add Provider
          </button>
          {/* <button
            onClick={fetchProviders}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md font-medium shadow"
          >
            Refresh List
          </button> */}
        </div>
      </div>
      {/* <AdminProviderList/> */}

     <ProviderList/>
    </div>
  );
};

export default Provider;
