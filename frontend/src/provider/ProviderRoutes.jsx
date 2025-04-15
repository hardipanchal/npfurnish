import { Routes, Route } from "react-router-dom";
import ProviderLayout from "./ProviderLayout";
import ProviderDashboard from "./ProviderDashboard";
import ProviderProfile from "./ProviderProfile";
import SetPassword from "./SetPassword";
import ProviderAssignedOrders from "./ProviderAssignedOrders";

const ProviderRoutes = () => {
  return (
    <Routes>
      {/* 🔓 Public route for setting password */}
      <Route path="/provider/set-password/:token" element={<SetPassword />} />

      {/* 🔐 Protected routes with layout */}
      <Route path="/" element={<ProviderLayout />}>
        <Route index element={<ProviderDashboard />} />
        <Route path="profile" element={<ProviderProfile />} />
        <Route path="assigned-orders" element={<ProviderAssignedOrders />} />

      </Route>
    </Routes>
  );
};

export default ProviderRoutes;
