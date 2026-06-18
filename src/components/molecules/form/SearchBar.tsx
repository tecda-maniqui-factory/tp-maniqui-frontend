import { FC, ChangeEvent, FormEvent, useState } from 'react';
import Input from '@/components/atoms/form/Input';
import Button from '@/components/atoms/form/Button';
import './SearchBar.css';

/**
 * Propiedades del componente {@link SearchBar}.
 */
export interface SearchBarProps {
  /** 
   * Texto de sugerencia o marcador de posición que se muestra dentro del input.
   * @default "Buscar..."
   */
  placeholder?: string;
  /** 
   * Función callback opcional que se ejecuta al enviar el formulario (Submit) o presionar Enter.
   * Devuelve el texto ingresado en el input.
   */
  onSearch?: (value: string) => void;
  /** Clase CSS adicional para ajustar el margen o la alineación de la barra de búsqueda. */
  className?: string;
}

/**
 * Componente Molécula: SearchBar
 * 
 * Barra de búsqueda modular que integra un campo de texto {@link Input} con un icono de lupa,
 * y un botón de confirmación {@link Button} compacto de envío.
 * Utiliza un elemento `<form>` nativo para interceptar la acción de búsqueda al presionar "Enter".
 * 
 * @param props - Propiedades definidas en {@link SearchBarProps}.
 * 
 * @example
 * ```tsx
 * // Barra de búsqueda simple con callback
 * <SearchBar 
 *   placeholder="Buscar órdenes de producción..." 
 *   onSearch={(query) => console.log('Buscando:', query)} 
 * />
 * ```
 */
export const SearchBar: FC<SearchBarProps> = ({
  placeholder = "Buscar...",
  onSearch,
  className = ''
}) => {
  const [value, setValue] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch?.(value);
  };

  return (
    <form className={`search-bar ${className}`} onSubmit={handleSubmit}>
      <div className="search-bar__input-wrapper">
        <Input 
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          iconName="Search"
          variant="info"
        />
      </div>
      <div className="search-bar__button">
        <Button 
          type="submit" 
          variant="primary" 
          isCompact 
          iconName="ArrowRight"
        />
      </div>
    </form>
  );
};

export default SearchBar;
