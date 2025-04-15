import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OrderTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelingOrderId, setCancelingOrderId] = useState(null);
  const navigate = useNavigate();

  const statusStyles = {
    Pending: "text-yellow-500",
    Shipped: "text-blue-500",
    Delivered: "text-green-500",
    Cancelled: "text-red-500",
    Returned: "text-purple-500",
    Processing: "text-indigo-500",
  };

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get("http://localhost:8000/api/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(response.data);
    } catch (error) {
      console.error("Fetch Error:", error);
      setError("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleAssign = async (orderId) => {
    const token = localStorage.getItem("accessToken");

    try {
      const response = await axios.get(
        `http://localhost:8000/api/assigned-providers/check/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.isAssigned) {
        alert("This order is already assigned to a provider.");
      } else {
        navigate("/admin/assign-provider", { state: { orderId } });
      }
    } catch (err) {
      console.error("Error checking assigned provider:", err);
      alert("Failed to check assignment status. Please try again.");
    }
  };

  const handleCancel = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      const token = localStorage.getItem("accessToken");
      setCancelingOrderId(orderId); // Optional loading indicator

      const response = await axios.put(
        `http://localhost:8000/api/orders/${orderId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Cancel response:", response.data);

      await fetchOrders(); // safer and ensures data integrity
    } catch (err) {
      console.error("Failed to cancel order:", err.message);
      setError("Failed to cancel order. Please try again.");
    } finally {
      setCancelingOrderId(null);
    }
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Manage Orders</h2>

      {loading && <p className="text-blue-500">Loading orders...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-100 text-gray-700 uppercase text-sm leading-normal border-b border-gray-300">
              <th className="px-6 py-3 text-left border-r border-gray-300">Customer Name</th>
              <th className="px-6 py-3 text-left border-r border-gray-300">Total</th>
              <th className="px-6 py-3 text-left border-r border-gray-300">Status</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order._id} className="border-b border-gray-300">
                  <td className="px-6 py-4 text-gray-800 border-r border-gray-300">
                    {order?.userId?.name || "No Name"}
                  </td>
                  <td className="px-6 py-4 text-gray-800 font-semibold border-r border-gray-300">
                    {order?.productIds?.[0]?.price
                      ? `$${order.productIds[0].price}`
                      : "$0.00"}
                  </td>
                  <td
                    className={`px-6 py-4 font-medium border-r border-gray-300 ${
                      statusStyles[order.status] || ""
                    }`}
                  >
                    {order.status}
                  </td>
                  <td className="px-6 py-4 flex gap-2 flex-wrap">
                    <button
                      className={`text-white px-3 py-1 rounded-md ${
                        order.status === "Cancelled" || cancelingOrderId === order._id
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-red-500 hover:bg-red-600"
                      }`}
                      onClick={() => handleCancel(order._id)}
                      disabled={
                        order.status === "Cancelled" || cancelingOrderId === order._id
                      }
                    >
                      {cancelingOrderId === order._id ? "Cancelling..." : order.status === "Cancelled" ? "Cancelled" : "Cancel"}
                    </button>

                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
                      onClick={() => handleAssign(order._id)}
                    >
                      Assign
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center text-gray-500 py-4">
                  No orders available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderTable;
