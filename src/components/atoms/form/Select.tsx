import { FC, SelectHTMLAttributes, useId } from 'react';
import Icon from '../display/Icon';
import { icons } from 'lucide-react';
import './Select.css';

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  /** Opciones a mostrar en el select */
  options: SelectOption[];
  /** Icono opcional a mostrar a la izquierda */
  iconName?: keyof typeof icons;
  /** Variante visual que define el color del bloque del icono (Flat UI) */
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info';
  /** Estado de error visual */
  hasError?: boolean;
  /** Placeholder personalizado */
  placeholder?: string;
}

/**
 * Componente Átomo: Select
 * Se enfoca solo en la selección. Las etiquetas deben ir en FormField.
 */
const Select: FC<SelectProps> = ({
  options,
  iconName,
  variant,
  hasError = false,
  disabled = false,
  className = '',
  id,
  placeholder = 'Seleccione una opción...',
  ...props
}) => {
  const generatedId = useId();
  const selectId = id || generatedId;

  const baseClass = 'select';
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
        
        <div className={`${baseClass}__select-container`}>
          <select
            id={selectId}
            className={`${baseClass}__element`}
            disabled={disabled}
            {...props}
          >
            <option value="" disabled hidden>
              {placeholder}
            </option>
            {options && options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <Icon name="ChevronDown" className={`${baseClass}__chevron`} />
        </div>
      </div>
    </div>
  );
};

export default Select;
