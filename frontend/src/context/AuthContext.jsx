import { createContext, useContext, useEffect, useState } from "react";
import { authApi } from "../api/services";
import { clearDemoSession } from "../api/demoStore";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadMe = async () => {
    const token = localStorage.getItem("mp_token");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const data = await authApi.me();
      setUser(data.user);
    } catch (error) {
      localStorage.removeItem("mp_token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMe();
  }, []);

  const login = async (payload) => {
    const data = await authApi.login(payload);
    localStorage.setItem("mp_token", data.token);
    setUser(data.user);
    return data;
  };

  const register = async (payload) => {
    const data = await authApi.register(payload);
    localStorage.setItem("mp_token", data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("mp_token");
    clearDemoSession();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        reload: loadMe
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
