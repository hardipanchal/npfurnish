import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Heart } from "lucide-react";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [wishlist, setWishlist] = useState(JSON.parse(localStorage.getItem("wishlist")) || []);
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem("cart")) || []);
  const [zoomStyle, setZoomStyle] = useState({ display: "none" });
  const imageRef = useRef(null);

  // Track the number of items in the cart
  const [cartItemCount, setCartItemCount] = useState(cart.length);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/products/${id}`);
        if (!response.ok) throw new Error("Failed to fetch product");
        const data = await response.json();
        console.log("Fetched product:", data); // 🔍 Debug log
        setProduct(data);
      } catch (error) {
        console.error("❌ Error loading product:", error);
      }
    };
    fetchProduct();
  }, [id]);

  // Update cart item count whenever the cart changes
  useEffect(() => {
    setCartItemCount(cart.length);
  }, [cart]);

  const isWishlisted = wishlist.some((item) => item._id === product?._id);

  const toggleWishlist = () => {
    let updated;
    if (isWishlisted) {
      updated = wishlist.filter((item) => item._id !== product._id);
    } else {
      updated = [...wishlist, product];
    }
    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
  };

  const addToCart = () => {
    let updatedCart = [...cart];
    const existing = updatedCart.find((item) => item._id === product._id);
    if (existing) {
      existing.quantity += 1;
    } else {
      updatedCart.push({ ...product, quantity: 1 });
    }
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleMouseMove = (e) => {
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomStyle({
      display: "block",
      backgroundImage: `url(${getImageUrl()})`,
      backgroundPosition: `${x}% ${y}%`,
      backgroundSize: "250%",
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: "none" });
  };

  const getImageUrl = () => {
    if (!product?.image) return "";
    return product.image.startsWith("http")
      ? product.image
      : `http://localhost:8000/images/${product.image}`;
  };

  if (!product) return <div className="mt-24 text-center text-gray-600">Loading...</div>;

  return (
    <div className="container mx-auto px-4 mt-24">
      <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col md:flex-row gap-6">
        {/* Left: Product Image */}
        <div className="relative md:w-1/2">
          <img
            ref={imageRef}
            src={getImageUrl()}
            alt={product.name}
            className="w-full h-[400px] rounded-2xl object-cover border border-gray-200 shadow-md cursor-crosshair"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          />
          <div
            className="absolute top-0 right-0 w-40 h-40 hidden md:block rounded-lg border border-gray-300 shadow-lg"
            style={{ ...zoomStyle, backgroundRepeat: "no-repeat" }}
          ></div>
        </div>

        {/* Right: Details */}
        <div className="md:w-1/2 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-gray-600 mt-3">{product.description}</p>
            <p className="text-2xl font-semibold text-blue-500 mt-4">${product.price}</p>
            <p className={`mt-2 text-lg ${product.inStock ? "text-green-500" : "text-red-500"}`}>
              {product.inStock ? "In Stock ✅" : "Out of Stock ❌"}
            </p>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={addToCart}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-md transition-all duration-300 ease-in-out transform
                ${product.inStock ? "bg-green-600 text-white hover:bg-green-700 hover:shadow-lg" : "bg-gray-400 text-gray-200 cursor-not-allowed"}
              `}
              disabled={!product.inStock}
            >
              {product.inStock ? "Add to Cart" : "Out of Stock"}
            </button>

            <button
              onClick={toggleWishlist}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg shadow-md transition-transform transform hover:scale-105 ${
                isWishlisted ? "bg-red-500 text-white" : "bg-gray-300 text-gray-800"
              }`}
            >
              <Heart size={22} fill={isWishlisted ? "red" : "none"} /> Wishlist
            </button>
          </div>
        </div>
      </div>

      {/* Cart Button with Item Count */}
      <div className="fixed bottom-8 right-8">
        <button className="relative bg-blue-500 text-white rounded-full p-4 shadow-lg">
          <i className="fas fa-shopping-cart"></i>
          {cartItemCount > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs px-2 py-1">
              {cartItemCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
