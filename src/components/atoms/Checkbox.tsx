import { FC, InputHTMLAttributes, useId } from 'react';
import './Checkbox.css';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Variante de color (Flat UI) */
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info';
}

/**
 * Componente Átomo: Checkbox
 * Un checkbox con estilo cuadrado Flat UI personalizado.
 * El label externo se delega al consumidor o a FormField si es necesario.
 */
const Checkbox: FC<CheckboxProps> = ({
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
