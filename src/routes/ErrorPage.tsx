import { FC } from 'react';
import { useRouteError } from 'react-router-dom';
import { Button } from '@/components/atoms';
import './ErrorPage.css';

/**
 * Componente de Error para el Router.
 * Proporciona una UX limpia cuando algo falla en una ruta.
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
