import React, { FC } from 'react';
import Icon from '../atoms/Icon';
import './Sidebar.css';

export interface SidebarItem {
  id: string;
  label: string;
  icon: keyof typeof icons;
  isActive?: boolean;
}

export interface SidebarProps {
  /** Indica si la barra lateral está abierta (importante en móviles) */
  isOpen: boolean;
  /** Lista de enlaces de navegación */
  items: SidebarItem[];
  /** Función que se ejecuta al seleccionar un elemento */
  onSelect: (id: string) => void;
  /** Función para cerrar la barra (en móviles) */
  onClose?: () => void;
}

/**
 * Componente Organismo: Sidebar
 * Barra de navegación lateral típica de un Dashboard (Layout).
 */
const Sidebar: FC<SidebarProps> = ({
  isOpen,
  items,
  onSelect,
  onClose
}) => {
  const baseClass = 'sidebar';
  
  return (
    <>
      {/* Overlay oscuro solo visible en móviles cuando está abierto */}
      {isOpen && <div className={`${baseClass}-overlay`} onClick={onClose} />}
      
      <aside className={`${baseClass} ${isOpen ? `${baseClass}--open` : ''}`}>
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
