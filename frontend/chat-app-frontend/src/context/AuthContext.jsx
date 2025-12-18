import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const API_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:4000";

  useEffect(() => {
    getCurrentUser();
  }, []);

  const getCurrentUser = async () => {
    try {
      const res = await axios.get(`${API_URL}/auth/me`, {
        withCredentials: true,
      });

      setUser(res.data);

      if (res.data) {
        toast.success(`Welcome back, ${res.data.username}!`);
      }

    } catch (error) {
      setUser(null);
      toast.error("You are not logged in. Please login to continue.");
    } finally {
      setIsLoading(false);
    }
  };

  const login = (userData) => {
    setUser(userData);
    toast.success(`Login successful! Welcome, back`);
  };

  const logout = async () => {
    try {
      await axios.post(`${API_URL}/auth/logout`, {}, {
        withCredentials: true,
      });
      toast.success("You have been logged out successfully.");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed. Please try again.");
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{user, login, logout, isLoading  }}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  return useContext(AuthContext);
};
