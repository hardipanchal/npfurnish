import { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ import navigate
import axios from "axios";

const AddProvider = () => {
  const navigate = useNavigate(); // ✅ initialize navigate

  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setMessageType("");
    setLoading(true);

    const { name, email, phone } = formData;
    if (!name || !email || !phone) {
      setMessage("All fields are required.");
      setMessageType("error");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");

      const res = await axios.post(
        "http://localhost:8000/api/admin/add-provider",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(res.data.msg || "Provider added successfully.");
      setMessageType("success");
      setFormData({ name: "", email: "", phone: "" });

      // ✅ Redirect to provider page after 2 seconds
      setTimeout(() => {
        navigate("/admin/provider"); // Change to your actual route
      }, 2000);
    } catch (err) {
      setMessage(
        err.response?.data?.msg || err.message || "Something went wrong."
      );
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 shadow-md rounded-2xl mt-10">
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
        Add New Provider
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Provider Name"
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Provider Email"
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Phone Number"
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <button
          type="submit"
          className={`w-full py-2 rounded-xl text-white transition ${
            loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Provider"}
        </button>
        {message && (
          <p
            className={`text-center text-sm mt-2 ${
              messageType === "error" ? "text-red-600" : "text-green-600"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default AddProvider;
