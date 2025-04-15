import { useEffect, useState } from 'react';
import axios from 'axios';

const ProviderList = () => {
  const [providers, setProviders] = useState([]);

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/admin/providers');
      if (res.data.success) {
        setProviders(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching providers:', error);
    }
  };

  const handleEdit = (id) => {
    console.log('Edit provider:', id);
    // Add navigation or modal logic here
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this provider?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:8000/api/admin/providers/${id}`);
      setProviders(prev => prev.filter(provider => provider._id !== id));
    } catch (error) {
      console.error('Error deleting provider:', error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">All Providers</h2>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-center">
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Phone</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Verified</th>
              <th className="px-4 py-2 border">Logged In</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {providers.map(provider => (
              <tr key={provider._id} className="text-center hover:bg-gray-50 transition-all">
                <td className="px-4 py-2 border">{provider.name}</td>
                <td className="px-4 py-2 border">{provider.email}</td>
                <td className="px-4 py-2 border">{provider.phone}</td>
                <td className="px-4 py-2 border">{provider.status}</td>
                <td className="px-4 py-2 border">{provider.isVerified ? 'Yes' : 'No'}</td>
                <td className="px-4 py-2 border">{provider.isLoggedIn ? 'Yes' : 'No'}</td>
                <td className="px-4 py-2 border space-x-2">
                  <button
                    onClick={() => handleEdit(provider._id)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(provider._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {providers.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">
                  No providers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProviderList;
