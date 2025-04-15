import { useEffect, useState } from "react";
import axios from "axios";
import { PackageCheck } from "lucide-react";

const ProviderDashboard = () => {
  const [assignments, setAssignments] = useState([]);
  const [providerName, setProviderName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("accessToken_provider");

        // Fetch provider profile
        const profileRes = await axios.get(
          "http://localhost:8000/api/user/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        setProviderName(profileRes.data.name || "Provider");

        // Fetch assigned deliveries
        const assignedRes = await axios.get(
          "http://localhost:8000/api/assigned-providers/assigned",
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        const data = Array.isArray(assignedRes.data)
          ? assignedRes.data
          : assignedRes.data.assignments || [];

        // Ensure the status and isDelivered field are set properly
        const updatedAssignments = data.map((assignment) => ({
          ...assignment,
          isDelivered: assignment.status === "delivered", // Set isDelivered based on status
        }));

        setAssignments(updatedAssignments);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const markDelivered = async (id) => {
    try {
      const token = localStorage.getItem("accessToken_provider");

      await axios.put(
        `http://localhost:8000/api/assigned-providers/deliver/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      
      // Update the status locally to avoid re-fetching
      setAssignments((prev) =>
        prev.map((a) =>
          a._id === id ? { ...a, isDelivered: true, status: "Delivered" } : a
        )
      );
    } catch (err) {
      console.error("Error marking as delivered:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome, {providerName}! 👋
        </h1>
        <p className="text-gray-600 mb-8">Here are your assigned deliveries:</p>

        {loading ? (
          <p className="text-gray-600">Loading orders...</p>
        ) : assignments.length === 0 ? (
          <p className="text-gray-500">No deliveries assigned yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignments.map((assignment) => {
              const isDelivered = assignment.isDelivered;
              const isCancelled = assignment.status === "Cancel";
              const statusLabel = isCancelled
                ? "Cancelled"
                : isDelivered
                ? "Delivered"
                : "Pending";

              const statusClass = isCancelled
                ? "bg-red-100 text-red-700"
                : isDelivered
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700";

              const buttonText = isDelivered
                ? "Delivered"
                : isCancelled
                ? "Cancelled"
                : "Mark as Delivered";

              return (
                <div
                  key={assignment._id}
                  className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h2 className="text-lg font-semibold text-gray-800">
                      Order #{assignment._id.slice(-5) || "N/A"}
                    </h2>
                    <PackageCheck className="w-5 h-5 text-blue-600" />
                  </div>

                  <div className="space-y-1 text-sm text-gray-600">
                    <p>
                      <span className="font-medium">Customer:</span>{" "}
                      {assignment.customerName || "N/A"}
                    </p>
                    <p>
                      <span className="font-medium">Address:</span>{" "}
                      {assignment.address || "N/A"}
                    </p>
                    <p>
                      <span className="font-medium">Status:</span>{" "}
                      <span
                        className={`inline-block px-2 py-0.5 text-xs rounded-full ${statusClass}`}
                      >
                        {statusLabel}
                      </span>
                    </p>
                  </div>

                  <p className="text-xs text-gray-400 mt-3">
                    Last updated:{" "}
                    {new Date(assignment.updatedAt).toLocaleString()}
                  </p>

                  <button
                    onClick={() => markDelivered(assignment._id)}
                    disabled={isDelivered || isCancelled}
                    className={`mt-4 px-4 py-2 rounded text-white transition ${
                      isDelivered || isCancelled
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-500 hover:bg-green-600"
                    }`}
                  >
                    {buttonText}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderDashboard;
