import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authApi } from "../api/services";
import { clearDemoSession } from "../api/demoStore";

const AuthContext = createContext(null);
const TOKEN_KEY = "mp_token";

const parseJwtPayload = (token) => {
  try {
    const [, payload] = String(token || "").split(".");
    if (!payload) {
      return null;
    }

    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padding = normalized.length % 4 ? "=".repeat(4 - (normalized.length % 4)) : "";
    return JSON.parse(window.atob(`${normalized}${padding}`));
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || "");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(localStorage.getItem(TOKEN_KEY)));

  const clearSession = () => {
    localStorage.removeItem(TOKEN_KEY);
    clearDemoSession();
    setToken("");
    setUser(null);
    setLoading(false);
  };

  const loadMe = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const data = await authApi.me();
      setUser(data.user);
    } catch {
      clearSession();
      return;
    }

    setLoading(false);
  };

  useEffect(() => {
    loadMe();
  }, [token]);

  useEffect(() => {
    if (!token) {
      return undefined;
    }

    const payload = parseJwtPayload(token);
    const expiresAt = Number(payload?.exp || 0) * 1000;

    if (!expiresAt) {
      return undefined;
    }

    const remainingMs = expiresAt - Date.now();

    if (remainingMs <= 0) {
      clearSession();
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      clearSession();
    }, remainingMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [token]);

  const persistSession = (data) => {
    localStorage.setItem(TOKEN_KEY, data.token);
    setToken(data.token);
    setUser(data.user);
    setLoading(false);
    return data;
  };

  const login = async (payload) => persistSession(await authApi.login(payload));
  const loginAdmin = async (adminKey) => persistSession(await authApi.loginAdmin(adminKey));
  const register = async (payload) => persistSession(await authApi.register(payload));

  const sessionPayload = useMemo(() => parseJwtPayload(token), [token]);
  const isAdminSession = Boolean(user && user.role === "admin" && sessionPayload?.authType === "admin_key");

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: Boolean(token && user),
        isAdminSession,
        login,
        loginAdmin,
        register,
        logout: clearSession,
        reload: loadMe
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
