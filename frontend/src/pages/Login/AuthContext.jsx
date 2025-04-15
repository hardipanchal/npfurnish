import { createContext, useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import axios from "axios";

// ✅ Create the context
export const AuthContext = createContext();

// ✅ Helper to get role from current path (or fallback)
const getRoleFromPath = () => {
  if (window.location.pathname.startsWith("/admin")) return "admin";
  if (window.location.pathname.startsWith("/provider")) return "provider";
  return "customer";
};

// ✅ AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const role = getRoleFromPath();

  useEffect(() => {
    const checkUser = () => {
      const accessToken = localStorage.getItem(`accessToken_${role}`);
      const refreshToken = localStorage.getItem(`refreshToken_${role}`);
      const storedAuthUser = localStorage.getItem(`authUser_${role}`);

      if (accessToken && refreshToken && storedAuthUser) {
        try {
          const parsedUser = JSON.parse(storedAuthUser);
          setUser(parsedUser);
        } catch (error) {
          console.error("Error parsing authUser:", error);
          localStorage.removeItem(`authUser_${role}`);
        }
      }

      setLoading(false);
    };

    checkUser();
  }, [role]);

  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem(`refreshToken_${role}`);
      if (refreshToken) {
        const response = await axios.post("http://localhost:8000/api/user/refresh-token", { refreshToken });
        if (response.data.success && response.data.data.accessToken) {
          localStorage.setItem(`accessToken_${role}`, response.data.data.accessToken);
          return response.data.data.accessToken;
        }
      }
    } catch (error) {
      console.error("Error refreshing access token:", error);
      logout();
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/user/login",
        { email, password },
        { withCredentials: true }
      );

      if (response.data.success && response.data.data) {
        const { accessToken, refreshToken, user } = response.data.data;

        localStorage.setItem(`accessToken_${user.role}`, accessToken);
        localStorage.setItem(`refreshToken_${user.role}`, refreshToken);
        localStorage.setItem(`authUser_${user.role}`, JSON.stringify(user));

        setUser(user);
        return { success: true, message: "Login successful!", data: response.data.data };
      } else {
        return { success: false, message: response.data.message || "Invalid credentials." };
      }
    } catch (err) {
      console.error("Login API Error:", err);
      return { success: false, message: err.response?.data?.message || "Login failed." };
    }
  };

  const logout = () => {
    localStorage.removeItem(`accessToken_${role}`);
    localStorage.removeItem(`refreshToken_${role}`);
    localStorage.removeItem(`authUser_${role}`);
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
