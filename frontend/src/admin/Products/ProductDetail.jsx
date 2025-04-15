import { useState, useEffect } from "react";
import axios from "axios";
import "./ProductTable.css";
import { FaEdit, FaTrash } from "react-icons/fa";
import AddProductForm from "./AddProductForm";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editedProduct, setEditedProduct] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/products`)
      .then((response) => {
        console.log("Products Data:", response.data);
        setProducts(response.data);
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/category`)
      .then((response) => setCategories(response.data))
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  const handleEdit = (product) => {
    setEditId(product._id);
    setEditedProduct({
      ...product,
      category: product.category?._id || product.typeId?._id || "",
      quantity: product.quantity ?? 0,
    });
  };

  const handleSave = async () => {
    // if (
    //   !editedProduct.name ||
    //   !editedProduct.category ||
    //   !editedProduct.description ||
    //   !editedProduct.price ||
    //   editedProduct.quantity === undefined
    // ) {
    //   alert("All fields are required!");
    //   return;
    // }

    const formData = new FormData();
    formData.append("name", editedProduct.name);
    formData.append("typeId", editedProduct.category);
    formData.append("description", editedProduct.description);
    formData.append("price", editedProduct.price);
    formData.append("quantity", editedProduct.quantity);
    formData.append("inStock", editedProduct.inStock ? "true" : "false");

    if (editedProduct.image instanceof File) {
      formData.append("image", editedProduct.image);
    }

    try {
      await axios.put(`${API_BASE_URL}/api/products/${editId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setProducts((prev) =>
        prev.map((prod) =>
          prod._id === editId ? { ...prod, ...editedProduct } : prod
        )
      );
      setEditId(null);
      setEditedProduct(null);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update product!");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      await axios.delete(`${API_BASE_URL}/api/products/${id}`);
      setProducts((prev) => prev.filter((prod) => prod._id !== id));
    } catch (error) {
      alert(
        "Error deleting product: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  return (
    <div className="table-container">
      <button
        onClick={() => setShowAddForm(!showAddForm)}
        className="mb-4 bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
      >
        {showAddForm ? "Close Add Product Form" : "Add New Product"}
      </button>
      <table className="product-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Description</th>
            <th>Image</th>
            <th>Price</th>
            <th>Quantity</th> {/* New column */}
            <th>In Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr
              key={product._id}
              className={index % 2 === 0 ? "even-row" : "odd-row"}
            >
              {editId === product._id ? (
                <>
                  <td>
                    <input
                      value={editedProduct.name}
                      onChange={(e) =>
                        setEditedProduct({
                          ...editedProduct,
                          name: e.target.value,
                        })
                      }
                    />
                  </td>
                  <td>
                    <select
                      value={editedProduct.category || ""}
                      onChange={(e) =>
                        setEditedProduct({
                          ...editedProduct,
                          category: e.target.value,
                        })
                      }
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input
                      value={editedProduct.description}
                      onChange={(e) =>
                        setEditedProduct({
                          ...editedProduct,
                          description: e.target.value,
                        })
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="file"
                      onChange={(e) =>
                        setEditedProduct({
                          ...editedProduct,
                          image: e.target.files[0],
                        })
                      }
                    />
                    {editedProduct.image instanceof File ? (
                      <img
                        src={URL.createObjectURL(editedProduct.image)}
                        alt="Preview"
                        width="50"
                      />
                    ) : (
                      <img src={editedProduct.image} alt="Product" width="50" />
                    )}
                  </td>
                  <td>
                    <input
                      type="number"
                      value={editedProduct.price}
                      onChange={(e) =>
                        setEditedProduct({
                          ...editedProduct,
                          price: parseFloat(e.target.value),
                        })
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={editedProduct.quantity}
                      onChange={(e) =>
                        setEditedProduct({
                          ...editedProduct,
                          quantity: parseInt(e.target.value),
                        })
                      }
                      min="0"
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={editedProduct.inStock}
                      onChange={(e) =>
                        setEditedProduct({
                          ...editedProduct,
                          inStock: e.target.checked,
                        })
                      }
                    />
                  </td>
                  <td>
                    <button
                      onClick={handleSave}
                      className="bg-green-500 p-1 rounded text-white"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditId(null)}
                      className="bg-gray-500 p-1 rounded text-white"
                    >
                      Cancel
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>{product.description}</td>
                  <td>
                    <img
                      src={
                        product.image?.startsWith("http")
                          ? product.image
                          : `${API_BASE_URL}/images/${product.image}`
                      }
                      alt={product.name}
                      width="50"
                      onError={(e) => (e.target.src = "/default-image.jpg")}
                    />
                  </td>
                  <td>${product.price}</td>
                  <td>{product.quantity ?? "N/A"}</td>
                  <td>{product.inStock ? "Yes" : "No"}</td>
                  <td>
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-blue-500"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="text-red-500"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {showAddForm && <AddProductForm />}
    </div>
  );
};

export default ProductTable;
