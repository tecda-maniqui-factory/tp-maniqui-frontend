import { FC, TextareaHTMLAttributes, useId } from 'react';
import './Textarea.css';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Estado de error visual */
  hasError?: boolean;
}

/**
 * Componente Átomo: Textarea
 * Solo el campo multilínea.
 */
const Textarea: FC<TextareaProps> = ({
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
