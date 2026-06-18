import { createContext, useState, ReactNode, FC, useMemo, useCallback } from 'react';

/**
 * Represents a user profile in the application.
 */
export interface User {
  /** Unique identifier of the user. */
  id: number;
  /** Username for authentication and display. */
  username: string;
  /** Optional email address of the user. */
  email?: string;
  /** Role of the user, which controls permissions (e.g. 'gerente_prod', 'operario', 'vendedor'). */
  rol: string;
  /** Optional full name of the user. */
  name?: string;
}

/**
 * Shape of the authentication context state and actions.
 */
export interface AuthContextType {
  /** Indicates whether a user is currently logged in. */
  isAuthenticated: boolean;
  /** The current user profile, or null if unauthenticated. */
  user: User | null;
  /** The session token, or null if unauthenticated. */
  token: string | null;
  /** Authenticates the user and sets the credentials. */
  login: (token: string, user: User) => void;
  /** Logs out the user and clears all credentials. */
  logout: () => void;
}

/**
 * Context for managing and consuming authentication state.
 */
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider component that manages global session state with localStorage persistence.
 *
 * @param props - Component props containing children elements.
 */
export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    const savedToken = localStorage.getItem('auth_token');
    return (savedToken === 'undefined' || savedToken === 'null' || !savedToken) ? null : savedToken;
  });

  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('auth_user');
      if (!savedUser || savedUser === 'undefined' || savedUser === 'null') return null;
      return JSON.parse(savedUser);
    } catch {
      return null;
    }
  });

  const login = useCallback((newToken: string, newUser: User) => {
    if (!newToken || !newUser) return;
    
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('auth_token', newToken);
    localStorage.setItem('auth_user', JSON.stringify(newUser));
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  }, []);

  const isAuthenticated = !!token;

  const value = useMemo(() => ({
    isAuthenticated,
    user,
    token,
    login,
    logout
  }), [isAuthenticated, user, token, login, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
