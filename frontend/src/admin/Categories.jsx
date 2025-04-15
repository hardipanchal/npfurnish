import { useState, useEffect } from "react";
import axios from "axios";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState(null); // Track the category being edited

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/category");
        console.log(response.data);  // Log the response to check the data
        setCategories(response.data);
      } catch (error) {
        setError(`Failed to fetch categories: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Add a new category
  const handleAddCategory = async () => {
    if (!newCategoryName) {
      setError("Category name is required");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/api/category", {
        typeName: newCategoryName,
      });
      setCategories([...categories, response.data]); // Add new category to state
      setNewCategoryName(""); // Clear input field
    } catch (error) {
      setError(`Failed to add category: ${error.message}`);
    }
  };

  // Edit category
  const handleEditCategory = async () => {
    if (!editingCategory.typeName) {
      setError("Category name is required");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:8000/api/category/${editingCategory._id}`,
        {
          typeName: editingCategory.typeName,
        }
      );
      setCategories(
        categories.map((category) =>
          category._id === editingCategory._id ? response.data : category
        )
      );
      setEditingCategory(null); // Reset editing state
    } catch (error) {
      setError(`Failed to edit category: ${error.message}`);
    }
  };

  // Delete category
  const handleDeleteCategory = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/category/${id}`);
      setCategories(categories.filter((category) => category._id !== id));
    } catch (error) {
      setError(`Failed to delete category: ${error.message}`);
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Manage Categories</h2>

      {loading && <p className="text-blue-500">Loading categories...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Add Category Form */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="New Category Name"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          className="p-2 border rounded-lg w-72"
        />
        <button
          onClick={handleAddCategory}
          className="ml-2 p-2 bg-blue-500 text-white rounded-lg"
        >
          Add Category
        </button>
      </div>

      {/* Category Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="px-4 py-2 text-left">Category Name</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan="2" className="text-center py-4">
                  No categories found
                </td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr key={category._id} className="border-b">
                  <td className="px-4 py-2">
                    {editingCategory?._id === category._id ? (
                      <input
                        type="text"
                        value={editingCategory.typeName}
                        onChange={(e) =>
                          setEditingCategory({
                            ...editingCategory,
                            typeName: e.target.value,
                          })
                        }
                        className="p-2 border rounded-lg"
                      />
                    ) : (
                      category.typeName
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {editingCategory?._id === category._id ? (
                      <button
                        onClick={handleEditCategory}
                        className="text-green-500 hover:underline mr-2"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => setEditingCategory(category)}
                        className="text-blue-500 hover:underline mr-2"
                      >
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteCategory(category._id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Categories;
