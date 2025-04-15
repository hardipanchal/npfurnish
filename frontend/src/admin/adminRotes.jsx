// src/admin/AdminRoutes.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../pages/Login/AuthContext";
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import AdminDashboard from './AdminDashboard';
import ProductTable from './Products/ProductDetail';
import CategoryTable from './Categories/CategoryDetail';
import OrderTable from './Orders/OrderTable';
import OrderDetail from './Orders/OrderDetail';
import AddProvider from './Provider/AddProvider';
import Provider from './Provider';
import AdminProfile from './AdminProfile';
import { Routes, Route } from 'react-router-dom';
import AssignOrder from "./Orders/AssignOrder";
// ✅ Correct import — adjust path as needed
import Users from './Users'; 


const AdminRoutes = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user?.role !== "admin") {
      navigate("/login");
    }
  }, [user, loading]);

  if (loading || !user || user.role !== "admin") {
    return <div>Loading...</div>; // Optional: Replace with Spinner
  }

  return (
    <>
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <div className="flex-grow p-4">
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/products" element={<ProductTable />} />
            <Route path="/categories" element={<CategoryTable />} />
            <Route path="/orders" element={<OrderTable />} />
            <Route path="/orders/:id" element={<OrderDetail />} />
            <Route path="/add-provider" element={<AddProvider />} />
            <Route path="/provider" element={<Provider />} />
            <Route path="profile" element={<AdminProfile />} />
            <Route path="assign-provider" element={<AssignOrder />} />
            <Route path="/users" element={<Users />} />

          </Routes>
        </div>
      </div>
    </>
  );
};

export default AdminRoutes;
