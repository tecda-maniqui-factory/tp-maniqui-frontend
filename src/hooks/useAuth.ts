import { use } from 'react';
import { AuthContext } from '@/context/AuthContext';;

/**
 * Hook personalizado para acceder rápidamente al contexto de autenticación global.
 * 
 * Encapsula el consumo de {@link AuthContext} y verifica que se encuentre
 * en el árbol de componentes dentro de un {@link AuthProvider}.
 * 
 * @example
 * ```tsx
 * import { useAuth } from '@/hooks/useAuth';
 * 
 * const Dashboard = () => {
 *   const { user, logout } = useAuth();
 *   return <button onClick={logout}>Salir de {user?.username}</button>;
 * };
 * ```
 * 
 * @returns El estado y acciones de autenticación provistos por {@link AuthContextType}.
 * @throws {Error} Si el hook se invoca fuera del árbol de componentes envuelto por {@link AuthProvider}.
 */
export const useAuth = () => {
  const context = use(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};
