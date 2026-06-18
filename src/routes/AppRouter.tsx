import { FC, use } from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { AuthPage } from '@/features/auth/AuthPage';;
import ProductionPage from '@/features/produccion/ProductionPage';;
import DashboardPage from '@/features/dashboard/DashboardPage';;
import { ModelCreationPage } from '@/features/modelos/ModelCreationPage';;
import { SupplyPage } from '@/features/suministros/SupplyPage';;
import ReportsPage from '@/features/reportes/ReportsPage';
import { VentasPage } from '@/features/comercial/VentasPage';
import ClientesPage from '@/features/comercial/ClientesPage';
import { PresupuestoPage } from '@/features/comercial/PresupuestoPage';;
import NotificationContainer from '@/components/organisms/feedback/NotificationContainer';;
import { AuthContext } from '@/context/AuthContext';;
import { ErrorPage } from './ErrorPage';
import { PrivateLayout } from './PrivateLayout';

/**
 * Componente `AppRouter`
 * 
 * Orquestador principal de rutas de la aplicación. Configura y provee la estructura
 * de navegación utilizando React Router, gestionando el acceso público (login) y privado
 * con layouts específicos, además de las restricciones basadas en roles (`gerente_prod`, `operario`, `vendedor`).
 * 
 * @example
 * ```tsx
 * import { AppRouter } from './routes/AppRouter';
 * import { AuthProvider } from './context/AuthProvider';
 * 
 * function App() {
 *   return (
 *     <AuthProvider>
 *       <AppRouter />
 *     </AuthProvider>
 *   );
 * }
 * ```
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
        {
          path: 'clientes',
          element: (auth.user?.rol === 'gerente_prod' || auth.user?.rol === 'vendedor')
            ? <ClientesPage />
            : <Navigate to="/" replace />,
        },
        {
          path: 'presupuestos',
          element: (auth.user?.rol === 'gerente_prod' || auth.user?.rol === 'vendedor')
            ? <PresupuestoPage />
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
