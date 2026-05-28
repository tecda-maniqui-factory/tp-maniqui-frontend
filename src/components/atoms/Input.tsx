import { FC, InputHTMLAttributes, useId } from 'react';
import Icon from './Icon';
import { icons } from 'lucide-react';
import './Input.css';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Icono opcional a mostrar a la izquierda (lucide-react) */
  iconName?: keyof typeof icons;
  /** Variante visual que define el color del bloque del icono (Flat UI) */
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info';
  /** Estado de error visual */
  hasError?: boolean;
}

/**
 * Componente Átomo: Input
 * Fiel a Flat UI, se enfoca solo en el campo y el icono.
 * Las etiquetas y mensajes de error deben ser manejados por FormField (Molécula).
 */
const Input: FC<InputProps> = ({
  iconName,
  variant,
  hasError = false,
  disabled = false,
  className = '',
  id,
  ...props
}) => {
  const generatedId = useId();
  const inputId = id || generatedId;

  const baseClass = 'input';
  const disabledClass = disabled ? `${baseClass}-wrapper--disabled` : '';
  const errorClass = hasError ? `${baseClass}-wrapper--error` : '';
  const variantClass = variant ? `${baseClass}-wrapper--${variant}` : '';
  
  const finalWrapperClass = [`${baseClass}-wrapper`, variantClass, disabledClass, errorClass, className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={finalWrapperClass}>
      <div className={`${baseClass}__field-container`}>
        {iconName && (
          <div className={`${baseClass}__icon-wrapper`}>
            <Icon name={iconName} className={`${baseClass}__icon`} />
          </div>
        )}
        <input
          id={inputId}
          className={`${baseClass}__element`}
          disabled={disabled}
          {...props}
        />
      </div>
    </div>
  );
};

export default Input;
