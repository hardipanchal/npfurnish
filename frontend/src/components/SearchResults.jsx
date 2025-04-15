// components/SearchResults.jsx

import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search).get("q")?.trim() || "";

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchSearchResults = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:8000/api/products/search?q=${query}`);
        console.log("🔍 Search results:", res.data);
        setResults(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching search results:", err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchSearchResults();
    }
  }, [query]);

  return (
    <div className="container mx-auto px-4 py-16 mt-24">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Search Results for: &quot;{query}&quot;
      </h2>

      {loading ? (
        <div className="text-center text-gray-500 text-lg">Loading...</div>
      ) : results.length === 0 ? (
        <div className="text-center text-gray-500 text-lg">
          No results found for &quot;{query}&quot;
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {results.map((product) => (
            <div
              key={product._id}
              onClick={() => navigate(`/product/${product._id}`)}
              className="cursor-pointer bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-300"
            >
              <img
                src={product.image || "/fallback.jpg"}
                alt={product.name}
                onError={(e) => (e.target.src = "/fallback.jpg")}
                className="h-48 w-full object-cover mb-4 rounded"
              />
              <h3 className="text-xl font-semibold">{product.name}</h3>
              <p className="text-gray-600">
                {new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                }).format(product.price)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
