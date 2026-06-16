import { FC, ReactNode, useId, Children, isValidElement, cloneElement } from 'react';
import './FormField.css';

export interface FormFieldProps {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
  htmlFor?: string;
}

/**
 * Molécula que encapsula la lógica visual de un campo de formulario.
 * Unifica Label + Control de formulario (Input/Select) + Mensaje de error/ayuda.
 * Genera automáticamente IDs únicos para vincular de forma accesible el label con su control.
 */
const FormField: FC<FormFieldProps> = ({
  label,
  error,
  helperText,
  required = false,
  children,
  className = '',
  htmlFor
}) => {
  const generatedId = useId();
  const inputId = htmlFor || generatedId;

  const containerClasses = [
    'form-field',
    error ? 'form-field--error' : '',
    className
  ].filter(Boolean).join(' ');

  const labelClasses = [
    'form-field__label',
    required ? 'form-field__label--required' : ''
  ].filter(Boolean).join(' ');

  // Inyectar de manera accesible el id en el control hijo si este es un elemento válido
  const childrenWithId = Children.map(children, child => {
    if (isValidElement(child)) {
      const typedChild = child as React.ReactElement<{ id?: string }>;
      return cloneElement(typedChild, {
        id: typedChild.props.id || inputId
      });
    }
    return child;
  });

  return (
    <div className={containerClasses}>
      {label && (
        <label htmlFor={inputId} className={labelClasses}>
          {label}
        </label>
      )}
      
      <div className="form-field__control">
        {childrenWithId}
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
