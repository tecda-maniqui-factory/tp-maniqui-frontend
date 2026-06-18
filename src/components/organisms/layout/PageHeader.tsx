import { FC, ReactNode } from 'react';
import './PageHeader.css';

/**
 * Propiedades del componente {@link PageHeader}.
 */
export interface PageHeaderProps {
  /** El título principal de la página (ej: "Clientes", "Reportes"). */
  title: string;
  /** Descripción secundaria u opcional de la página. */
  description?: string;
  /** Componentes o botones de acción opcionales que se ubican en la parte derecha del encabezado. */
  actions?: ReactNode;
  /** Clase CSS adicional para personalizar los estilos del contenedor. */
  className?: string;
}

/**
 * Componente Organismo: PageHeader
 * 
 * Encabezado estandarizado para las páginas del sistema.
 * Agrupa la información de cabecera (título y descripción) y las acciones globales
 * de la vista (como botones para agregar nuevos elementos) en un diseño flexible y responsivo.
 * 
 * @param props - Propiedades que cumplen con {@link PageHeaderProps}.
 * 
 * @example
 * ```tsx
 * <PageHeader
 *   title="Gestión de Clientes"
 *   description="Administra los clientes y sus cuentas asociadas en el sistema."
 *   actions={
 *     <Button variant="success" iconName="Plus" onClick={openCreateModal}>
 *       Nuevo Cliente
 *     </Button>
 *   }
 * />
 * ```
 */
export const PageHeader: FC<PageHeaderProps> = ({
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
