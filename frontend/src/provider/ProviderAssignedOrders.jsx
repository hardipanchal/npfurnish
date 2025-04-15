import { useEffect, useState } from "react";
import axios from "axios";

const ProviderAssignedOrders = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAssignedOrders = async () => {
    try {
      const token = localStorage.getItem("accessToken"); // ✅ Correct token key
  
      if (!token) {
        throw new Error("Access token not found");
      }
  
      const response = await axios.get("http://localhost:8000/api/assigned-providers/assigned", {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Format is important
        },
      });
  
      setAssignments(response.data.assignments);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching assigned orders:", err);
      setError("Failed to load assigned orders.");
      setLoading(false);
    }
  };
  
  

  useEffect(() => {
    fetchAssignedOrders();
  }, []);

  if (loading) {
    return <div className="text-center p-6 text-lg">Loading assigned orders...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-6">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">My Assigned Orders</h2>

      {assignments.length === 0 ? (
        <p className="text-gray-600">No assigned orders yet.</p>
      ) : (
        <div className="space-y-4">
          {assignments.map((order) => (
            <div
              key={order._id}
              className="border rounded-xl p-4 shadow hover:shadow-md transition"
            >
              <p><strong>Customer:</strong> {order.customerName}</p>
              <p><strong>Address:</strong> {order.address}</p>
              <p><strong>Status:</strong> <span className={`font-semibold ${order.status === "delivered" ? "text-green-600" : "text-yellow-600"}`}>{order.status}</span></p>
              <p><strong>Updated:</strong> {new Date(order.updatedAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProviderAssignedOrders;
