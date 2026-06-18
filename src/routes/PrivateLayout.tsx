import { FC, use } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '@/context/AuthContext';;
import MainLayout from '@/components/templates/MainLayout';;
import ProtectedRoute from './ProtectedRoute';
import { getSidebarItems } from '@/config/navigation.config';

/**
 * Componente Layout para rutas protegidas.
 * Envuelve el contenido con el MainLayout del sistema.
 */
export const PrivateLayout: FC = () => {
  const auth = use(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  
  if (!auth) return null;

  const sidebarItems = getSidebarItems(location.pathname, auth.user?.rol);

  return (
    <ProtectedRoute>
      <MainLayout 
        sidebarItems={sidebarItems} 
        onLogout={auth.logout}
        onSidebarItemSelect={(id) => navigate(id)}
      >
        <Outlet />
      </MainLayout>
    </ProtectedRoute>
  );
};
