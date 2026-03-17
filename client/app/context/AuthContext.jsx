import { createContext, useContext, useEffect, useState } from "react";
import { fetchMe, loginUser, registerUser } from "../services/api.js";

const AuthContext = createContext(null);

const TOKEN_KEY = "mahadev_token";
const USER_KEY = "mahadev_user";

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
