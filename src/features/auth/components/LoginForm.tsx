import { FC } from 'react';
import Input from '@/components/atoms/form/Input';
import Button from '@/components/atoms/form/Button';
import Spinner from '@/components/atoms/feedback/Spinner';;
import FormField from '@/components/molecules/form/FormField';
import Card from '@/components/molecules/display/Card';
import Alert from '@/components/molecules/feedback/Alert';;
import { useLoginController } from '../hooks/useLoginController';
import { CredentialOverlay } from './CredentialOverlay';
import './LoginForm.css';

/**
 * Componente Organismo: `LoginForm`
 * 
 * Formulario de inicio de sesión de la aplicación.
 * Implementación optimizada con {@link FormField} para la gestión de errores y etiquetas descriptivas,
 * {@link Card} para estructurar visualmente el contenedor y {@link Input}/{@link Button} para la interactividad.
 * 
 * Consume la lógica de negocio y estado mediante el hook de control {@link useLoginController}
 * e incluye el panel {@link CredentialOverlay} para completar credenciales rápidamente.
 * 
 * @example
 * ```tsx
 * import { LoginForm } from './components/LoginForm';
 * 
 * const LoginView = () => (
 *   <div className="login-view-container">
 *     <LoginForm />
 *   </div>
 * );
 * ```
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
    <div style={{ width: '100%' }}>
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
      <CredentialOverlay onSelect={handlers.fillCredentials} />
    </div>
  );
};
