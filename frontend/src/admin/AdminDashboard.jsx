import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-gray-700">Admin Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
        {/* Orders Card */}
        <Link
          to="/admin/orders"
          className="p-6 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition"
        >
          <h3 className="text-xl font-semibold">Orders</h3>
          <p>Manage and track orders</p>
        </Link>

        {/* Products Card */}
        <Link
          to="/admin/products"
          className="p-6 bg-green-500 text-white rounded-lg shadow-lg hover:bg-green-600 transition"
        >
          <h3 className="text-xl font-semibold">Products</h3>
          <p>Manage your products</p>
        </Link>

        {/* Categories Card */}
        <Link
          to="/admin/categories"
          className="p-6 bg-yellow-500 text-white rounded-lg shadow-lg hover:bg-yellow-600 transition"
        >
          <h3 className="text-xl font-semibold">Categories</h3>
          <p>Manage product categories</p>
        </Link>

        {/* Users Card */}
        {/* Providers Card */}
        <Link
          to="/admin/provider"
          className="p-6 bg-purple-500 text-white rounded-lg shadow-lg hover:bg-purple-600 transition"
        >
          <h3 className="text-xl font-semibold">Providers</h3>
          <p>Manage provider accounts</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
