import { FC, ButtonHTMLAttributes, ReactNode } from 'react';
import Icon from './Icon';
import { icons } from 'lucide-react';
import './Button.css';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Texto a mostrar a la derecha. Opcional si es isCompact */
  children?: ReactNode;
  /** Nombre del icono de lucide-react */
  iconName?: keyof typeof icons;
  /** Variante visual que define el color del bloque izquierdo */
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info';
  /** Estado deshabilitado explícito (independiente de disabled nativo) */
  isDisabled?: boolean;
  /** Si es true, solo muestra el bloque del icono (cuadrado) */
  isCompact?: boolean;
}

/**
 * Componente Átomo: Button
 * Diseño Flat UI "Split": Icono en cuadrado de color a la izquierda, texto en gris a la derecha.
 * Si isCompact es true, solo se muestra el bloque del icono.
 */
const Button: FC<ButtonProps> = ({ 
  children, 
  iconName,
  variant = 'primary', 
  type = 'button', 
  isDisabled = false, 
  isCompact = false,
  onClick, 
  className = '',
  ...props 
}) => {
  // Construcción de clases BEM
  const baseClass = 'button';
  const variantClass = `${baseClass}--${variant}`;
  const disabledClass = isDisabled ? `${baseClass}--disabled` : '';
  const compactClass = isCompact ? `${baseClass}--compact` : '';

  const finalClassName = [baseClass, variantClass, disabledClass, compactClass, className]
    .filter(Boolean)
    .join(' ');

  return (
    <button 
      className={finalClassName} 
      type={type} 
      disabled={isDisabled} 
      onClick={onClick}
      {...props}
    >
      <div className={`${baseClass}__icon-block`}>
        {iconName ? (
          <Icon name={iconName} className={`${baseClass}__icon`} />
        ) : (
          <div className={`${baseClass}__placeholder`} />
        )}
      </div>
      
      {!isCompact && children && (
        <div className={`${baseClass}__text-block`}>
          {children}
        </div>
      )}
    </button>
  );
};

export default Button;
