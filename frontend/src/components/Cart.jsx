import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Trash } from "lucide-react";
import axios from "axios";

export default function Cart() {
  const [cart, setCart] = useState(() => {
    const stored = localStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [];
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    setTimeout(() => {
      window.dispatchEvent(new Event("cartUpdated"));
    }, 0);
  }, [cart]);

  const removeFromCart = (id) => {
    const updatedCart = cart.filter((item) => item._id !== id);
    setCart(updatedCart);
  };

  const updateQuantity = async (id, newQuantity) => {
    if (newQuantity < 1) return; // Prevent setting quantity less than 1

    setLoading(true);

    try {
      const response = await axios.get(`http://localhost:8000/api/products/${id}`);
      const product = response.data;

      console.log("Product details from API:", product);

      const inStock = product.quantity || 0; // Ensure you check quantity, not just inStock flag

      if (inStock >= newQuantity) {
        const updatedCart = cart.map((item) =>
          item._id === id ? { ...item, quantity: newQuantity } : item
        );
        setCart(updatedCart);
        setError(""); // Clear any previous errors
      } else {
        setError(
          inStock > 0
            ? `Only ${inStock} item(s) are available in stock.`
            : "This product is currently out of stock."
        );
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
      setError("There was an issue updating the quantity. Please try again.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const totalPrice = cart.reduce(
    (total, item) => total + (item.price || 0) * (item.quantity || 1),
    0
  );

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center pt-24 px-4">
      <div className="max-w-xl w-full bg-white p-8 rounded-2xl shadow-2xl">
        <h2 className="text-3xl font-extrabold text-gray-800 text-center mb-6">
          🛒 My Cart
        </h2>

        {cart.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            Your cart is empty.
          </p>
        ) : (
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition"
              >
                <div className="flex items-center space-x-4 w-full">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg border"
                  />
                  <div className="w-48">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {item.name}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      $ {item.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input
                      type="number"
                      value={item.quantity || 1}
                      min="1"
                      max={item.inStock}
                      className="w-12 h-10 p-2 border rounded-lg text-center font-semibold shadow-sm ml-8"
                      onChange={(e) =>
                        updateQuantity(item._id, parseInt(e.target.value))
                      }
                      disabled={loading} // Disable input while loading
                    />
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-red-500 hover:bg-red-100 p-2 rounded-full transition"
                    >
                      <Trash size={22} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="text-center text-red-500 mt-4">
            <p>{error}</p>
          </div>
        )}

        {cart.length > 0 && (
          <div className="mt-6">
            <p className="text-xl font-bold text-center text-gray-800">
              Total Price:{" "}
              <span className="text-blue-600">${totalPrice.toFixed(2)}</span>
            </p>
          </div>
        )}

        {cart.length === 0 ? (
          <div className="text-center mt-6">
            <p className="text-gray-500 text-lg">Start shopping now! 🛍️</p>
            <Link
              to="/furniture"
              className="mt-4 inline-block px-6 py-3 bg-blue-600 text-white rounded-xl text-lg font-semibold shadow-md hover:bg-blue-700 transition"
            >
              🛒 Buy Products
            </Link>
          </div>
        ) : (
          <div className="mt-6 text-center">
            <Link
              to="/checkout"
              className="px-8 py-3 bg-blue-600 text-white rounded-xl text-lg font-semibold shadow-md hover:bg-blue-700 transition"
            >
              Proceed to Checkout
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
