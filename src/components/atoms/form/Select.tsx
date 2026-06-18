import { FC, SelectHTMLAttributes, useId } from 'react';
import Icon from '../display/Icon';
import { icons } from 'lucide-react';
import './Select.css';

/**
 * Representa una opción individual dentro del menú desplegable de {@link Select}.
 */
export interface SelectOption {
  /** Valor interno que se enviará en el formulario. */
  value: string | number;
  /** Texto legible por el usuario que se mostrará en el menú. */
  label: string;
}

/**
 * Propiedades del componente {@link Select}.
 * Hereda todas las propiedades nativas de un elemento HTML `<select>`.
 */
export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  /** Lista de opciones estructuradas que se mostrarán en el menú desplegable. */
  options: SelectOption[];
  /** 
   * Nombre del icono de Lucide que se mostrará a la izquierda dentro del campo.
   * Delegado al componente {@link Icon}.
   */
  iconName?: keyof typeof icons;
  /** 
   * Variante visual que define el color del bloque de icono izquierdo (Flat UI).
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info';
  /** 
   * Indica si el campo tiene un error de validación activo, aplicando estilos de borde rojo.
   * @default false
   */
  hasError?: boolean;
  /** 
   * Texto por defecto de la opción deshabilitada e invisible que actúa como marcador de posición.
   * @default 'Seleccione una opción...'
   */
  placeholder?: string;
}

/**
 * Componente Átomo: Select
 * 
 * Menú de selección desplegable (dropdown) estilizado bajo la estética Flat UI.
 * Incluye un bloque de icono lateral, un indicador de flecha personalizado (`ChevronDown`)
 * y soporte para estados de error/deshabilitado.
 * 
 * Se enfoca exclusivamente en la interacción de selección. Para layouts accesibles
 * que requieran etiquetas descriptivas (labels) y textos de error, utilícese la molécula {@link FormField}.
 * 
 * @param props - Propiedades del componente definidas en {@link SelectProps}.
 * 
 * @example
 * ```tsx
 * const opcionesMoneda = [
 *   { value: 'ARS', label: 'Pesos Argentinos (ARS)' },
 *   { value: 'USD', label: 'Dólares Estadounidenses (USD)' }
 * ];
 * 
 * // Select básico con icono de moneda
 * <Select
 *   options={opcionesMoneda}
 *   iconName="Coins"
 *   placeholder="Elige la moneda"
 *   onChange={(e) => setMoneda(e.target.value)}
 * />
 * 
 * // Select con variante de peligro (rojo) y error activo
 * <Select
 *   options={opciones}
 *   variant="danger"
 *   hasError={true}
 * />
 * ```
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
