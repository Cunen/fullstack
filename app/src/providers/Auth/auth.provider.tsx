import React, { useCallback, useState } from "react";
import type { ReactNode } from "react";
import AuthContext, { type AuthContextType } from "./auth.context";
import { useLoginUser, useLogoutUser } from "../../mutations/mutations";

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { loginUser } = useLoginUser();
  const { logoutUser } = useLogoutUser();

  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("token") ? true : false,
  );
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token"),
  );
  const [userId, setUserId] = useState<string | null>(
    localStorage.getItem("userId"),
  );
  const [tokenExpiry, setTokenExpiry] = useState<string | null>(
    localStorage.getItem("tokenExpiry"),
  );

  const login = useCallback(
    async (username: string, password: string) => {
      const result = await loginUser({ username, password });

      if (!result.token) return null;

      // Save token
      setToken(result.token);
      localStorage.setItem("token", result.token);

      // Save user ID
      setUserId(result.userId);
      localStorage.setItem("userId", result.userId);

      // Set authentication state
      setIsAuthenticated(true);

      // Set expiry
      const now = new Date();
      now.setTime(now.getTime() + 3600 * 1000); // 1 hour
      setTokenExpiry(now.toISOString());
      localStorage.setItem("tokenExpiry", now.toISOString());

      return { token: result.token, userId: result.userId };
    },
    [loginUser],
  );

  const logout = useCallback(async () => {
    if (userId) await logoutUser(userId);
    setIsAuthenticated(false);
    setToken(null);
    setUserId(null);
    setTokenExpiry(null);
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("tokenExpiry");
    return;
  }, [logoutUser, userId]);

  const value: AuthContextType = {
    isAuthenticated,
    userId,
    token,
    tokenExpiry,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
