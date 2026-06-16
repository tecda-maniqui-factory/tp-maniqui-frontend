import { FC, use } from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { AuthPage } from '@/features/auth';
import { ProductionPage } from '@/features/produccion';
import { DashboardPage } from '@/features/dashboard';
import { ModelCreationPage } from '@/features/modelos';
import { SupplyPage } from '@/features/suministros';
import ReportsPage from '@/features/reportes/ReportsPage';
import { VentasPage } from '@/features/comercial';
import { NotificationContainer } from '@/components/organisms';
import { AuthContext } from '@/context';
import { ErrorPage } from './ErrorPage';
import { PrivateLayout } from './PrivateLayout';

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
          element: (auth.user?.rol === 'gerente_prod' || auth.user?.rol === 'operario')
            ? <ProductionPage />
            : <Navigate to="/" replace />,
        },
        {
          path: 'modelos',
          element: auth.user?.rol === 'gerente_prod' 
            ? <ModelCreationPage /> 
            : <Navigate to="/" replace />,
        },
        {
          path: 'suministros',
          element: auth.user?.rol === 'gerente_prod' 
            ? <SupplyPage /> 
            : <Navigate to="/" replace />,
        },
        {
          path: 'reportes',
          element: auth.user?.rol === 'gerente_prod' 
            ? <ReportsPage /> 
            : <Navigate to="/" replace />,
        },
        {
          path: 'ventas',
          element: (auth.user?.rol === 'gerente_prod' || auth.user?.rol === 'vendedor')
            ? <VentasPage />
            : <Navigate to="/" replace />,
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
