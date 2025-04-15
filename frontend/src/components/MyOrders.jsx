import { useEffect, useState } from "react";
import axios from "axios";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelingOrderId, setCancelingOrderId] = useState(null);

  // Fetch orders for the logged-in user
  const fetchOrders = async () => {
    const role = window.location.pathname.startsWith("/admin")
      ? "admin"
      : window.location.pathname.startsWith("/provider")
      ? "provider"
      : "customer";
  
    const token = localStorage.getItem(`accessToken_${role}`);
    try {
      const res = await axios.get("http://localhost:8000/api/orders/myorders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchOrders();
  }, []);

  // Cancel order handler
  const handleCancelOrder = async (orderId) => {
    const token = localStorage.getItem("accessToken");
    const confirm = window.confirm("Are you sure you want to cancel this order?");
    if (!confirm) return;

    try {
      setCancelingOrderId(orderId);
      await axios.put(`http://localhost:8000/api/orders/${orderId}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchOrders(); // refresh order list
    } catch (err) {
      console.error("Error canceling order:", err);
    } finally {
      setCancelingOrderId(null);
    }
  };

  if (loading) return <div className="pt-32 text-center">Loading...</div>;

  return (
    <div className="pt-28 px-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-600">You have no orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className={`p-4 rounded-xl shadow ${
                order.status === "Cancelled" ? "bg-red-50 border border-red-300" : "bg-white"
              }`}
            >
              <div className="text-sm text-gray-500">Order ID: {order.refId}</div>

              <div className="mt-1 font-semibold text-gray-800 flex items-center gap-2">
                Status:
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    order.status === "Delivered"
                      ? "bg-green-100 text-green-700"
                      : order.status === "Cancelled"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              <div className="text-sm mt-2 text-gray-600 space-y-1">
                {order.productIds.map((p) => (
                  <div key={p._id}>🪑 {p.name} - ₹{p.price}</div>
                ))}
              </div>

              <div className="text-sm text-gray-500 mt-2">
                Address: {order.address}
              </div>

              <div className="text-sm text-gray-400 mt-1">
                Ordered on: {new Date(order.createdAt).toLocaleDateString()}
              </div>

              {/* Cancel Button (only if order is not delivered or cancelled) */}
              {order.status !== "Delivered" && order.status !== "Cancelled" && (
                <button
                  disabled={cancelingOrderId === order._id}
                  onClick={() => handleCancelOrder(order._id)}
                  className="mt-4 px-4 py-1 rounded bg-red-500 text-white hover:bg-red-600 disabled:bg-red-300"
                >
                  {cancelingOrderId === order._id ? "Cancelling..." : "Cancel Order"}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
