import { FC } from 'react';
import Icon from '@/components/atoms/display/Icon';
import { icons } from 'lucide-react';
import './Sidebar.css';

/**
 * Estructura de datos que representa una opción de navegación en la barra lateral.
 */
export interface SidebarItem {
  /** Ruta o identificador único asociado a la opción (ej: "/ventas" o "sales"). */
  id: string;
  /** Texto legible que se mostrará en el menú lateral. */
  label: string;
  /** Nombre del icono de Lucide que acompañará al texto. */
  icon: keyof typeof icons;
  /** Indica si la opción de menú se encuentra actualmente activa o seleccionada. */
  isActive?: boolean;
}

/**
 * Propiedades del componente {@link Sidebar}.
 */
export interface SidebarProps {
  /** Indica si la barra lateral móvil está desplegada o visible. */
  isOpen: boolean;
  /** Listado de opciones de navegación a renderizar. */
  items: SidebarItem[];
  /** Función callback que se activa al hacer clic en una opción de menú, recibiendo su identificador. */
  onSelect: (id: string) => void;
  /** Función callback opcional para cerrar o colapsar la barra lateral (generalmente en móviles). */
  onClose?: () => void;
}

/**
 * Componente Organismo: Sidebar
 * 
 * Barra lateral de navegación principal de la aplicación.
 * Provee un menú lateral colapsable y responsivo con enlaces representados por iconos y etiquetas.
 * Incluye un overlay de fondo oscuro (backdrop) para colapsarse automáticamente en resoluciones móviles.
 * 
 * @param props - Propiedades definidas en {@link SidebarProps}.
 * 
 * @example
 * ```tsx
 * const menuItems = [
 *   { id: 'dashboard', label: 'Inicio', icon: 'LayoutDashboard', isActive: true },
 *   { id: 'produccion', label: 'Producción', icon: 'Hammer' },
 *   { id: 'comercial', label: 'Ventas', icon: 'DollarSign' }
 * ];
 * 
 * <Sidebar
 *   isOpen={isSidebarOpen}
 *   items={menuItems}
 *   onSelect={(id) => handleNavigate(id)}
 *   onClose={toggleSidebar}
 * />
 * ```
 */
export const Sidebar: FC<SidebarProps> = ({
  isOpen,
  items,
  onSelect,
  onClose
}) => {
  const baseClass = 'sidebar';
  
  return (
    <>
      {/* Overlay oscuro para móviles */}
      <div 
        className={`${baseClass}-overlay ${isOpen ? 'sidebar-overlay--open' : ''}`} 
        onClick={onClose} 
      />
      
      <aside className={baseClass}>
        <nav className={`${baseClass}__nav`}>
          <ul className={`${baseClass}__list`}>
            {items.map((item) => (
              <li key={item.id} className={`${baseClass}__item`}>
                <button
                  className={`${baseClass}__link ${item.isActive ? `${baseClass}__link--active` : ''}`}
                  onClick={() => onSelect(item.id)}
                >
                  <Icon name={item.icon} className={`${baseClass}__icon`} />
                  <span className={`${baseClass}__label`}>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
