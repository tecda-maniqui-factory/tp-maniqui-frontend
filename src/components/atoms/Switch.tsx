import { FC, InputHTMLAttributes, useId } from 'react';
import './Switch.css';

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Texto descriptivo opcional al lado del switch */
  label?: string;
  /** Variante de color cuando está activo */
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info';
}

/**
 * Átomo: Switch (Toggle)
 * 
 * Un interruptor binario con estilo Flat UI.
 */
const Switch: FC<SwitchProps> = ({
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
