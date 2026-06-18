import { FC } from 'react';
import { LoginForm } from './components/LoginForm';
import './AuthPage.css';

/**
 * Página de Autenticación (`AuthPage`).
 * 
 * Orquestador principal de la vista de autenticación de la aplicación.
 * Sigue el patrón de Feature-Based Modularization, sirviendo como contenedor de página.
 * Renderiza el formulario de inicio de sesión {@link LoginForm}.
 * 
 * @example
 * ```tsx
 * import { AuthPage } from './features/auth/AuthPage';
 * 
 * const AppRouter = () => (
 *   <Route path="/login" element={<AuthPage />} />
 * );
 * ```
 */
export const AuthPage: FC = () => {
  return (
    <div className="auth-page">
      <div className="auth-page__container">
        <LoginForm />
      </div>
    </div>
  );
};
