import { FC, InputHTMLAttributes, useId } from 'react';
import './Radio.css';

/**
 * Props for the individual Radio option component.
 */
export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Optional display label for this radio option. */
  label?: string;
}

/**
 * Props for the RadioGroup container component.
 */
export interface RadioGroupProps {
  /** Name attribute shared by the radio inputs for grouping. */
  name: string;
  /** List of options to render in the group. */
  options: { value: string; label: string; disabled?: boolean }[];
  /** Current selected value. */
  value?: string;
  /** Callback triggered when a radio option selection changes. */
  onChange: (value: string) => void;
  /** Layout orientation. */
  orientation?: 'row' | 'column';
  /** Optional additional CSS class. */
  className?: string;
}

/**
 * Atom Component: Radio
 * Individual circular option selector (Radio button) with Flat UI styling.
 */
export const Radio: FC<RadioProps> = ({ label, className = '', id, ...props }) => {
  const generatedId = useId();
  const radioId = id || generatedId;

  return (
    <label className={`radio ${props.disabled ? 'radio--disabled' : ''} ${className}`} htmlFor={radioId}>
      <div className="radio__container">
        <input type="radio" id={radioId} className="radio__input" {...props} />
        <div className="radio__custom" />
      </div>
      {label && <span className="radio__label">{label}</span>}
    </label>
  );
};

/**
 * Atom Component: RadioGroup
 * Group container that coordinates multiple individual Radio button options.
 */
export const RadioGroup: FC<RadioGroupProps> = ({
  name,
  options,
  value,
  onChange,
  orientation = 'column',
  className = ''
}) => {
  return (
    <div className={`radio-group radio-group--${orientation} ${className}`}>
      {options.map((opt) => (
        <Radio
          key={opt.value}
          name={name}
          label={opt.label}
          value={opt.value}
          checked={value === opt.value}
          disabled={opt.disabled}
          onChange={(e) => onChange(e.target.value)}
        />
      ))}
    </div>
  );
};
