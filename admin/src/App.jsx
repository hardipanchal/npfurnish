import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/AdminHeader";
import ProductDetail from "./pages/Products/ProductDetail";
import OrderTable from "./pages/Orders/OrderTable";

// import Dashboard from "./pages/Dashboard";
// import Orders from "./pages/Orders";
// import Products from "./pages/Products";
// import Users from "./pages/Users";

function App() {
  return (
    <Router>
      <Header/>

      <div className="flex">
        
        <Sidebar />
        <div className="flex-1 p-5">
          <Routes>
            {/* <Route path="/" element={<Dashboard />} /> */
            <Route path="/orders" element={<OrderTable />} />}
            <Route path="/products" element={<ProductDetail />} />
            {/* <Route path="/users" element={<Users />} /> */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
