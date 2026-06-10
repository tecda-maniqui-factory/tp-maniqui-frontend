import { FC, ReactNode } from 'react';
import { Icon } from '@/components/atoms';
import { icons } from 'lucide-react';
import './Alert.css';

export interface AlertProps {
  /** Título principal de la alerta */
  title?: string;
  /** Mensaje de la alerta */
  children: ReactNode;
  /** Variante de color (Flat UI) */
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info';
  /** Icono personalizado. Si no se pasa, usa uno por defecto según la variante. */
  iconName?: keyof typeof icons;
  /** Función opcional para cerrar la alerta */
  onClose?: () => void;
  /** Clase CSS adicional */
  className?: string;
}

const defaultIcons: Record<string, keyof typeof icons> = {
  primary: 'Info',
  secondary: 'Info',
  danger: 'CircleAlert',
  success: 'CircleCheck',
  warning: 'TriangleAlert',
  info: 'Info'
};

/**
 * Componente Molécula: Alert
 * Caja de notificación estática para mostrar mensajes importantes.
 */
const Alert: FC<AlertProps> = ({
  title,
  children,
  variant = 'info',
  iconName,
  onClose,
  className = ''
}) => {
  const baseClass = 'alert';
  const variantClass = `${baseClass}--${variant}`;
  const IconComponent = iconName || defaultIcons[variant] || 'Info';

  return (
    <div className={`${baseClass} ${variantClass} ${className}`} role="alert">
      <div className={`${baseClass}__icon-wrapper`}>
        <Icon name={IconComponent} className={`${baseClass}__icon`} />
      </div>
      <div className={`${baseClass}__content`}>
        {title && <h4 className={`${baseClass}__title`}>{title}</h4>}
        <div className={`${baseClass}__message`}>{children}</div>
      </div>
      {onClose && (
        <button 
          className={`${baseClass}__close`} 
          onClick={onClose}
          aria-label="Cerrar alerta"
        >
          <Icon name="X" />
        </button>
      )}
    </div>
  );
};

export default Alert;
