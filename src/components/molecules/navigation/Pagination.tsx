import { FC } from 'react';
import Button from '@/components/atoms/form/Button';;
import './Pagination.css';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

/**
 * Molécula: Pagination
 * 
 * Controles de navegación para listados paginados.
 */
const Pagination: FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = ''
}) => {
  if (totalPages <= 1) return null;

  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  // Generar array de páginas a mostrar (lógica simplificada)
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className={`pagination ${className}`} aria-label="Navegación de páginas">
      <Button 
        variant="secondary" 
        iconName="ChevronLeft" 
        isCompact 
        disabled={currentPage === 1}
        onClick={handlePrev}
      >
        Anterior
      </Button>

      <ul className="pagination__list">
        {pages.map((page) => (
          <li key={page} className="pagination__item">
            <button
              className={`pagination__page-btn ${currentPage === page ? 'pagination__page-btn--active' : ''}`}
              onClick={() => onPageChange(page)}
              aria-current={currentPage === page ? 'page' : undefined}
            >
              {page}
            </button>
          </li>
        ))}
      </ul>

      <Button 
        variant="secondary" 
        iconName="ChevronRight" 
        isCompact 
        disabled={currentPage === totalPages}
        onClick={handleNext}
      >
        Siguiente
      </Button>

      <div className="pagination__info">
        Página {currentPage} de {totalPages}
      </div>
    </nav>
  );
};

export default Pagination;
