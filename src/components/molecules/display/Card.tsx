import { FC, ReactNode } from 'react';
import './Card.css';

/**
 * Propiedades del componente {@link Card}.
 */
export interface CardProps {
  /** 
   * Título opcional que se mostrará en la cabecera de la tarjeta.
   * Puede ser una cadena de texto simple o un elemento React completo.
   */
  title?: ReactNode;
  /** Contenido principal que se renderiza dentro del cuerpo de la tarjeta. */
  children: ReactNode;
  /** 
   * Elementos opcionales que se renderizarán en el pie de la tarjeta.
   * Típicamente usado para botones o enlaces de acción.
   */
  footer?: ReactNode;
  /** Clase de estilo CSS adicional para personalizar márgenes o dimensiones. */
  className?: string;
}

/**
 * Componente Molécula: Card
 * 
 * Contenedor visual rectangular estructurado tipo panel para agrupar y organizar
 * información relacionada, controles de formulario o reportes.
 * Sigue la metodología BEM y divide su estructura en `header`, `body` y `footer`.
 * 
 * @param props - Propiedades definidas en {@link CardProps}.
 * 
 * @example
 * ```tsx
 * // Tarjeta simple de información
 * <Card>
 *   <p>Este es el cuerpo con información general.</p>
 * </Card>
 * 
 * // Tarjeta completa con cabecera y pie con botón de acción
 * <Card 
 *   title="Detalles de Producción"
 *   footer={<Button onClick={handleConfirm}>Confirmar Orden</Button>}
 * >
 *   <ul>
 *     <li>Modelo: Maniquí Femenino Realista</li>
 *     <li>Lote: LOTE-2026-A</li>
 *     <li>Estado: En espera de piezas</li>
 *   </ul>
 * </Card>
 * ```
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
