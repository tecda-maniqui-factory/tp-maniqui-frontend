import { FC, InputHTMLAttributes, useId } from 'react';
import './Radio.css';

/**
 * Propiedades del componente individual {@link Radio}.
 * Excluye la propiedad nativa 'type' ya que está fija en 'radio'.
 */
export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Texto descriptivo o etiqueta que se mostrará junto al botón de opción circular. */
  label?: string;
}

/**
 * Propiedades del contenedor {@link RadioGroup}.
 */
export interface RadioGroupProps {
  /** Atributo name de HTML compartido por todos los botones para unificar el grupo de selección. */
  name: string;
  /** Lista de opciones que se renderizarán dentro del grupo. */
  options: { 
    /** Valor de envío del input al estar seleccionado. */
    value: string; 
    /** Texto descriptivo de la opción. */
    label: string; 
    /** Indica si la opción del botón de radio está deshabilitada. */
    disabled?: boolean; 
  }[];
  /** Valor de la opción actualmente seleccionada en el grupo. */
  value?: string;
  /** 
   * Función callback disparada cuando el usuario selecciona una opción diferente.
   * Devuelve el valor de la opción seleccionada.
   */
  onChange: (value: string) => void;
  /** 
   * Orientación del flujo de las opciones (horizontal en fila o vertical en columna).
   * @default 'column'
   */
  orientation?: 'row' | 'column';
  /** Clase CSS adicional para el contenedor del grupo. */
  className?: string;
}

/**
 * Componente Átomo: Radio
 * 
 * Botón de selección circular individual con estética Flat UI.
 * Enlaza de manera accesible la etiqueta (`<label>`) con el control mediante `useId`
 * cuando no se especifica un `id` explícito.
 * 
 * @param props - Propiedades definidas en {@link RadioProps}.
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
 * Componente Átomo: RadioGroup
 * 
 * Contenedor que agrupa y coordina múltiples botones de opción {@link Radio}.
 * Sincroniza la selección única y administra la orientación visual de forma responsiva.
 * 
 * @param props - Propiedades definidas en {@link RadioGroupProps}.
 * 
 * @example
 * ```tsx
 * const [genero, setGenero] = useState('Masculino');
 * 
 * const opciones = [
 *   { value: 'Masculino', label: 'Masculino' },
 *   { value: 'Femenino', label: 'Femenino' },
 *   { value: 'Unisex', label: 'Unisex', disabled: true }
 * ];
 * 
 * <RadioGroup
 *   name="sexo_maniqui"
 *   options={opciones}
 *   value={genero}
 *   onChange={setGenero}
 *   orientation="row"
 * />
 * ```
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
