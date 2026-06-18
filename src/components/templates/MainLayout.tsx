import { FC, ReactNode, useState } from 'react';
import Navbar from '@/components/organisms/layout/Navbar';
import Sidebar, { SidebarItem } from '@/components/organisms/layout/Sidebar';
import { useAuth } from '@/hooks/useAuth';
import { ENV } from '@/config/env.config';
import './MainLayout.css';

/**
 * Propiedades del componente {@link MainLayout}.
 */
export interface MainLayoutProps {
  /** El contenido principal de la página actual que se renderizará en el centro. */
  children: ReactNode;
  /** Listado de opciones de navegación para la barra lateral. */
  sidebarItems: SidebarItem[];
  /** Título del encabezado de navegación (Navbar). Por defecto usa `ENV.APP_NAME`. */
  title?: string;
  /** Función callback ejecutada al seleccionar una opción del Sidebar. */
  onSidebarItemSelect?: (id: string) => void;
  /** Función callback ejecutada al hacer clic en el botón de cerrar sesión. */
  onLogout?: () => void;
}

/**
 * Componente Template: MainLayout
 * 
 * Orquestador y estructura visual principal de la interfaz de usuario del ERP.
 * Define la rejilla (grid) general, incluyendo la barra de navegación superior (Navbar),
 * la barra lateral responsiva (Sidebar) y el área de contenido principal. Controla el estado
 * de despliegue/cierre de la barra lateral dependiendo del tamaño de pantalla (Mobile/Desktop).
 * 
 * @param props - Propiedades definidas en {@link MainLayoutProps}.
 * 
 * @example
 * ```tsx
 * const items = [
 *   { id: 'home', label: 'Inicio', icon: 'Home', isActive: true },
 *   { id: 'settings', label: 'Configuración', icon: 'Settings' }
 * ];
 * 
 * <MainLayout
 *   sidebarItems={items}
 *   onSidebarItemSelect={(id) => navigate(id)}
 *   onLogout={logout}
 * >
 *   <DashboardView />
 * </MainLayout>
 * ```
 */
export const MainLayout: FC<MainLayoutProps> = ({
  children,
  sidebarItems,
  title = ENV.APP_NAME,
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
    
    console.log('RUTA', onSidebarItemSelect,id)
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
