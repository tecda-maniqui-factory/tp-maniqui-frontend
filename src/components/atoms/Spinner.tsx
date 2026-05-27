import React, { FC } from 'react';
import './Spinner.css';

export interface SpinnerProps {
  /** Tamaño del spinner en píxeles */
  size?: number;
  /** Variante de color (Flat UI) */
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info';
  /** Clase CSS adicional */
  className?: string;
}

/**
 * Componente Átomo: Spinner
 * Indicador visual de carga animado usando bordes CSS.
 */
const Spinner: FC<SpinnerProps> = ({
  size = 24,
  variant = 'primary',
  className = ''
}) => {
  const baseClass = 'spinner';
  const variantClass = `${baseClass}--${variant}`;
  
  return (
    <div 
      className={`${baseClass} ${variantClass} ${className}`}
      style={{ width: size, height: size }}
      role="status"
      aria-label="Cargando..."
    />
  );
};

export default Spinner;
