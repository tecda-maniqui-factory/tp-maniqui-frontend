import React, { FC, InputHTMLAttributes, useId } from 'react';
import Icon from './Icon';
import { icons } from 'lucide-react';
import './Input.css';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Etiqueta descriptiva del campo */
  label?: string;
  /** Mensaje de error a mostrar debajo del campo */
  error?: string;
  /** Icono opcional a mostrar a la izquierda (lucide-react) */
  iconName?: keyof typeof icons;
  /** Variante visual que define el color del bloque del icono (Flat UI) */
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info';
  /** Estado deshabilitado explícito */
  isDisabled?: boolean;
}

/**
 * Componente Átomo: Input
 * Sigue las reglas de BEM, TypeScript y diseño Flat UI.
 */
const Input: FC<InputProps> = ({
  label,
  error,
  iconName,
  variant,
  isDisabled = false,
  className = '',
  id,
  ...props
}) => {
  const generatedId = useId();
  const inputId = id || generatedId;

  // Construcción de clases BEM
  const baseClass = 'input';
  const disabledClass = isDisabled ? `${baseClass}-wrapper--disabled` : '';
  const errorClass = error ? `${baseClass}-wrapper--error` : '';
  const variantClass = variant ? `${baseClass}-wrapper--${variant}` : '';
  
  // El contenedor principal (wrapper) maneja los modificadores de estado
  const finalWrapperClass = [`${baseClass}-wrapper`, variantClass, disabledClass, errorClass, className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={finalWrapperClass}>
      {label && (
        <label className={`${baseClass}__label`} htmlFor={inputId}>
          {label}
        </label>
      )}
      
      <div className={`${baseClass}__field-container`}>
        {iconName && (
          <div className={`${baseClass}__icon-wrapper`}>
            <Icon name={iconName} className={`${baseClass}__icon`} />
          </div>
        )}
        <input
          id={inputId}
          className={`${baseClass}__element`}
          disabled={isDisabled}
          {...props}
        />
      </div>

      {error && (
        <span className={`${baseClass}__error-message`}>
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;
