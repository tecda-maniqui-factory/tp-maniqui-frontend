import { FC } from 'react';
import Icon from '@/components/atoms/display/Icon';;
import { icons } from 'lucide-react';
import './Sidebar.css';

/**
 * Structure representing an item in the sidebar navigation.
 */
export interface SidebarItem {
  /** The unique route path/ID associated with this item. */
  id: string;
  /** The display label for the item. */
  label: string;
  /** Lucide icon name. */
  icon: keyof typeof icons;
  /** Indicates if this item is currently active. */
  isActive?: boolean;
}

/**
 * Props for the Sidebar component.
 */
export interface SidebarProps {
  /** Indicates if the sidebar is open/expanded. */
  isOpen: boolean;
  /** List of navigation items. */
  items: SidebarItem[];
  /** Callback triggered when a sidebar item is clicked. */
  onSelect: (id: string) => void;
  /** Optional callback to close/collapse the sidebar. */
  onClose?: () => void;
}

/**
 * Componente Organismo: Sidebar
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
