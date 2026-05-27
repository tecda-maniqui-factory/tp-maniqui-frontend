import React, { FC, TextareaHTMLAttributes, useId } from 'react';
import './Textarea.css';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Etiqueta descriptiva del campo */
  label?: string;
  /** Mensaje de error a mostrar debajo del campo */
  error?: string;
  /** Estado deshabilitado explícito */
  isDisabled?: boolean;
}

/**
 * Componente Átomo: Textarea
 * Campo de texto multilínea estilo Flat UI.
 */
const Textarea: FC<TextareaProps> = ({
  label,
  error,
  isDisabled = false,
  className = '',
  id,
  ...props
}) => {
  const generatedId = useId();
  const textareaId = id || generatedId;

  const baseClass = 'textarea';
  const disabledClass = isDisabled ? `${baseClass}-wrapper--disabled` : '';
  const errorClass = error ? `${baseClass}-wrapper--error` : '';
  
  const finalWrapperClass = [`${baseClass}-wrapper`, disabledClass, errorClass, className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={finalWrapperClass}>
      {label && (
        <label className={`${baseClass}__label`} htmlFor={textareaId}>
          {label}
        </label>
      )}
      
      <div className={`${baseClass}__field-container`}>
        <textarea
          id={textareaId}
          className={`${baseClass}__element`}
          disabled={isDisabled}
          {...props}
        />
      </div>

      {error && (
        <span className={`${baseClass}__error-message`}>
          {error}
        </span>
      )}
    </div>
  );
};

export default Textarea;
