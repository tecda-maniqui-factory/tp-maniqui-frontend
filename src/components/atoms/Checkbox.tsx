import React, { FC, InputHTMLAttributes, useId } from 'react';
import './Checkbox.css';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Texto descriptivo que acompaña al checkbox */
  label?: string;
  /** Variante de color (Flat UI) */
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info';
  /** Estado deshabilitado explícito */
  isDisabled?: boolean;
}

/**
 * Componente Átomo: Checkbox
 * Un checkbox con estilo cuadrado Flat UI personalizado (sin usar el nativo redondeado).
 */
const Checkbox: FC<CheckboxProps> = ({
  label,
  variant = 'primary',
  isDisabled = false,
  className = '',
  id,
  ...props
}) => {
  const generatedId = useId();
  const checkboxId = id || generatedId;

  const baseClass = 'checkbox';
  const variantClass = `${baseClass}-wrapper--${variant}`;
  const disabledClass = isDisabled ? `${baseClass}-wrapper--disabled` : '';

  return (
    <label className={[`${baseClass}-wrapper`, variantClass, disabledClass, className].filter(Boolean).join(' ')}>
      <div className={`${baseClass}__container`}>
        <input
          type="checkbox"
          id={checkboxId}
          className={`${baseClass}__input`}
          disabled={isDisabled}
          {...props}
        />
        <div className={`${baseClass}__custom`} />
      </div>
      {label && <span className={`${baseClass}__label`}>{label}</span>}
    </label>
  );
};

export default Checkbox;
