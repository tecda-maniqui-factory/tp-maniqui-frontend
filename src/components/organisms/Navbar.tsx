import React, { FC } from 'react';
import Icon from '../atoms/Icon';
import './Navbar.css';

export interface NavbarProps {
  /** Nombre del usuario o título de la aplicación a mostrar en la barra */
  title?: string;
  /** Función para manejar el clic en el botón de hamburguesa (para abrir/cerrar sidebar) */
  onMenuToggle?: () => void;
  /** Función para manejar el cierre de sesión */
  onLogout?: () => void;
}

/**
 * Componente Organismo: Navbar
 * Barra de navegación superior (Header).
 */
const Navbar: FC<NavbarProps> = ({
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
          <span className="navbar__username">Administrador</span>
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
