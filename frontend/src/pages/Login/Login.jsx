import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../pages/Login/AuthContext"; // Adjust path if needed

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
  
    if (!email || !password) {
      setError("Please enter both email and password.");
      setLoading(false);
      return;
    }
  
    if (!isValidEmail(email)) {
      setError("Please enter a valid email.");
      setLoading(false);
      return;
    }
  
    try {
      const response = await login(email, password);
      console.log("Login Response:", response);
  
      if (response && response.success) {
        setSuccess("Login successful! Redirecting...");
        
        // ✅ Save token to localStorage
        if (response.data?.accessToken) {
          localStorage.setItem("accessToken", response.data.accessToken);

        } else {
          console.warn("Access token not found in response.");
        }
        
      
        const userRole = response.data?.user?.role?.toLowerCase();
     console.log("User Role:", userRole);

switch (userRole) {
  case "admin":
    navigate("/admin");
    break;
  case "provider":
    navigate("/provider");
    break;
  case "customer":
    navigate("/");
    break;
  default:
    navigate("/"); // fallback if role is undefined or unrecognized
    break;
}
      }
       else {
        setError(response?.message || "Invalid email or password.");
      }
    } catch (err) {
      console.error("Login Error:", err.response?.data?.message || err.message || err);
      setError("An error occurred while logging in. Please try again.");
    }
  
    setLoading(false);
    
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>

        {(error || success) && (
          <div className="mb-4 min-h-[1.5rem] text-center">
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              aria-label="Email"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              aria-label="Password"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="text-center mb-4">
            <Link to="/forgot-password" className="text-sm text-blue-500 hover:underline">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full text-white py-2 px-4 rounded-lg bg-blue-500 hover:bg-blue-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Don&apos;t have an account?
          <Link to="/signup" className="text-blue-500 font-semibold hover:underline"> Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
