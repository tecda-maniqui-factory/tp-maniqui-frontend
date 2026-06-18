import { FC, ButtonHTMLAttributes, ReactNode } from 'react';
import Icon from '../display/Icon';
import { icons } from 'lucide-react';
import './Button.css';

/**
 * Props para el componente {@link Button}.
 * Hereda todas las propiedades nativas de un elemento HTML `<button>`.
 */
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** 
   * Contenido de texto que se renderiza en el bloque derecho del botón.
   * Opcional o ignorado si {@link ButtonProps.isCompact} es `true`.
   */
  children?: ReactNode;
  /** 
   * Nombre de la colección de iconos de Lucide que se dibujará en el bloque izquierdo del botón.
   * Delegado al componente {@link Icon}.
   */
  iconName?: keyof typeof icons;
  /** 
   * Variante de color que define el fondo del bloque de icono izquierdo (Flat UI).
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info';
  /** 
   * Estado deshabilitado lógico que añade clases de estilo BEM de atenuación y bloquea clics.
   * @default false
   */
  isDisabled?: boolean;
  /** 
   * Si es `true`, oculta el bloque de texto derecho y reduce el ancho del botón
   * al tamaño cuadrado del bloque de icono izquierdo.
   * @default false
   */
  isCompact?: boolean;
}

/**
 * Componente Átomo: Button
 * 
 * Botón interactivo con diseño Flat UI tipo "Split":
 * Contiene un bloque de icono de color representativo a la izquierda, y un bloque de texto
 * en tono neutral a la derecha. Soporta modo compacto y estados deshabilitados.
 * 
 * @param props - Propiedades que cumplen con {@link ButtonProps}.
 * 
 * @example
 * ```tsx
 * // Botón estándar con texto e icono
 * <Button variant="primary" iconName="Save" onClick={handleSave}>
 *   Guardar
 * </Button>
 * 
 * // Botón de peligro compacto (solo icono)
 * <Button variant="danger" iconName="Trash2" isCompact onClick={handleDelete} />
 * ```
 */
export const Button: FC<ButtonProps> = ({ 
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
