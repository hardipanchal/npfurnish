import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const AssignOrder = () => {
  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState("");
  const [isAlreadyAssigned, setIsAlreadyAssigned] = useState(false);
  const [assignedProvider, setAssignedProvider] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { orderId } = location.state || {};

  useEffect(() => {
    const token = localStorage.getItem("accessToken_admin");



    const fetchProviders = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:8000/api/admin/providers", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProviders(response.data.data);
        setError("");
      } catch (err) {
        console.error("Error fetching providers:", err);
        setError("Failed to load providers.");
      } finally {
        setLoading(false);
      }
    };

    const checkIfAssigned = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/assigned-providers/check/${orderId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.data.isAssigned) {
          setIsAlreadyAssigned(true);
          setAssignedProvider(res.data.assignedProvider?.providerId); // Optional: save full object
        }
      } catch (err) {
        console.error("Error checking assignment:", err);
      }
    };

    fetchProviders();
    if (orderId) checkIfAssigned();
    setError("");
    setSuccess("");
  }, [orderId]);

  const handleAssign = async () => {
    if (!selectedProvider) {
      setError("Please select a provider.");
      return;
    }
  
    try {
      setSubmitting(true);
      const token = localStorage.getItem("accessToken_admin"); // ✅ Use consistent key
  
      const response = await axios.post(
        "http://localhost:8000/api/assigned-providers",
        {
          orderId,
          providerId: selectedProvider,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
  
      setSuccess("Provider assigned successfully!");
      setError("");
      setTimeout(() => navigate("/admin/orders"), 1500);
    } catch (err) {
      console.error("Error assigning provider:", err);
      setError(
        err.response?.data?.message || "Failed to assign provider. Please try again."
      );
      setSuccess("");
    } finally {
      setSubmitting(false);
    }
  };
  
  

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Assign Provider</h2>

      {isAlreadyAssigned ? (
        <div className="text-red-500 font-semibold mb-4">
          This order is already assigned to:
          <span className="ml-1 text-gray-800 font-bold">
            {assignedProvider?.name || "a provider"}
          </span>
        </div>
      ) : (
        <>
          {error && <p className="text-red-500 mb-2">{error}</p>}
          {success && <p className="text-green-500 mb-2">{success}</p>}

          {loading ? (
            <p className="text-gray-600">Loading providers...</p>
          ) : providers.length === 0 ? (
            <p className="text-yellow-600 font-medium">No providers available for assignment.</p>
          ) : (
            <>
              <label className="block mb-2 text-gray-700 font-semibold">Select Provider:</label>
              <select
                className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
                value={selectedProvider}
                onChange={(e) => setSelectedProvider(e.target.value)}
              >
                <option value="">-- Select Provider --</option>
                {providers.map((provider) => (
                  <option key={provider._id} value={provider._id}>
                    {provider.name}
                  </option>
                ))}
              </select>

              <button
                className={`bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 ${
                  submitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={handleAssign}
                disabled={submitting}
              >
                {submitting ? "Assigning..." : "Assign"}
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default AssignOrder;
