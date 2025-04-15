import { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import AddCategoryForm from "./AddCategoryForm"; // Import the AddCategoryForm component

const CategoryTable = () => {
  const [categories, setCategories] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editedCategory, setEditedCategory] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
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

    fetchCategories();
  }, []);

  // Handle Edit category
  const handleEdit = (category) => {
    setEditId(category._id);
    setEditedCategory({ ...category });
  };

  // Handle Save edited category
  const handleSave = async () => {
    if (!editedCategory.typeName.trim()) {
      alert("Category name cannot be empty!");
      return;
    }

    try {
      await axios.put(`http://localhost:8000/api/category/${editId}`, editedCategory);
      setCategories((prev) =>
        prev.map((cat) =>
          cat._id === editId ? { ...cat, typeName: editedCategory.typeName } : cat
        )
      );
      setEditId(null);
      setEditedCategory({});
    } catch (error) {
      setError(`Error updating category: ${error.message}`);
    }
  };

  // Handle Delete category
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      await axios.delete(`http://localhost:8000/api/category/${id}`);
      setCategories((prev) => prev.filter((cat) => cat._id !== id));
    } catch (error) {
      setError(`Error deleting category: ${error.message}`);
    }
  };

  // Handle Add category
  const handleAddCategory = async (newCategory) => {
    try {
      // Add the new category to the backend
      const response = await axios.post("http://localhost:8000/api/category", newCategory);
      // Add the new category to the state immediately
      setCategories((prev) => [...prev, response.data]);
      setShowAddForm(false); // Close the Add Category form
    } catch (error) {
      setError(`Failed to add category: ${error.message}`);
    }
  };

  return (
    <div className="table-container">
      <h2 className="text-2xl font-bold mb-4">Manage Categories</h2>

      {/* Display loading or error message */}
      {loading && <p className="text-blue-500">Loading categories...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Add Category Button */}
      <button
        onClick={() => setShowAddForm(!showAddForm)}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {showAddForm ? "Close Add Category Form" : "Add New Category"}
      </button>

      {/* Add Category Form */}
      {showAddForm && <AddCategoryForm onSubmit={handleAddCategory} />}

      {/* Category Table */}
      {!showAddForm && (
        <table className="category-table">
          <thead>
            <tr>
              <th className="border px-4 py-2">Category Name</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 ? (
              categories.map((category) => (
                <tr key={category._id}>
                  {editId === category._id ? (
                    <>
                      <td className="border px-4 py-2">
                        <input
                          value={editedCategory.typeName || ""}
                          onChange={(e) =>
                            setEditedCategory({
                              ...editedCategory,
                              typeName: e.target.value,
                            })
                          }
                          className="border p-2 w-full"
                        />
                      </td>
                      <td className="border px-4 py-2">
                        <button onClick={handleSave} className="bg-green-500 text-white px-3 py-1 rounded mr-2">
                          Save
                        </button>
                        <button onClick={() => setEditId(null)} className="bg-gray-500 text-white px-3 py-1 rounded">
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="border px-4 py-2">{category.typeName}</td>
                      <td className="border px-4 py-2">
                        <button onClick={() => handleEdit(category)} className="mr-2 text-blue-500">
                          <FaEdit />
                        </button>
                        <button onClick={() => handleDelete(category._id)} className="text-red-500">
                          <FaTrash />
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="text-center text-gray-500">No categories available</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CategoryTable;
