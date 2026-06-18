import { FC, InputHTMLAttributes, useId } from 'react';
import './Switch.css';

/**
 * Props for the Switch toggle component.
 */
export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Optional descriptive text displayed next to the switch. */
  label?: string;
  /** Color variant of the switch when active. */
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info';
}

/**
 * Atom Component: Switch (Toggle)
 * A binary toggle switch styled according to Flat UI guidelines.
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
