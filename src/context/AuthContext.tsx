import { createContext, useState, ReactNode, FC, useMemo, useCallback } from 'react';

export interface User {
  id: number;
  username: string;
  email?: string;
  rol: string;
  name?: string; // Campo extra por si el backend lo devuelve
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Proveedor de Autenticación: AuthProvider
 * Gestiona el estado global de la sesión con persistencia en localStorage.
 */
export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  // Inicialización perezosa (Lazy initialization) para evitar bloqueos en el hilo principal
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
