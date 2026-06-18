import { FC, ReactNode } from 'react';
import Icon from './Icon';
import { icons } from 'lucide-react';
import './Badge.css';

/**
 * Propiedades para el componente de etiqueta {@link Badge}.
 */
export interface BadgeProps {
  /** Contenido o texto principal que se renderizará dentro de la etiqueta. */
  children: ReactNode;
  /** 
   * Variante visual que determina el esquema de color de fondo y texto (Flat UI).
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info';
  /** 
   * Nombre del icono de la librería Lucide que se mostrará a la izquierda del texto.
   * Internamente delega el renderizado en el componente {@link Icon}.
   */
  iconName?: keyof typeof icons;
  /** Clases CSS adicionales para sobreescribir márgenes o aplicar estilos de utilidad específicos. */
  className?: string;
}

/**
 * Componente Átomo: Badge
 * 
 * Una etiqueta visual pequeña y estilizada utilizada para categorizar elementos, 
 * resaltar estados de flujo (ej. "Activo", "Pendiente", "Vendido") o mostrar métricas compactas.
 * 
 * @param props - Propiedades del componente definidas en {@link BadgeProps}.
 * 
 * @example
 * ```tsx
 * // Badge básico de color primario (azul)
 * <Badge>Pendiente</Badge>
 * 
 * // Badge de éxito (verde) con un icono de verificación
 * <Badge variant="success" iconName="Check">
 *   Entregado
 * </Badge>
 * 
 * // Badge de peligro (rojo) con clase personalizada
 * <Badge variant="danger" className="ml-2">
 *   Error de stock
 * </Badge>
 * ```
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
