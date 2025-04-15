import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainRoutes from "./MainRoutes";
import ProviderRoutes from "./provider/ProviderRoutes";
import Login from "./pages/Login/Login";
import { useAuth } from "./pages/Login/AuthContext";
import SetProviderPassword from "./provider/SetPassword";
import AdminRoutes from "./admin/adminRotes";

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* Publicly accessible routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/provider/set-password/:token" element={<SetProviderPassword />} />

        {/* Protected routes */}
        {user?.role === "admin" && (
          <Route path="/admin/*" element={<AdminRoutes />} />
        )}

        {user?.role === "provider" && (
          <Route path="/provider/*" element={<ProviderRoutes />} />
        )}

        {/* Catch-all public routes */}
        <Route path="/*" element={<MainRoutes />} />
      </Routes>
    </Router>
  );
}

export default App;
