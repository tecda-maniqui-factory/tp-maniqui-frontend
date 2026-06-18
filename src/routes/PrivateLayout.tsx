import { FC, use } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '@/context/AuthContext';;
import MainLayout from '@/components/templates/MainLayout';;
import ProtectedRoute from './ProtectedRoute';
import { getSidebarItems } from '@/config/navigation.config';

/**
 * Componente `PrivateLayout`
 * 
 * Componente de diseño (Layout) que envuelve todas las rutas privadas/protegidas de la aplicación.
 * Utiliza el componente `ProtectedRoute` para asegurar la autenticación del usuario,
 * e integra la plantilla `MainLayout` configurada dinámicamente con los elementos de la barra
 * lateral correspondientes al rol del usuario y ruta activa.
 * 
 * @example
 * ```tsx
 * import { PrivateLayout } from './routes/PrivateLayout';
 * import { createBrowserRouter } from 'react-router-dom';
 * 
 * const router = createBrowserRouter([
 *   {
 *     path: '/',
 *     element: <PrivateLayout />,
 *     children: [
 *       { index: true, element: <DashboardPage /> }
 *     ]
 *   }
 * ]);
 * ```
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
