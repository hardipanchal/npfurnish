import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CategoriesSection = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const bgColors = [
    "bg-blue-200",
    "bg-green-200",
    "bg-yellow-200",
    "bg-purple-200",
    "bg-orange-200",
    "bg-emerald-200",
    "bg-indigo-200",
    "bg-pink-200",

  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/category", {
          timeout: 5000,
        });
        setCategories(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error("❌ Error fetching categories:", err);
        setError("Failed to load categories. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="py-12 bg-gray-100 mt-8">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Browse Categories
      </h2>

      {loading && <p className="text-center">Loading categories...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {categories.length > 0 ? (
            categories.map((category, index) => {
              const bgColor = bgColors[index % bgColors.length];
              return (
                <div
                  key={category._id}
                  className={`p-6 rounded-2xl shadow-lg text-center hover:scale-105 cursor-pointer transition-transform duration-200 ${bgColor}`}
                  onClick={() => {
                    if (category.typeName) {
                      navigate(`/products/${category.typeName}`);
                    } else {
                      console.warn("⚠️ Category typeName is missing:", category);
                    }
                  }}
                >
                  <h3 className="text-xl font-semibold text-gray-800">
                    {category.typeName || "Unnamed Category"}
                  </h3>
                </div>
              );
            })
          ) : (
            !loading && <p className="text-center">No categories available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoriesSection;
