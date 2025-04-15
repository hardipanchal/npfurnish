import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Checkout() {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const handlePlaceOrder = async () => {
    const role = window.location.pathname.startsWith("/admin")
      ? "admin"
      : window.location.pathname.startsWith("/provider")
      ? "provider"
      : "customer";
    const token = localStorage.getItem(`accessToken_${role}`);

    if (!token) {
      alert("Please log in to place an order.");
      return navigate("/login");
    }

    if (!address.trim()) {
      alert("Please enter your address.");
      return;
    }

    const productIds = cart.map((item) => item._id);

    const orderData = {
      productIds,
      address,
      status: "Pending",
      inCart: false,
      isConfirm: false,
      isCancelled: false,
      isDelivered: false,
      isDeleted: false,
    };

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.post("http://localhost:8000/api/orders", orderData, config);

      localStorage.removeItem("cart");
      window.dispatchEvent(new Event("cartUpdated"));

      navigate("/order-success");
    } catch (error) {
      console.error("Order failed:", error);
      alert("Something went wrong while placing the order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-24 px-4 bg-gray-100">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-xl">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Checkout</h1>

        <label className="block text-gray-700 font-semibold mb-2">
          Shipping Address
        </label>
        <textarea
          rows="4"
          className="w-full border rounded-xl p-3 mb-6"
          placeholder="Enter full address..."
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        ></textarea>

        {/* ❗ COD Info */}
        <p className="text-yellow-600 font-medium text-center mb-4">
          ⚠️ Only <span className="font-semibold">Cash on Delivery</span> is available.
        </p>

        <button
          onClick={handlePlaceOrder}
          disabled={loading}
          className={`w-full px-6 py-3 rounded-xl text-lg font-semibold transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {loading ? "Placing Order..." : "Place Order"}
        </button>
      </div>
    </div>
  );
}
