import React, { FC, SelectHTMLAttributes, useId } from 'react';
import Icon from './Icon';
import { icons } from 'lucide-react';
import './Select.css';

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  /** Etiqueta descriptiva del campo */
  label?: string;
  /** Opciones a mostrar en el select */
  options: SelectOption[];
  /** Mensaje de error a mostrar debajo del campo */
  error?: string;
  /** Icono opcional a mostrar a la izquierda */
  iconName?: keyof typeof icons;
  /** Variante visual que define el color del bloque del icono (Flat UI) */
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info';
  /** Estado deshabilitado explícito */
  isDisabled?: boolean;
}

/**
 * Componente Átomo: Select
 * Select HTML nativo pero estilizado al 100% como Flat UI para que coincida con Input y Button.
 */
const Select: FC<SelectProps> = ({
  label,
  options,
  error,
  iconName,
  variant,
  isDisabled = false,
  className = '',
  id,
  placeholder = 'Seleccione una opción...',
  ...props
}) => {
  const generatedId = useId();
  const selectId = id || generatedId;

  // Clases BEM
  const baseClass = 'select';
  const disabledClass = isDisabled ? `${baseClass}-wrapper--disabled` : '';
  const errorClass = error ? `${baseClass}-wrapper--error` : '';
  const variantClass = variant ? `${baseClass}-wrapper--${variant}` : '';

  const finalWrapperClass = [`${baseClass}-wrapper`, variantClass, disabledClass, errorClass, className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={finalWrapperClass}>
      {label && (
        <label className={`${baseClass}__label`} htmlFor={selectId}>
          {label}
        </label>
      )}
      
      <div className={`${baseClass}__field-container`}>
        {iconName && (
          <div className={`${baseClass}__icon-wrapper`}>
            <Icon name={iconName} className={`${baseClass}__icon`} />
          </div>
        )}
        
        <div className={`${baseClass}__select-wrapper`}>
          <select
            id={selectId}
            className={`${baseClass}__element`}
            disabled={isDisabled}
            defaultValue=""
            {...props}
          >
            <option value="" disabled hidden>
              {placeholder}
            </option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {/* Reemplazamos la flecha fea del sistema operativo por un icono de Lucide */}
          <Icon name="ChevronDown" className={`${baseClass}__chevron`} />
        </div>
      </div>

      {error && (
        <span className={`${baseClass}__error-message`}>
          {error}
        </span>
      )}
    </div>
  );
};

export default Select;
