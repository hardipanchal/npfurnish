import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ProductCard from "./ProductCard";

const Products = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState(JSON.parse(localStorage.getItem("wishlist")) || []);
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem("cart")) || []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!category) {
        setLoading(false);
        return;
      }
      try {
        const encodedCategory = encodeURIComponent(category.toLowerCase());
        const response = await axios.get(`http://localhost:8000/api/products?category=${encodedCategory}`);
        setProducts(response.data);
      } catch (error) {
        setError("Failed to load products.",error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category]);

  // Toggle Wishlist
  const toggleWishlist = (product) => {
    let updatedWishlist;
    if (wishlist.some(item => item._id === product._id)) {
      updatedWishlist = wishlist.filter(item => item._id !== product._id);
    } else {
      updatedWishlist = [...wishlist, product];
    }
    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
  };

  // Add to Cart
  const addToCart = (product) => {
    let updatedCart = [...cart];
    const existingItem = updatedCart.find(item => item._id === product._id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      updatedCart.push({ ...product, quantity: 1 });
    }

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  return (
    <div className="p-5 mt-24">
      <h2 className="text-2xl font-bold mb-4 capitalize">{category} Products</h2>

      {loading && <p className="text-gray-600">Loading products...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard 
              key={product._id} 
              item={product} 
              toggleWishlist={toggleWishlist} 
              addToCart={addToCart}
              wishlist={wishlist} 
            />
          ))}
        </div>
      ) : (
        !loading && <p className="text-gray-500">No products found in &quot;{category}&quot;. Try a different category.</p>
      )}
    </div>
  );
};

export default Products;
