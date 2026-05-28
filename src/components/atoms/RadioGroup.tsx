import { FC, InputHTMLAttributes, useId } from 'react';
import './Radio.css';

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export interface RadioGroupProps {
  name: string;
  options: { value: string; label: string; disabled?: boolean }[];
  value?: string;
  onChange: (value: string) => void;
  orientation?: 'row' | 'column';
  className?: string;
}

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
