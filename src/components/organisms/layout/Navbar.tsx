import { FC } from 'react';
import Icon from '@/components/atoms/display/Icon';
import './Navbar.css';

/**
 * Propiedades del componente {@link Navbar}.
 */
export interface NavbarProps {
  /** Nombre del usuario autenticado que se mostrará en la esquina derecha. */
  userName?: string;
  /** Título principal de la aplicación o sección actual mostrado a la izquierda. */
  title?: string;
  /** Función callback opcional para alternar la visibilidad de la barra lateral (sidebar) en móviles. */
  onMenuToggle?: () => void;
  /** Función callback opcional que se ejecuta al presionar el botón de cierre de sesión. */
  onLogout?: () => void;
}

/**
 * Componente Organismo: Navbar
 * 
 * Barra de navegación superior principal (encabezado/header).
 * Muestra el logotipo de la aplicación, el título del panel actual, el nombre del usuario
 * autenticado y botones interactivos para alternar el menú móvil y cerrar la sesión.
 * 
 * @param props - Propiedades definidas en {@link NavbarProps}.
 * 
 * @example
 * ```tsx
 * <Navbar
 *   title="Panel de Producción"
 *   userName="Juan Pérez"
 *   onMenuToggle={toggleSidebar}
 *   onLogout={handleLogout}
 * />
 * ```
 */
export const Navbar: FC<NavbarProps> = ({
  userName = 'Usuario',
  title = 'TP Maniquí',
  onMenuToggle,
  onLogout
}) => {
  return (
    <header className="navbar">
      <div className="navbar__left">
        {onMenuToggle && (
          <button className="navbar__menu-btn" onClick={onMenuToggle} aria-label="Toggle menu">
            <Icon name="Menu" />
          </button>
        )}
        <div className="navbar__brand">
          <Icon name="Activity" className="navbar__logo" />
          <h1 className="navbar__title">{title}</h1>
        </div>
      </div>

      <div className="navbar__right">
        <div className="navbar__user-info">
          <div className="navbar__avatar">
            <Icon name="User" />
          </div>
          <span className="navbar__username">{userName}</span>
        </div>

        {onLogout && (
          <button className="navbar__logout-btn" onClick={onLogout} aria-label="Cerrar sesión">
            <Icon name="LogOut" />
          </button>
        )}
      </div>
    </header>
  );
};

export default Navbar;
