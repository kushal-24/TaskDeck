import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import {loginApi, logoutApi, getMeApi} from "../Api/auth.api.js"
const AuthContext = createContext(null); //esse ek storage box bana diya hai maine

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const res = await getMeApi()
      setUser(res.data.data.user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    await logoutApi()
    setUser(null);
  };

  return (
    <AuthContext.Provider //Everything inside {children} can access: these values without props
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

// 6️⃣ Custom hook
export const useAuth = () => useContext(AuthContext);