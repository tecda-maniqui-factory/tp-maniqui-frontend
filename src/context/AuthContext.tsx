import { createContext, useState, ReactNode, FC, useMemo, useCallback } from 'react';

/**
 * Perfil de usuario en la aplicación.
 */
export interface User {
  /** Identificador único numérico del usuario. */
  id: number;
  /** Nombre de usuario utilizado para la autenticación y visualización. */
  username: string;
  /** Dirección de correo electrónico opcional del usuario. */
  email?: string;
  /** Rol asignado que controla los permisos de acceso (ej. 'gerente_prod', 'operario', 'vendedor'). */
  rol: string;
  /** Nombre completo opcional del usuario. */
  name?: string;
}

/**
 * Representa el estado y las acciones provistas por el contexto de autenticación.
 */
export interface AuthContextType {
  /** Indica si hay un usuario autenticado activo en la sesión. */
  isAuthenticated: boolean;
  /** Datos del perfil del usuario logueado o null si no se ha autenticado. */
  user: User | null;
  /** Token de sesión JWT actual o null si no está autenticado. */
  token: string | null;
  /** Registra el token y los datos de perfil para iniciar sesión. */
  login: (token: string, user: User) => void;
  /** Remueve el token y destruye la sesión del usuario. */
  logout: () => void;
}

/**
 * Contexto de React para consumir y administrar el estado de la sesión.
 * 
 * Se consume convenientemente mediante el hook {@link useAuth}.
 */
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Proveedor de contexto (Provider) que administra el ciclo de vida del estado de la sesión global.
 * 
 * Almacena el token de sesión y el perfil de usuario, persistiendo ambos datos en el
 * almacenamiento local (`localStorage`) para mantener la sesión tras recargas.
 * 
 * @example
 * ```tsx
 * import { AuthProvider } from './context/AuthContext';
 * 
 * const App = () => (
 *   <AuthProvider>
 *     <MyLayout />
 *   </AuthProvider>
 * );
 * ```
 * 
 * @param props - Props de componente que contiene los nodos hijos.
 * @returns Elemento proveedor de React.
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
