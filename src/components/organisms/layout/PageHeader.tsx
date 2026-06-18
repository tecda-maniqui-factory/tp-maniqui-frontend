import { FC, ReactNode } from 'react';
import './PageHeader.css';

/**
 * Props for the PageHeader component.
 */
export interface PageHeaderProps {
  /** The primary page title. */
  title: string;
  /** Optional secondary description/sub-header text. */
  description?: string;
  /** Optional actions (e.g. Buttons) to render on the right side. */
  actions?: ReactNode;
  /** Additional custom CSS class name. */
  className?: string;
}

/**
 * Organismo: PageHeader
 * 
 * Encabezado estandarizado para las páginas del ERP.
 * Separa la información del título de las acciones de la página.
 */
const PageHeader: FC<PageHeaderProps> = ({
  title,
  description,
  actions,
  className = ''
}) => {
  return (
    <header className={`page-header ${className}`}>
      <div className="page-header__info">
        <h1 className="page-header__title">{title}</h1>
        {description && <p className="page-header__description">{description}</p>}
      </div>
      
      {actions && (
        <div className="page-header__actions">
          {actions}
        </div>
      )}
    </header>
  );
};

export default PageHeader;
