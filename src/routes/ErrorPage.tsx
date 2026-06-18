import { FC } from 'react';
import { useRouteError } from 'react-router-dom';
import Button from '@/components/atoms/form/Button';;
import './ErrorPage.css';

/**
 * Componente `ErrorPage`
 * 
 * Página de visualización de errores que actúa como boundary (límite de error) para React Router.
 * Captura y muestra información detallada del error (status text o mensaje de error) en la interfaz
 * y proporciona un botón para redirigir de forma segura al usuario al inicio de la aplicación.
 * 
 * @example
 * ```tsx
 * import { ErrorPage } from './routes/ErrorPage';
 * import { createBrowserRouter } from 'react-router-dom';
 * 
 * const router = createBrowserRouter([
 *   {
 *     path: '*',
 *     element: <DashboardPage />,
 *     errorElement: <ErrorPage />
 *   }
 * ]);
 * ```
 */
export const ErrorPage: FC = () => {
  const error = useRouteError() as { statusText?: string; message?: string } | null;
  console.error('Router Error:', error);

  return (
    <div className="error-page">
      <h1 className="error-page__title">¡Ups! Algo salió mal</h1>
      <p className="error-page__message">
        {error?.statusText || error?.message || 'Ha ocurrido un error inesperado en la navegación.'}
      </p>
      <Button variant="primary" onClick={() => window.location.href = '/'}>
        Volver al Inicio
      </Button>
    </div>
  );
};
