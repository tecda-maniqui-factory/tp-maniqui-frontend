import { FC, InputHTMLAttributes, useId } from 'react';
import Icon from '../display/Icon';
import { icons } from 'lucide-react';
import './Input.css';

/**
 * Props para el componente {@link Input}.
 * Hereda todas las propiedades nativas de un elemento HTML `<input>`.
 */
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** 
   * Nombre del icono de Lucide que se mostrará a la izquierda dentro del campo.
   * Delegado al componente {@link Icon}.
   */
  iconName?: keyof typeof icons;
  /** 
   * Variante visual que define el color del bloque del icono izquierdo (Flat UI).
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info';
  /** 
   * Indica si el campo tiene un error de validación activo, aplicando estilos de borde rojo.
   * @default false
   */
  hasError?: boolean;
}

/**
 * Componente Átomo: Input
 * 
 * Campo de entrada de texto estilizado según la estética Flat UI con soporte para un bloque
 * de icono lateral y estados de error/deshabilitado.
 * 
 * Se enfoca exclusivamente en el control y la interactividad del campo. Para layouts accesibles
 * que incluyan etiquetas (labels) y mensajes de error extendidos, utilícese la molécula {@link FormField}.
 * 
 * @param props - Propiedades que cumplen con {@link InputProps}.
 * 
 * @example
 * ```tsx
 * // Input simple de búsqueda con icono de lupa
 * <Input iconName="Search" placeholder="Buscar..." onChange={handleSearch} />
 * 
 * // Input de contraseña con variante de seguridad (azul) y estado de error
 * <Input 
 *   type="password" 
 *   iconName="Lock" 
 *   placeholder="Introduce tu clave"
 *   variant="primary"
 *   hasError={true}
 * />
 * ```
 */
export const Input: FC<InputProps> = ({
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
