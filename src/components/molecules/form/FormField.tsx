import { FC, ReactNode, useId, Children, isValidElement, cloneElement } from 'react';
import './FormField.css';

/**
 * Props para el componente {@link FormField}.
 */
export interface FormFieldProps {
  /** Texto opcional para la etiqueta que se muestra arriba del control de formulario. */
  label?: string;
  /** Mensaje de error de validación. Si se define, el campo adopta el estilo de error visual. */
  error?: string;
  /** Texto de ayuda/guía opcional que se muestra cuando no hay error. */
  helperText?: string;
  /** Si es true, añade un indicador visual de obligatoriedad a la etiqueta. */
  required?: boolean;
  /** El elemento de control de formulario hijo (ej. {@link Input}, {@link Select}, {@link Textarea}). */
  children: ReactNode;
  /** Clase CSS personalizada adicional. */
  className?: string;
  /** ID para asociar explícitamente el label con el control hijo. Si se omite, se autogenera uno único. */
  htmlFor?: string;
}

/**
 * Molécula que encapsula la lógica visual de un campo de formulario.
 * 
 * Unifica la etiqueta de texto (Label), el control de formulario hijo (como {@link Input})
 * y el mensaje de error o ayuda. Genera de forma automatizada IDs únicos mediante `useId`
 * para garantizar la vinculación accesible entre el label y su control.
 * 
 * @example
 * ```tsx
 * import FormField from './FormField';
 * import Input from '../../atoms/form/Input';
 * 
 * const EmailField = () => (
 *   <FormField 
 *     label="Correo Electrónico" 
 *     required 
 *     error={errors.email}
 *     helperText="Introduce tu correo institucional"
 *   >
 *     <Input type="email" iconName="Mail" placeholder="ejemplo@dominio.com" />
 *   </FormField>
 * );
 * ```
 * 
 * @param props - Props matching {@link FormFieldProps}.
 * @returns Elemento React que estructura el campo de formulario.
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
