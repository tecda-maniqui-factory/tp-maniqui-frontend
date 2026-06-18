import { FC, SelectHTMLAttributes, useId } from 'react';
import Icon from '../display/Icon';
import { icons } from 'lucide-react';
import './Select.css';

/**
 * Represents an option inside the Select component.
 */
export interface SelectOption {
  /** Value of the option. */
  value: string | number;
  /** Human-readable label for the option. */
  label: string;
}

/**
 * Props for the Select component.
 */
export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  /** Options to display in the dropdown. */
  options: SelectOption[];
  /** Optional icon name (from Lucide) to show on the left. */
  iconName?: keyof typeof icons;
  /** Visual variant affecting the icon block background. */
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info';
  /** Visual error state indicator. */
  hasError?: boolean;
  /** Custom placeholder option text. */
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
