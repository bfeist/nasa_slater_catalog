import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface AuthContextValue {
  isAuthenticated: boolean;
  /** Increments on every login/logout so consumers can re-fetch. */
  authVersion: number;
  login: (key: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  isAuthenticated: false,
  authVersion: 0,
  login: () => {},
  logout: () => {},
});

function getStoredKey(): string | null {
  try {
    return globalThis.sessionStorage?.getItem("revealKey") ?? null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }): ReactNode {
  const [isAuthenticated, setIsAuthenticated] = useState(() => getStoredKey() !== null);
  const [authVersion, setAuthVersion] = useState(0);

  const login = useCallback((key: string) => {
    try {
      sessionStorage.setItem("revealKey", key);
    } catch {
      /* ignore */
    }
    setIsAuthenticated(true);
    setAuthVersion((v) => v + 1);
  }, []);

  const logout = useCallback(() => {
    try {
      sessionStorage.removeItem("revealKey");
    } catch {
      /* ignore */
    }
    setIsAuthenticated(false);
    setAuthVersion((v) => v + 1);
  }, []);

  return (
    <AuthContext value={{ isAuthenticated, authVersion, login, logout }}>{children}</AuthContext>
  );
}

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}
