import { createBrowserRouter, Navigate, RouterProvider, Outlet, useLocation, useNavigate, useRouteError } from 'react-router-dom';
import { AuthPage } from '@/features/auth';
import { ProductionPage } from '@/features/produccion';
import { DashboardPage } from '@/features/dashboard';
import MainLayout from '@/components/templates/MainLayout';
import NotificationContainer from '@/components/organisms/NotificationContainer';
import Button from '@/components/atoms/Button';
import ProtectedRoute from './ProtectedRoute';
import { use, FC } from 'react';
import { AuthContext } from '@/context/AuthContext';

/**
 * Componente de Error para el Router.
 * Proporciona una UX limpia cuando algo falla en una ruta.
 */
const ErrorPage: FC = () => {
  const error: any = useRouteError();
  console.error('Router Error:', error);

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh', 
      gap: '1.5rem',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <h1 style={{ color: 'var(--color-danger)' }}>¡Ups! Algo salió mal</h1>
      <p style={{ color: 'var(--text-secondary)', maxWidth: '500px' }}>
        {error.statusText || error.message || 'Ha ocurrido un error inesperado en la navegación.'}
      </p>
      <Button variant="primary" onClick={() => window.location.href = '/'}>
        Volver al Inicio
      </Button>
    </div>
  );
};

/**
 * Componente Layout para rutas protegidas.
 * Envuelve el contenido con el MainLayout del sistema.
 */
const PrivateLayout: FC = () => {
  const auth = use(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  
  const SIDEBAR_ITEMS = [
    { 
      id: '/', 
      label: 'Dashboard', 
      icon: 'Activity', 
      isActive: location.pathname === '/' 
    },
    { 
      id: '/produccion', 
      label: 'Producción', 
      icon: 'Factory', 
      isActive: location.pathname === '/produccion' 
    },
  ];

  if (!auth) return null;

  return (
    <ProtectedRoute>
      <MainLayout 
        sidebarItems={SIDEBAR_ITEMS} 
        onLogout={auth.logout}
        onSidebarItemSelect={(id) => navigate(id)}
      >
        <Outlet />
      </MainLayout>
    </ProtectedRoute>
  );
};

/**
 * AppRouter: Orquestador principal de rutas de la aplicación.
 */
export const AppRouter: FC = () => {
  const auth = use(AuthContext);

  if (!auth) {
    throw new Error('AppRouter must be used within an AuthProvider');
  }

  const router = createBrowserRouter([
    {
      path: '/login',
      element: !auth.isAuthenticated ? <AuthPage /> : <Navigate to="/" replace />,
      errorElement: <ErrorPage />,
    },
    {
      path: '/',
      element: <PrivateLayout />,
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: <DashboardPage />,
        },
        {
          path: 'produccion',
          element: <ProductionPage />,
        },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/" replace />,
    }
  ]);

  return (
    <>
      <NotificationContainer />
      <RouterProvider router={router} />
    </>
  );
};
