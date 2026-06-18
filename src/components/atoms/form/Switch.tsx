import { FC, InputHTMLAttributes, useId } from 'react';
import './Switch.css';

/**
 * Propiedades del componente {@link Switch}.
 * Excluye la propiedad nativa 'type' ya que está fija en 'checkbox'.
 */
export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Texto descriptivo o etiqueta que se mostrará junto al interruptor. */
  label?: string;
  /** 
   * Variante visual que determina el color del fondo activo de la pista (Flat UI).
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info';
}

/**
 * Componente Átomo: Switch (Toggle)
 * 
 * Interruptor deslizante bidireccional (on/off) con estética Flat UI.
 * Sustituye visualmente la casilla de verificación nativa por una pista y deslizador animados,
 * manteniendo el comportamiento y la accesibilidad estándar del navegador mediante `useId`.
 * 
 * @param props - Propiedades definidas en {@link SwitchProps}.
 * 
 * @example
 * ```tsx
 * // Interruptor básico
 * <Switch label="Recordar sesión" onChange={handleToggle} />
 * 
 * // Interruptor con variante de éxito (verde) activado
 * <Switch
 *   label="Notificaciones push"
 *   variant="success"
 *   checked={isPushEnabled}
 *   onChange={handlePushToggle}
 * />
 * 
 * // Interruptor deshabilitado
 * <Switch label="Función premium bloqueada" disabled />
 * ```
 */
export const Switch: FC<SwitchProps> = ({
  label,
  variant = 'primary',
  disabled = false,
  className = '',
  id,
  ...props
}) => {
  const generatedId = useId();
  const switchId = id || generatedId;

  const containerClasses = [
    'switch',
    variant ? `switch--${variant}` : '',
    disabled ? 'switch--disabled' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <label className={containerClasses} htmlFor={switchId}>
      <div className="switch__container">
        <input
          type="checkbox"
          id={switchId}
          className="switch__input"
          disabled={disabled}
          {...props}
        />
        <div className="switch__track">
          <div className="switch__thumb" />
        </div>
      </div>
      {label && <span className="switch__label">{label}</span>}
    </label>
  );
};

export default Switch;
