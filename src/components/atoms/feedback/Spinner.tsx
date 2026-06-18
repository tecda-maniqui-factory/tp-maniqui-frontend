import { FC } from 'react';
import './Spinner.css';

/**
 * Propiedades del componente {@link Spinner}.
 */
export interface SpinnerProps {
  /** 
   * Tamaño de la caja del spinner en píxeles (ancho y alto).
   * @default 24
   */
  size?: number;
  /** 
   * Variante visual que determina el color del borde activo (Flat UI).
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info';
  /** Clases CSS adicionales para definir el posicionamiento o márgenes del spinner. */
  className?: string;
}

/**
 * Componente Átomo: Spinner
 * 
 * Indicador visual de carga circular animado por CSS.
 * Utiliza variables CSS (`--spinner-size`) para la escala y es totalmente accesible 
 * mediante el rol `status` para lectores de pantalla.
 * 
 * @param props - Propiedades del componente definidas en {@link SpinnerProps}.
 * 
 * @example
 * ```tsx
 * // Spinner básico de carga (24px, color azul primario)
 * <Spinner />
 * 
 * // Spinner grande de éxito (48px, color verde)
 * <Spinner size={48} variant="success" />
 * 
 * // Spinner centrado usando clases personalizadas
 * <Spinner className="mx-auto my-4" />
 * ```
 */
export const Spinner: FC<SpinnerProps> = ({
  size = 24,
  variant = 'primary',
  className = ''
}) => {
  const baseClass = 'spinner';
  const variantClass = `${baseClass}--${variant}`;
  
  return (
    <div 
      className={`${baseClass} ${variantClass} ${className}`}
      style={{ '--spinner-size': `${size}px` } as React.CSSProperties}
      role="status"
      aria-label="Cargando..."
    />
  );
};

export default Spinner;
