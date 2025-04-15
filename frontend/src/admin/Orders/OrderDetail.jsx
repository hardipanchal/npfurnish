import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Status style map
  const statusStyles = {
    Pending: "bg-yellow-200 text-yellow-700",
    Shipped: "bg-blue-200 text-blue-700",
    Delivered: "bg-green-200 text-green-700",
    Cancelled: "bg-red-200 text-red-700",
    Returned: "bg-purple-200 text-purple-700",
    Processing: "bg-indigo-200 text-indigo-700",
  };

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/orders/${id}`);
        setOrder(response.data);
      } catch (err) {
        setError("Failed to fetch order details. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  if (loading)
    return (
      <div className="text-center text-gray-600">
        <p>Loading order details...</p>
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-500">
        <p>{error}</p>
      </div>
    );

  const statusClass = statusStyles[order?.status] || "bg-gray-200 text-gray-700";

  return (
    <div className="max-w-xl mx-auto bg-white p-6 shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">Order Details</h2>

      <p className="mb-2">
        <strong>Customer Name:</strong> {order?.userId?.name || "N/A"}
      </p>

      <p className="mb-4">
        <strong>Status:</strong>{" "}
        <span className={`px-2 py-1 rounded ${statusClass}`}>
          {order?.status || "Pending"}
        </span>
      </p>

      {order?.productIds && order.productIds.length > 0 ? (
        <div>
          <strong className="block mb-2">Products:</strong>
          {order.productIds.map((product, index) => (
            <div
              key={index}
              className="mb-3 border border-gray-200 p-3 rounded-md bg-gray-50"
            >
              <p>
                <strong>Product Name:</strong> {product.name || "N/A"}
              </p>
              <p>
                <strong>Price:</strong> ${product.price || "0.00"}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No products found in this order.</p>
      )}
    </div>
  );
};

export default OrderDetail;
