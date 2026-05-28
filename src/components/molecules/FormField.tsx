import { FC, ReactNode } from 'react';
import './FormField.css';

export interface FormFieldProps {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}

/**
 * Molécula que encapsula la lógica visual de un campo de formulario.
 * Unifica Label + Input/Select/Textarea + ErrorMessage.
 */
const FormField: FC<FormFieldProps> = ({
  label,
  error,
  helperText,
  required = false,
  children,
  className = ''
}) => {
  const containerClasses = [
    'form-field',
    error ? 'form-field--error' : '',
    className
  ].filter(Boolean).join(' ');

  const labelClasses = [
    'form-field__label',
    required ? 'form-field__label--required' : ''
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
      {label && (
        <label className={labelClasses}>
          {label}
        </label>
      )}
      
      <div className="form-field__control">
        {children}
      </div>

      {error ? (
        <span className="form-field__error">{error}</span>
      ) : helperText ? (
        <span className="form-field__helper">{helperText}</span>
      ) : (
        /* Espaciador para mantener altura constante y evitar saltos visuales */
        <div className="form-field__error" aria-hidden="true" />
      )}
    </div>
  );
};

export default FormField;
