import { createContext, useContext, useEffect, useState } from "react";
import { loginApi, logoutApi, getMeApi } from "../Api/auth.api.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    // Only attempt to fetch profile if we think the user is logged in
    const isLoggedIn = localStorage.getItem("taskdeck_logged_in") === "true";
    if (!isLoggedIn) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await getMeApi();
      setUser(res.data.data);
    } catch (error) {
      setUser(null);
      // If the request fails, clear the local flag
      localStorage.removeItem("taskdeck_logged_in");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      checkAuth();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async ({ email, password }) => {
    try {
      const res = await loginApi({ email, password });
      setUser(res.data.data.user);
      localStorage.setItem("taskdeck_logged_in", "true");
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutApi();
    } finally {
      setUser(null);
      localStorage.removeItem("taskdeck_logged_in");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);