import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { Heart, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ item }) => {
  const navigate = useNavigate();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isCartClicked, setIsCartClicked] = useState(false);
  const [isHeartClicked, setIsHeartClicked] = useState(false);

  // Check if the item is already in the wishlist
  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setIsWishlisted(wishlist.some((wishItem) => wishItem._id === item._id));
  }, [item._id]);

  const handleWishlist = () => {
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    if (isWishlisted) {
      wishlist = wishlist.filter((wishItem) => wishItem._id !== item._id);
    } else {
      wishlist.push(item);
    }

    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    setIsWishlisted(!isWishlisted);

    // Animate heart
    setIsHeartClicked(true);
    setTimeout(() => setIsHeartClicked(false), 300);
  };

  const addToCart = (product) => {
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItemIndex = existingCart.findIndex(
      (cartItem) => cartItem._id === product._id
    );

    if (existingItemIndex !== -1) {
      existingCart[existingItemIndex].quantity += 1;
    } else {
      existingCart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));

    // Dispatch custom event to update cart UI
    setTimeout(() => {
      window.dispatchEvent(new Event("cartUpdated"));
    }, 0);

    // Animate cart button
    setIsCartClicked(true);
    setTimeout(() => setIsCartClicked(false), 300);
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 relative group">
      {/* Wishlist Heart */}
      <button
        onClick={handleWishlist}
        className={`absolute top-3 right-3 transition transform ${
          isHeartClicked ? "scale-125" : "scale-100"
        } duration-200 ease-in-out`}
      >
        <Heart
          size={22}
          className={`transition-all duration-200 ${
            isWishlisted ? "text-red-500 fill-red-500" : "text-gray-400"
          }`}
          fill={isWishlisted ? "red" : "none"}
        />
      </button>

      {/* Product Image */}
      <img
        src={item.image}
        alt={item.name}
        className="w-full h-56 object-cover rounded-lg"
      />

      {/* Product Info */}
      <div className="mt-3">
  <h3 className="text-lg font-semibold">{item.name}</h3>
  <p className="text-gray-500">${item.price}</p>

  {/* In Stock and Quantity */}
  <p className="text-sm text-green-600">In Stock: {item.inStock ? "Yes" : "No"}</p>
  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>

  {/* Action Buttons */}
  <div className="flex justify-between items-center mt-4">
    {/* View Details */}
    <button
      onClick={() => navigate(`/product/${item._id}`)}
      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95"
    >
      View Details
    </button>

    {/* Add to Cart */}
    <button
  onClick={() => addToCart(item)}
  className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-md transition-all duration-300 ease-in-out transform
    ${
      item.inStock
        ? "bg-green-600 text-white hover:bg-green-700 hover:shadow-lg"
        : "bg-gray-400 text-gray-200 cursor-not-allowed"
    }
    ${isCartClicked ? "scale-110" : "hover:scale-105 active:scale-95"}
  `}
  disabled={!item.inStock}
>


      <ShoppingCart size={18} /> 
  {item.inStock ? "Add to Cart" : "Out of Stock"}

    </button>
  </div>
</div>

    </div>
  );
};

ProductCard.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
    inStock:PropTypes.bool.isRequired,
    quantity :PropTypes.string.isRequired
  }).isRequired,
};

export default ProductCard;
