import { FC, ChangeEvent, FormEvent, useState } from 'react';
import Input from '@/components/atoms/form/Input';
import Button from '@/components/atoms/form/Button';;
import './SearchBar.css';

/**
 * Props for the SearchBar component.
 */
export interface SearchBarProps {
  /** Optional placeholder text inside the input. */
  placeholder?: string;
  /** Optional callback triggered with the search query upon submission. */
  onSearch?: (value: string) => void;
  /** Optional custom CSS class name. */
  className?: string;
}

/**
 * Molécula: SearchBar
 * 
 * Combina el átomo Input con funcionalidad de búsqueda.
 */
const SearchBar: FC<SearchBarProps> = ({
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
