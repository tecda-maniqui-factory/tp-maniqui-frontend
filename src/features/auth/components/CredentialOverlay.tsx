import { FC } from 'react';
import Icon from '@/components/atoms/display/Icon';
import './CredentialOverlay.css';

/**
 * Propiedades del componente {@link CredentialOverlay}.
 */
export interface CredentialOverlayProps {
  /** Función callback que se ejecuta al seleccionar una opción de credencial rápida. */
  onSelect: (username: string, pass: string) => void;
}

/**
 * Componente: CredentialOverlay
 * 
 * Muestra credenciales rápidas de prueba en entornos de desarrollo/demo para facilitar
 * el inicio de sesión con diferentes roles de usuario (Gerente, Operario, Vendedor).
 * 
 * @example
 * ```tsx
 * import { CredentialOverlay } from './components/CredentialOverlay';
 * 
 * const LoginForm = () => {
 *   const fillCredentials = (user: string, pass: string) => {
 *     setUsername(user);
 *     setPassword(pass);
 *   };
 * 
 *   return (
 *     <div>
 *       <CredentialOverlay onSelect={fillCredentials} />
 *     </div>
 *   );
 * };
 * ```
 */
export const CredentialOverlay: FC<CredentialOverlayProps> = ({ onSelect }) => {
  const credentials = [
    {
      role: 'Gerente (Administración)',
      user: 'gerente',
      pass: 'gerente',
      icon: 'Shield',
      variant: 'gerente'
    },
    {
      role: 'Operario (Producción)',
      user: 'operario',
      pass: 'operario',
      icon: 'Wrench',
      variant: 'operario'
    },
    {
      role: 'Vendedor (Comercial)',
      user: 'vendedor',
      pass: 'vendedor',
      icon: 'ShoppingBag',
      variant: 'vendedor'
    }
  ];

  return (
    <div className="credential-overlay">
      <div className="credential-overlay__title">
        <Icon name="Key" size={16} />
        <span>Credenciales rápidas de prueba</span>
      </div>
      <div className="credential-overlay__list">
        {credentials.map((cred) => (
          <button
            key={cred.user}
            type="button"
            className={`credential-overlay__item credential-overlay__item--${cred.variant}`}
            onClick={() => onSelect(cred.user, cred.pass)}
            title={`Click para rellenar como ${cred.role}`}
          >
            <div className="credential-overlay__item-header">
              <Icon name={cred.icon as any} size={14} />
              <span className="credential-overlay__role">{cred.role}</span>
            </div>
            <div className="credential-overlay__details">
              <span className="credential-overlay__detail">
                <strong>User:</strong> {cred.user}
              </span>
              <span className="credential-overlay__detail">
                <strong>Pass:</strong> {cred.pass}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
