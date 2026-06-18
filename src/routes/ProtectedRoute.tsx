import { FC, ReactNode, use } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '@/context/AuthContext';

/**
 * Propiedades del componente {@link ProtectedRoute}.
 */
export interface ProtectedRouteProps {
  /** Los elementos hijos (componentes o páginas) a renderizar si el usuario está autenticado. */
  children: ReactNode;
}

/**
 * Componente: ProtectedRoute
 * 
 * Envoltura para proteger rutas y vistas privadas de la aplicación.
 * Consume el contexto {@link AuthContext} para verificar el estado de autenticación.
 * Redirige de forma segura al usuario a la página de inicio de sesión (`/login`) si no está autenticado.
 * 
 * @param props - Propiedades definidas en {@link ProtectedRouteProps}.
 * 
 * @example
 * ```tsx
 * // Proteger una ruta en el enrutador
 * <Route 
 *   path="/dashboard" 
 *   element={
 *     <ProtectedRoute>
 *       <DashboardPage />
 *     </ProtectedRoute>
 *   } 
 * />
 * ```
 */
export const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }) => {
  const auth = use(AuthContext);

  if (!auth) {
    throw new Error('ProtectedRoute must be used within an AuthProvider');
  }

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
