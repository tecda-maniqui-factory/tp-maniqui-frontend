import { FC, ReactNode } from 'react';
import './Card.css';

export interface CardProps {
  /** Título opcional de la tarjeta */
  title?: ReactNode;
  /** Contenido principal */
  children: ReactNode;
  /** Contenido opcional para el pie de la tarjeta (acciones) */
  footer?: ReactNode;
  /** Clase CSS adicional */
  className?: string;
}

/**
 * Componente Molécula: Card
 * Contenedor visual para agrupar información relacionada.
 */
const Card: FC<CardProps> = ({
  title,
  children,
  footer,
  className = ''
}) => {
  const baseClass = 'card';

  return (
    <div className={`${baseClass} ${className}`}>
      {title && (
        <div className={`${baseClass}__header`}>
          <h3 className={`${baseClass}__title`}>{title}</h3>
        </div>
      )}
      <div className={`${baseClass}__body`}>
        {children}
      </div>
      {footer && (
        <div className={`${baseClass}__footer`}>
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
