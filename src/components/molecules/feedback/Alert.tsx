import { FC, ReactNode } from 'react';
import Icon from '@/components/atoms/display/Icon';;
import { icons } from 'lucide-react';
import './Alert.css';

/**
 * Props for the Alert component.
 */
export interface AlertProps {
  /** Optional header title for the alert. */
  title?: string;
  /** Content message to display inside the alert. */
  children: ReactNode;
  /** Color variant of the alert following Flat UI palettes. */
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info';
  /** Optional custom Lucide icon name. If omitted, uses a default based on variant. */
  iconName?: keyof typeof icons;
  /** Optional callback to close/dismiss the alert. */
  onClose?: () => void;
  /** Additional custom CSS class name. */
  className?: string;
}

/** Default Lucide icon mapped to each alert style variant. */
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
