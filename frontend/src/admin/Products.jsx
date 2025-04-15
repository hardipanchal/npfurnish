import { useState, useEffect } from "react";
import axios from "axios";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState({});
  const [loading, setLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [error, setError] = useState("");
  const [categoryError, setCategoryError] = useState("");

  // Fetch Products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/products");
        console.log("Fetched Products:", response.data);
        setProducts(response.data);
      } catch (err) {
        setError(`Failed to fetch products: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/category");
        const categoryMap = response.data.reduce((acc, cat) => {
          acc[cat._id] = cat.name; // Ensure 'name' matches category name field
          return acc;
        }, {});
        
        setCategories(categoryMap);
      } catch (err) {
        setCategoryError(`Failed to fetch categories: ${err.message}`);
      } finally {
        setCategoryLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Delete Product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await axios.delete(`http://localhost:8000/api/products/${id}`);
      setProducts((prev) => prev.filter((prod) => prod._id !== id));
    } catch (error) {
      alert("Error deleting product: " + error.message);
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Manage Products</h2>

      {loading && <p className="text-blue-500">Loading products...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {categoryLoading && <p className="text-blue-500">Loading categories...</p>}
      {categoryError && <p className="text-red-500">{categoryError}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Price</th>
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product, index) => (
                <tr key={product._id || index} className="border-b">
                  <td className="px-4 py-2">{product.name}</td>
                  <td className="px-4 py-2">{product.price ? `$${product.price}` : "Not Available"}</td>
                  <td className="px-4 py-2">{categories[product.typeId] ? categories[product.typeId] : "Unknown"}</td>

                  <td className="px-4 py-2">
                    <button className="text-blue-500 hover:underline mr-2">Edit</button>
                    <button onClick={() => handleDelete(product._id)} className="text-red-500 hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center text-gray-500 p-4">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;
