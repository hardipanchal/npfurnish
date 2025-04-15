import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Search, Heart, ShoppingCart, User } from "lucide-react";
import axios from "axios";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  const searchRef = useRef();

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  // Fetch suggestions only when Enter key is pressed
  const handleSearchKeyDown = async (e) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      try {
        setLoadingSuggestions(true);
        const res = await axios.get(`/api/products/search?q=${searchTerm.trim()}`);
        if (Array.isArray(res.data)) {
          setSuggestions(res.data);
        } else {
          setSuggestions([]);
        }
      } catch (err) {
        console.error("Search API error:", err);
        setSuggestions([]);
      } finally {
        setLoadingSuggestions(false);
      }

      // Navigate to the search results page
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      // Clear suggestions when Enter is not pressed
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (productId) => {
    setSearchTerm("");
    setSuggestions([]);
    navigate(`/product/${productId}`);
  };

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSuggestions([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Cart count
  useEffect(() => {
    const updateCartCount = () => {
      const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
      const totalItems = storedCart.reduce((sum, item) => sum + (item.quantity || 1), 0);
      setCartCount(totalItems);
    };

    updateCartCount();
    window.addEventListener("cartUpdated", updateCartCount);
    window.addEventListener("storage", updateCartCount);

    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
      window.removeEventListener("storage", updateCartCount);
    };
  }, []);

  // Auth state
  useEffect(() => {
    const getStoredUser = () => {
      try {
        const stored = localStorage.getItem("authUser");
        const parsed = stored ? JSON.parse(stored) : null;
        if (parsed && parsed.role && parsed.token) {
          return parsed;
        }
        return null;
      } catch {
        return null;
      }
    };

    setUser(getStoredUser());

    const handleUserChange = () => {
      setUser(getStoredUser());
    };

    window.addEventListener("userLoggedIn", handleUserChange);
    window.addEventListener("userLoggedOut", handleUserChange);

    return () => {
      window.removeEventListener("userLoggedIn", handleUserChange);
      window.removeEventListener("userLoggedOut", handleUserChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authUser");
    setUser(null);
    window.dispatchEvent(new Event("userLoggedOut"));
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-md fixed w-full top-0 left-0 z-50">
      <div className="flex items-center justify-between p-4 mx-auto w-full relative">
        <Link to="/">
          <img src="/logo1.png" alt="NPFurnish Logo" className="h-12 w-auto" />
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex space-x-6 items-center">
          <Link to="/" className="text-gray-700 hover:text-blue-500">Home</Link>
          <Link to="/furniture" className="text-gray-700 hover:text-blue-500">Furniture</Link>
          <Link to="/aboutsection" className="text-gray-700 hover:text-blue-500">About</Link>
          <Link to="/contact" className="text-gray-700 hover:text-blue-500">Contact</Link>
        </nav>

        {/* Search bar */}
        <div className="hidden md:flex flex-col relative w-96" ref={searchRef}>
          <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 bg-white">
            <Search className="text-gray-500" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search furniture..."
              className="w-full ml-2 focus:outline-none"
            />
          </div>

          {suggestions.length > 0 && (
            <ul className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-60 overflow-y-auto z-50 shadow-lg">
              {loadingSuggestions ? (
                <li className="p-2 text-gray-500 text-sm">Searching...</li>
              ) : (
                suggestions.map((product) => (
                  <li
                    key={product._id}
                    onClick={() => handleSuggestionClick(product._id)}
                    className="p-2 cursor-pointer hover:bg-gray-100"
                  >
                    {product.name}
                  </li>
                ))
              )}
            </ul>
          )}
        </div>

        {/* Icons */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/wishlist">
            <Heart className="text-gray-700 hover:text-red-500" size={28} />
          </Link>

          <div className="relative">
            <Link to="/cart">
              <ShoppingCart className="text-gray-700 hover:text-blue-500" size={28} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          <Link to="/profile">
            <User className="text-gray-700 hover:text-green-500" size={28} />
          </Link>

          {user ? (
            <button
              onClick={handleLogout}
              className="ml-4 px-4 py-2 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition-all"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="ml-4 px-5 py-1.5 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-full shadow-md transition duration-200"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="ml-2 px-5 py-1.5 text-sm font-medium text-blue-500 border border-blue-500 hover:bg-blue-50 rounded-full shadow-sm transition duration-200"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Hamburger menu (mobile) */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-gray-700">
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>
    </header>
  );
}
