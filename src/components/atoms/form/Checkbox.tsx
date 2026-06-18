import { FC, InputHTMLAttributes, useId } from 'react';
import './Checkbox.css';

/**
 * Propiedades para el componente {@link Checkbox}.
 * Excluye la propiedad nativa 'type' ya que está fija en 'checkbox'.
 */
export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** 
   * Variante visual que determina el esquema de color de borde y marca al estar activo (Flat UI).
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info';
}

/**
 * Componente Átomo: Checkbox
 * 
 * Renderiza un control de selección (casilla de verificación) con estética Flat UI personalizada.
 * Oculta el control nativo en favor de un contenedor estilizado, manteniendo la accesibilidad.
 * Genera de forma segura identificadores únicos usando `useId` si no se provee un `id` explícito.
 * 
 * @param props - Propiedades del componente definidas en {@link CheckboxProps}.
 * 
 * @example
 * ```tsx
 * // Checkbox simple
 * <Checkbox onChange={handleToggle}>Aceptar términos</Checkbox>
 * 
 * // Checkbox de variante éxito (verde) pre-seleccionado
 * <Checkbox variant="success" checked={isChecked} onChange={handleToggle}>
 *   Habilitar facturación
 * </Checkbox>
 * 
 * // Checkbox deshabilitado
 * <Checkbox disabled>Opción no disponible</Checkbox>
 * ```
 */
export const Checkbox: FC<CheckboxProps> = ({
  variant = 'primary',
  disabled = false,
  className = '',
  id,
  children,
  ...props
}) => {
  const generatedId = useId();
  const checkboxId = id || generatedId;

  const baseClass = 'checkbox';
  const variantClass = `${baseClass}-wrapper--${variant}`;
  const disabledClass = disabled ? `${baseClass}-wrapper--disabled` : '';

  return (
    <label className={[`${baseClass}-wrapper`, variantClass, disabledClass, className].filter(Boolean).join(' ')}>
      <div className={`${baseClass}__container`}>
        <input
          type="checkbox"
          id={checkboxId}
          className={`${baseClass}__input`}
          disabled={disabled}
          {...props}
        />
        <div className={`${baseClass}__custom`} />
      </div>
      {children && <span className={`${baseClass}__label`}>{children}</span>}
    </label>
  );
};

export default Checkbox;
