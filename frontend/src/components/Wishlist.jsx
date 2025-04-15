import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Trash, ShoppingCart } from "lucide-react";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState(JSON.parse(localStorage.getItem("wishlist")) || []);
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem("cart")) || []);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [wishlist, cart]);

  const removeFromWishlist = (id) => {
    const updatedWishlist = wishlist.filter(item => item._id !== id);
    setWishlist(updatedWishlist);
  };

  const addToCart = (item) => {
    if (!cart.some(cartItem => cartItem._id === item._id)) {
      setCart([...cart, item]);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-24 bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">My Wishlist</h2>
        {wishlist.length === 0 ? (
          <p className="text-center text-gray-600">Your wishlist is empty.</p>
        ) : (
          <div className="space-y-4">
            {wishlist.map(item => (
              <div key={item._id} className="flex items-center justify-between p-4 border rounded-lg shadow-sm bg-gray-50">
                <div className="flex items-center space-x-4">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-gray-600">${item.price}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button onClick={() => addToCart(item)} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center">
                    <ShoppingCart className="w-5 h-5 mr-1" /> Add to Cart
                  </button>
                  <button onClick={() => removeFromWishlist(item._id)} className="text-red-500 hover:text-red-700">
                    <Trash size={24} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="mt-6 text-center">
          <Link to="/furniture" className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
