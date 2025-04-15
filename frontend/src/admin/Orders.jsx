import { useState, useEffect } from "react";
import axios from "axios";
import OrderTable from "./order/OrderTable";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [providers, setProviders] = useState([]);
  const [selectedProviders, setSelectedProviders] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Use admin token only (if you’re storing them separately per role)
  const adminToken = localStorage.getItem("adminToken");

  const axiosInstance = axios.create({
    baseURL: "http://localhost:8000/api",
   headers: {
  Authorization: `Bearer ${adminToken}`,
},

  });

  useEffect(() => {
    const fetchOrdersAndProviders = async () => {
      try {
        const [ordersRes, providersRes] = await Promise.all([
          axiosInstance.get("/orders"),
          axiosInstance.get("/admin/providers"),
        ]);
        setOrders(ordersRes.data.orders || ordersRes.data);
        setProviders(providersRes.data?.data || []);

      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch orders and providers. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrdersAndProviders();
  }, []);

  const handleStatusChange = async (orderId, status) => {
    try {
await axiosInstance.put(`/orders/${orderId}`, { status });
      setOrders((prev) =>
        prev.map((order) => (order._id === orderId ? { ...order, status } : order))
      );
    } catch (err) {
      console.error("Status update failed:", err);
      setError("Failed to update order status.");
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        await axiosInstance.delete(`/orders/${orderId}`);
        setOrders((prev) => prev.filter((order) => order._id !== orderId));
        alert("Order deleted.");
      } catch (err) {
        console.error("Delete failed:", err);
        alert("Failed to delete order.");
      }
    }
  };

  const handleProviderChange = (orderId, providerId) => {
    setSelectedProviders((prev) => ({ ...prev, [orderId]: providerId }));
  };

  const assignProvider = async (orderId) => {
    const providerId = selectedProviders[orderId];
    if (!providerId) return alert("Please select a provider.");
  
    try {
      await axiosInstance.post(
        "/assigned-providers",
        { orderId, providerId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // 👈 Use correct token
          },
        }
      );
      alert("Provider assigned!");
    } catch (err) {
      console.error("Assign provider failed:", err);
      alert(err.response?.data?.message || "Failed to assign provider.");
    }
  };
  

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Manage Orders</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <OrderTable
          orders={orders}
          providers={providers}
          selectedProviders={selectedProviders}
          onStatusChange={handleStatusChange}
          onDelete={handleDeleteOrder}
          onProviderChange={handleProviderChange}
          onAssignProvider={assignProvider}
        />
      )}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default Orders;
