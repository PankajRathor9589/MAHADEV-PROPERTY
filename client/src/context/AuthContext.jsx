import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { fetchMe, loginUser, registerUser } from "../services/api.js";

const AuthContext = createContext(null);

const TOKEN_KEY = "mahadev_token";
const USER_KEY = "mahadev_user";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || "");
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw);
    } catch (error) {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  }, [user]);

  useEffect(() => {
    const syncUser = async () => {
      if (!token) {
        return;
      }

      try {
        const profile = await fetchMe();
        setUser(profile);
      } catch (error) {
        setToken("");
        setUser(null);
      }
    };

    syncUser();
  }, [token]);

  const login = async (payload) => {
    setLoading(true);
    try {
      const response = await loginUser(payload);
      setToken(response.token);
      setUser(response.user);
      return response.user;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      const response = await registerUser(payload);
      setToken(response.token);
      setUser(response.user);
      return response.user;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken("");
    setUser(null);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      isAuthenticated: Boolean(token && user),
      isAdmin: user?.role === "admin",
      isSeller: user?.role === "seller",
      login,
      register,
      logout
    }),
    [token, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
