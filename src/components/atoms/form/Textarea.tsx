import { FC, TextareaHTMLAttributes, useId } from 'react';
import './Textarea.css';

/**
 * Props for the Textarea component.
 */
export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Visual error state indicator. */
  hasError?: boolean;
}

/**
 * Atom Component: Textarea
 * Multiline text input field styled with Flat UI aesthetics.
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
