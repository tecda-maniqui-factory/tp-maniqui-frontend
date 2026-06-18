import { FC, ReactNode, useId, Children, isValidElement, cloneElement } from 'react';
import './FormField.css';

/**
 * Propiedades del componente {@link FormField}.
 */
export interface FormFieldProps {
  /** Texto opcional para la etiqueta que se muestra arriba del control de formulario. */
  label?: string;
  /** Mensaje de error de validación. Si se define, aplica estilos visuales de advertencia y se renderiza en rojo. */
  error?: string;
  /** Texto de ayuda/guía opcional que se muestra debajo del control (solo si no hay error activo). */
  helperText?: string;
  /** 
   * Si es `true`, añade un asterisco rojo indicador de obligatoriedad junto a la etiqueta.
   * @default false
   */
  required?: boolean;
  /** 
   * El elemento de control de formulario hijo. 
   * Típicamente un componente {@link Input}, {@link Select} o {@link Textarea}.
   */
  children: ReactNode;
  /** Clase CSS personalizada para definir márgenes o dimensiones externas. */
  className?: string;
  /** 
   * Identificador explícito para vincular el label con el control hijo. 
   * Si se omite, se autogenera un ID único y accesible usando `useId`.
   */
  htmlFor?: string;
}

/**
 * Componente Molécula: FormField
 * 
 * Contenedor estructurado de control de formulario. Encapsula y alinea de forma accesible:
 * - Una etiqueta descriptiva (`<label>`).
 * - Un componente de entrada de datos hijo (como {@link Input}, {@link Select} o {@link Textarea}).
 * - Mensajes contextuales dinámicos (errores de validación o textos de ayuda).
 * 
 * Genera automáticamente enlaces de identificación (`id`/`htmlFor`) mediante `useId` y
 * el clonado de elementos React en caso de que no se provean de forma manual.
 * 
 * @param props - Propiedades definidas en {@link FormFieldProps}.
 * 
 * @example
 * ```tsx
 * // 1. Campo de texto obligatorio con icono
 * <FormField 
 *   label="Nombre de Usuario" 
 *   required 
 *   helperText="Debe ser único en el sistema"
 * >
 *   <Input placeholder="Ingrese username" iconName="User" />
 * </FormField>
 * 
 * // 2. Selector desplegable con error de validación activo
 * <FormField 
 *   label="Rol de Acceso" 
 *   error="Debes seleccionar un rol válido"
 * >
 *   <Select 
 *     options={roles} 
 *     placeholder="Seleccione..." 
 *     hasError={true} 
 *   />
 * </FormField>
 * ```
 */
export const FormField: FC<FormFieldProps> = ({
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
