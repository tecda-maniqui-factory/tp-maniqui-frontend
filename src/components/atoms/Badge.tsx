import { FC, ReactNode } from 'react';
import Icon from './Icon';
import { icons } from 'lucide-react';
import './Badge.css';

export interface BadgeProps {
  /** Contenido del badge */
  children: ReactNode;
  /** Variante de color (Flat UI) */
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info';
  /** Icono opcional a mostrar */
  iconName?: keyof typeof icons;
  /** Clase CSS adicional */
  className?: string;
}

/**
 * Componente Átomo: Badge
 * Etiqueta visual para indicar estados (ej: Activo, Pendiente).
 */
const Badge: FC<BadgeProps> = ({
  children,
  variant = 'primary',
  iconName,
  className = ''
}) => {
  const baseClass = 'badge';
  const variantClass = `${baseClass}--${variant}`;
  
  return (
    <span className={`${baseClass} ${variantClass} ${className}`}>
      {iconName && <Icon name={iconName} className={`${baseClass}__icon`} />}
      {children}
    </span>
  );
};

export default Badge;
