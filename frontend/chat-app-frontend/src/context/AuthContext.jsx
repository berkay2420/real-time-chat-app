import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getCurrentUser();
  }, []);

  const getCurrentUser = async () => {
    try {
      const res = await axios.get("http://localhost:4000/auth/me", {
        withCredentials: true,
      });
      setUser(res.data);
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await axios.post("http://localhost:4000/auth/logout", {}, {
        withCredentials: true,
      });
    } catch (error) {
      console.error("Logout error:", error);
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
