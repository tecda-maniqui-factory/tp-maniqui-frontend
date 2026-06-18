import { FC } from 'react';
import Icon from '@/components/atoms/display/Icon';;
import './Navbar.css';

/**
 * Props for the Navbar component.
 */
export interface NavbarProps {
  /** Name of the authenticated user to display. */
  userName?: string;
  /** Title text shown in the header. */
  title?: string;
  /** Optional callback to toggle the mobile menu sidebar. */
  onMenuToggle?: () => void;
  /** Optional callback to trigger logout. */
  onLogout?: () => void;
}

/**
* Componente Organismo: Navbar
 * Barra de navegación superior (Header).
*/
const Navbar: FC<NavbarProps> = ({
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
