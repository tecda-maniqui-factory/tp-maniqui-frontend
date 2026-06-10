import { FC } from 'react';
import { Input, Button, Spinner } from '@/components/atoms';
import { FormField, Card, Alert } from '@/components/molecules';
import { useLoginController } from '../hooks/useLoginController';
import './LoginForm.css';

/**
 * Componente Organismo: LoginForm
 * 
 * Implementación optimizada con FormField (Molécula) para la gestión de errores y etiquetas.
 * Utiliza Card (Molécula) para el contenedor siguiendo reglas de composición.
 * Integra Spinner (Átomo) para indicar estados de carga y Alert para errores globales.
 */
export const LoginForm: FC = () => {
  const { formData, errors, isLoading, handlers, t } = useLoginController();

  const footer = (
    <Button 
      type="submit" 
      variant="primary" 
      iconName={!isLoading ? "LogIn" : undefined}
      isDisabled={isLoading}
      className="login-form__submit-btn"
    >
      {isLoading ? <Spinner size={20} variant="info" /> : t('auth.login.submit')}
    </Button>
  );

  return (
    <form className="login-form" onSubmit={handlers.handleSubmit} noValidate>
      <Card title={t('auth.login.title')} footer={footer}>
        <div className="login-form__fields">
          {errors.form && (
            <Alert variant="danger" className="login-form__alert">
              {t(errors.form)}
            </Alert>
          )}

          <FormField 
            label={t('auth.login.username')} 
            error={errors.username ? t(errors.username) : undefined}
            required
          >
            <Input
              name="username"
              type="text"
              placeholder={t('auth.login.username_placeholder')}
              iconName="User"
              variant="info"
              value={formData.username}
              onChange={handlers.handleChange}
              hasError={!!errors.username}
              disabled={isLoading}
            />
          </FormField>

          <FormField 
            label={t('auth.login.password')} 
            error={errors.password ? t(errors.password) : undefined}
            required
          >
            <Input
              name="password"
              type="password"
              placeholder={t('auth.login.password_placeholder')}
              iconName="Lock"
              variant="secondary"
              value={formData.password}
              onChange={handlers.handleChange}
              hasError={!!errors.password}
              disabled={isLoading}
            />
          </FormField>
        </div>
      </Card>
    </form>
  );
};
