import { createContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { authService } from "../services/authService";
import type { User } from "../utils/types";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (payload: { email: string; password: string }) => Promise<void>;
  signup: (payload: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("ttm_token");
    const storedUser = localStorage.getItem("ttm_user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser) as User);
    }
  }, []);

  const persistAuth = (nextToken: string, nextUser: User) => {
    localStorage.setItem("ttm_token", nextToken);
    localStorage.setItem("ttm_user", JSON.stringify(nextUser));
    setToken(nextToken);
    setUser(nextUser);
  };

  const login = async (payload: { email: string; password: string }) => {
    const data = await authService.login(payload);
    persistAuth(data.token, data.user);
  };

  const signup = async (payload: { name: string; email: string; password: string }) => {
    const data = await authService.register(payload);
    persistAuth(data.token, data.user);
  };

  const logout = () => {
    localStorage.removeItem("ttm_token");
    localStorage.removeItem("ttm_user");
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token),
      login,
      signup,
      logout,
    }),
    [token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
