import { FC, ReactNode, use } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * Componente para proteger rutas privadas.
 * Redirige al login si el usuario no está autenticado.
 */
const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }) => {
  const auth = use(AuthContext);

  if (!auth) {
    throw new Error('ProtectedRoute must be used within an AuthProvider');
  }

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
