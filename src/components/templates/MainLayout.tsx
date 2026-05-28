import { FC, ReactNode, useState } from 'react';
import Navbar from '../organisms/Navbar';
import Sidebar, { SidebarItem } from '../organisms/Sidebar';
import { useAuth } from '@/hooks/useAuth';
import './MainLayout.css';

export interface MainLayoutProps {
  children: ReactNode;
  sidebarItems: SidebarItem[];
  title?: string;
  onSidebarItemSelect?: (id: string) => void;
  onLogout?: () => void;
}

/**
 * Template: MainLayout
 * 
 * Orquestador principal de la interfaz del ERP.
 * Maneja el estado del Sidebar (Abierto/Cerrado) para Desktop y Mobile.
 */
const MainLayout: FC<MainLayoutProps> = ({
  children,
  sidebarItems,
  title = "Tecda Maniquí ERP",
  onSidebarItemSelect,
  onLogout
}) => {
  // Por defecto abierto en Desktop, cerrado en Mobile
  const [isOpen, setIsOpen] = useState(window.innerWidth > 768);
  const { user } = useAuth();

  // Resolución de nombre dinámica basada en los datos del usuario
  const displayName = user?.username || user?.name || user?.email || 'Usuario';

  const handleMenuToggle = () => setIsOpen(!isOpen);
  const handleSidebarClose = () => setIsOpen(false);

  const handleSelect = (id: string) => {
    onSidebarItemSelect?.(id);
    if (window.innerWidth <= 768) {
      setIsOpen(false);
    }
  };

  return (
    <div className="main-layout">
      <header className="main-layout__header">
        <Navbar 
          title={title} 
          userName={displayName}
          onMenuToggle={handleMenuToggle}
          onLogout={onLogout}
        />
      </header>
      
      <div className="main-layout__body">
        <aside className={`main-layout__sidebar ${isOpen ? 'main-layout__sidebar--open' : 'main-layout__sidebar--closed'}`}>
          <Sidebar 
            isOpen={isOpen} 
            items={sidebarItems} 
            onSelect={handleSelect}
            onClose={handleSidebarClose}
          />
        </aside>

        <main className="main-layout__content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
