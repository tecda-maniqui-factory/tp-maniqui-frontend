import React, { FC } from 'react';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import { useLoginController } from '../hooks/useLoginController';
import './LoginForm.css';

/**
 * Componente Organismo: LoginForm
 * 
 * Renderiza el formulario de inicio de sesión utilizando átomos estándar (Input, Button).
 * Toda su lógica interna y orquestación de estado está delegada al controlador `useLoginController`.
 * 
 * @component
 * @example
 * return (
 *   <LoginForm />
 * )
 */
export const LoginForm: FC = () => {
  const { formData, errors, isLoading, handlers, t } = useLoginController();

  return (
    <form className="login-form" onSubmit={handlers.handleSubmit} noValidate>
      <h2 className="login-form__title">{t('auth.login.title')}</h2>
      
      <div className="login-form__fields">
        <Input
          name="email"
          type="email"
          label={t('auth.login.email')}
          placeholder={t('auth.login.email_placeholder')}
          iconName="Mail"
          variant="info"
          value={formData.email}
          onChange={handlers.handleChange}
          error={errors.email ? t(errors.email) : undefined}
          isDisabled={isLoading}
        />

        <Input
          name="password"
          type="password"
          label={t('auth.login.password')}
          placeholder={t('auth.login.password_placeholder')}
          iconName="Lock"
          variant="secondary"
          value={formData.password}
          onChange={handlers.handleChange}
          error={errors.password ? t(errors.password) : undefined}
          isDisabled={isLoading}
        />
      </div>

      <div className="login-form__actions">
        <Button 
          type="submit" 
          variant="primary" 
          iconName="LogIn" 
          isDisabled={isLoading}
          className="login-form__submit-btn"
        >
          {isLoading ? '...' : t('auth.login.submit')}
        </Button>
      </div>
    </form>
  );
};
