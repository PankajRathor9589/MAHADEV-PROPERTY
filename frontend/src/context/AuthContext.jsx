import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authApi } from "../api/services";

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
      const { data } = await authApi.me();
      setUser(data.user);
    } catch {
      localStorage.removeItem("mp_token");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMe();
  }, []);

  const login = async (payload) => {
    const { data } = await authApi.login(payload);
    localStorage.setItem("mp_token", data.token);
    setUser(data.user);
    return data;
  };

  const signup = async (payload) => {
    const { data } = await authApi.signup(payload);
    localStorage.setItem("mp_token", data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("mp_token");
    setUser(null);
  };

  const value = useMemo(() => ({ user, loading, login, signup, logout, reload: loadMe }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
