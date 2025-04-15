import { Routes, Route, Outlet } from "react-router-dom";
import Header from "./components/Header";
import Home from "./components/Home";
import Contact from "./components/Contact";
import AboutSection from "./components/AboutSection";
import Login from "./pages/Login/Login";
import SignUp from "./components/SignUp";
import Profile from "./components/Profile";
import EditProfile from "./components/EditProfile";
import Wishlist from "./components/Wishlist";
import Cart from "./components/Cart";
import VerifyEmail from "./components/VerifyEmail";
import ForgotPassword from "./components/ForgotPassword";
import FurniturePage from "./components/FurniturePage";
import NotFound from "./components/NotFound";
import Products from "./components/Products";
import Settings from "./components/Settings";
import ProductDetails from "./components/ProductDetails";
import FeaturedProducts from "./components/FeaturedProducts";
import SearchResults from "./components/SearchResults";
import AdminDashboard from "./admin/AdminDashboard";
import ProviderDashboard from "./provider/ProviderDashboard";
import Checkout from "./components/Checkout";
import OrderSuccess from "./components/OrderSuccess";
import MyOrders from "./components/MyOrders";
import CancellationRefund from "./components/CancellationRefund";
import ShippingDelivery from "./components/ShippingDelivery";

const MainRoutes = () => (
  <Routes>
    {/* Routes without Header */}
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<SignUp />} />

    {/* Admin and Provider Routes */}
    <Route path="/admin" element={<AdminDashboard />} />
    <Route path="/provider" element={<ProviderDashboard />} />

    {/* Routes with Header */}
    <Route element={<HeaderLayout />}>
      <Route path="/" element={<Home />} />
      <Route path="/aboutsection" element={<AboutSection />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/editprofile" element={<EditProfile />} />
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/verifyemail" element={<VerifyEmail />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/products/:category" element={<Products />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/furniture" element={<FurniturePage />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/featuredproducts" element={<FeaturedProducts />} />
      <Route path="/search" element={<SearchResults />} />
      <Route path="/orders" element={<MyOrders />} />
      <Route path="/cancellation-refund" element={<CancellationRefund />} />
      <Route path="/shipping-delivery" element={<ShippingDelivery />} />
      <Route path="/checkout" element={<Checkout />} />
<Route path="/order-success" element={<OrderSuccess />} />
    </Route>

    {/* 404 Page */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);


// A layout wrapper for pages that include the header
const HeaderLayout = () => (
  <>
    <Header />
    <Outlet /> {/* Renders the matched route inside the layout */}
  </>
);

export default MainRoutes;
