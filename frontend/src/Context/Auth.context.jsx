import { createContext, useContext, useEffect, useState } from "react";
import {loginApi, logoutApi, getMeApi} from "../Api/auth.api.js"

const AuthContext = createContext(null); //esse ek storage box bana diya hai maine

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const res = await getMeApi()
      setUser(res.data.data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login= async({email,password})=>{
    try {
      const res= await loginApi({email,password});
      console.log("LOGIN RESPONSE USER:", res.data.data.user);
      setUser(res.data.data.user);
      console.log(user);
    } catch (error) {
      console.log("error in logging in :", error.response?.data?.message);
    }
  }

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