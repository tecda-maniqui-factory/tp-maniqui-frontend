import { FC, TextareaHTMLAttributes, useId } from 'react';
import './Textarea.css';

/**
 * Propiedades del componente {@link Textarea}.
 * Hereda todas las propiedades nativas de un elemento HTML `<textarea>`.
 */
export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** 
   * Indica si el campo tiene un error de validación activo, aplicando estilos de borde rojo.
   * @default false
   */
  hasError?: boolean;
}

/**
 * Componente Átomo: Textarea
 * 
 * Área de texto multilínea estilizada según las pautas de diseño de Flat UI.
 * Incluye estados para control de errores de validación, enfoque (focus) e inactividad (disabled).
 * 
 * Se enfoca exclusivamente en el control del campo. Para layouts estructurados
 * con etiquetas (labels) y textos de validación, se recomienda la molécula {@link FormField}.
 * 
 * @param props - Propiedades definidas en {@link TextareaProps}.
 * 
 * @example
 * ```tsx
 * // Textarea simple de observaciones
 * <Textarea placeholder="Escribe aquí las observaciones..." rows={4} onChange={handleChange} />
 * 
 * // Textarea con error de validación
 * <Textarea
 *   placeholder="Descripción obligatoria"
 *   hasError={true}
 *   value={descripcion}
 * />
 * ```
 */
export const Textarea: FC<TextareaProps> = ({
  hasError = false,
  disabled = false,
  className = '',
  id,
  ...props
}) => {
  const generatedId = useId();
  const textareaId = id || generatedId;

  const baseClass = 'textarea';
  const disabledClass = disabled ? `${baseClass}-wrapper--disabled` : '';
  const errorClass = hasError ? `${baseClass}-wrapper--error` : '';
  
  const finalWrapperClass = [`${baseClass}-wrapper`, disabledClass, errorClass, className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={finalWrapperClass}>
      <div className={`${baseClass}__field-container`}>
        <textarea
          id={textareaId}
          className={`${baseClass}__element`}
          disabled={disabled}
          {...props}
        />
      </div>
    </div>
  );
};

export default Textarea;
