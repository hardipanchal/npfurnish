import { useState, useEffect } from "react";
import axios from "axios";

const Categories = () => {
  //const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/category");
      setCategories(response.data);
    } catch (error) {
      setError(`Failed to fetch categories: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return alert("Category name is required");

    try {
      setAdding(true);
      const response = await axios.post("http://localhost:8000/api/category", {
        typeName: newCategory,
      });

      setCategories([...categories, response.data]); // Add new category to state
      setNewCategory("");
      // navigate('/admin/categories');
      // Reset input
    } catch (error) {
      alert(`Failed to add category: ${error.response?.data?.message || error.message}`);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Manage Categories</h2>

      {loading && <p className="text-blue-500">Loading categories...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Add Category Form */}
      <form onSubmit={handleAddCategory} className="mb-4">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="Enter category name"
          className="border p-2 rounded w-full mb-2"
        />
        <button
          type="submit"
          disabled={adding}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          {adding ? "Adding..." : "Add Category"}
        </button>
      </form>
    </div>
  );
};

export default Categories;
