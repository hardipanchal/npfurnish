import axios from "axios";

const API = import.meta.env.VITE_API_URL; // Vite environment variable

// Fetch products from the backend
export const fetchProducts = async () => {
  try {
    const response = await axios.get(`${API}/products`);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

// Register user function (used in Signup.jsx)
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API}/users/signup`, userData);
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    return null;
  }
};
