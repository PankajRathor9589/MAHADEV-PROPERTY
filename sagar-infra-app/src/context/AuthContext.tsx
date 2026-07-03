import * as SecureStore from 'expo-secure-store';
import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { fetchMe, loginUser, registerUser, setApiToken } from '@/services/api';
import { User } from '@/types/api';

const TOKEN_KEY = 'sagar_infra_token';

type AuthContextValue = {
  user: User | null;
  token: string | null;
  initializing: boolean;
  isAuthenticated: boolean;
  signIn: (payload: { email: string; password: string }) => Promise<void>;
  signUp: (payload: { name: string; email: string; phone?: string; password: string }) => Promise<void>;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [initializing, setInitializing] = useState(true);

  const saveSession = useCallback(async (nextToken: string, nextUser: User) => {
    setApiToken(nextToken);
    setToken(nextToken);
    setUser(nextUser);
    await SecureStore.setItemAsync(TOKEN_KEY, nextToken);
  }, []);

  const logout = useCallback(async () => {
    setApiToken(null);
    setToken(null);
    setUser(null);
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const nextUser = await fetchMe();
      setUser(nextUser);
    } catch {
      await logout();
    }
  }, [logout]);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);

        if (storedToken) {
          setApiToken(storedToken);
          setToken(storedToken);
          const nextUser = await fetchMe();
          setUser(nextUser);
        }
      } catch {
        await logout();
      } finally {
        setInitializing(false);
      }
    };

    restoreSession();
  }, [logout]);

  const signIn = useCallback(
    async (payload: { email: string; password: string }) => {
      const data = await loginUser(payload);
      await saveSession(data.token, data.user);
    },
    [saveSession],
  );

  const signUp = useCallback(
    async (payload: { name: string; email: string; phone?: string; password: string }) => {
      const data = await registerUser(payload);
      await saveSession(data.token, data.user);
    },
    [saveSession],
  );

  const value = useMemo(
    () => ({
      user,
      token,
      initializing,
      isAuthenticated: Boolean(token && user),
      signIn,
      signUp,
      refreshUser,
      logout,
    }),
    [initializing, logout, refreshUser, signIn, signUp, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error('useAuth must be used inside AuthProvider.');
  }

  return value;
};
