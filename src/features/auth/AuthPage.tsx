import { FC } from 'react';
import { LoginForm } from './components/LoginForm';
import './AuthPage.css';

/**
 * AuthPage: Orquestador de la feature de autenticación.
 * Sigue la regla de Feature-Based Modularization (FeaturePage.tsx).
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
