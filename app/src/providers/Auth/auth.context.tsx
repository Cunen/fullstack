import { createContext } from "react";

type LoginResult = { token: string; userId: string } | null;

export interface AuthContextType {
  isAuthenticated: boolean;
  userId: string | null;
  token: string | null;
  tokenExpiry: string | null;
  login: (username: string, password: string) => Promise<LoginResult>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default AuthContext;
