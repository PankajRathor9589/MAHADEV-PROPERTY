import { createContext, useContext, useEffect, useState } from "react";
import { fetchMe, loginAdminWithKey, loginUser, registerUser } from "../services/api.js";

const AuthContext = createContext(null);

const TOKEN_KEY = "sagar_infra_token";
const USER_KEY = "sagar_infra_user";

const parseJwtPayload = (token) => {
  try {
    const [, payload] = String(token || "").split(".");
    if (!payload) {
      return null;
    }

    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = window.atob(normalized);
    return JSON.parse(decoded);
  } catch (error) {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || "");
  const [user, setUser] = useState(() => {
    const rawValue = localStorage.getItem(USER_KEY);

    if (!rawValue) {
      return null;
    }

    try {
      return JSON.parse(rawValue);
    } catch (error) {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const [bootstrapping, setBootstrapping] = useState(Boolean(token));

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
    let isMounted = true;

    const syncProfile = async () => {
      if (!token) {
        setBootstrapping(false);
        return;
      }

      try {
        // Rehydrate the signed-in user from the API so role/favorites stay current.
        const profile = await fetchMe();
        if (isMounted) {
          setUser(profile);
        }
      } catch (error) {
        if (isMounted) {
          setToken("");
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setBootstrapping(false);
        }
      }
    };

    syncProfile();

    return () => {
      isMounted = false;
    };
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
      setToken("");
      setUser(null);
      setBootstrapping(false);
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setToken("");
      setUser(null);
      setBootstrapping(false);
    }, remainingMs);

    return () => window.clearTimeout(timeoutId);
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

  const loginAdmin = async (adminKey) => {
    setLoading(true);
    try {
      const response = await loginAdminWithKey(adminKey);
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

  const refreshUser = async () => {
    if (!token) {
      return null;
    }

    const profile = await fetchMe();
    setUser(profile);
    return profile;
  };

  const logout = () => {
    setToken("");
    setUser(null);
    setBootstrapping(false);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        bootstrapping,
        isAuthenticated: Boolean(token && user),
        isAdmin: user?.role === "admin",
        login,
        loginAdmin,
        register,
        refreshUser,
        setUser,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
};
