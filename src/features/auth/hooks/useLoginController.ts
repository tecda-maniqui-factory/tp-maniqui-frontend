import { useState, useCallback, ChangeEvent, FormEvent, use } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { AuthContext } from '@/context/AuthContext';
import { NotificationContext } from '@/context/NotificationContext';;
import { authService } from '../api/authService';

/**
 * Valores de entrada para el formulario de inicio de sesión.
 */
export interface LoginState {
  /** Nombre de usuario ingresado. */
  username: string;
  /** Contraseña ingresada. */
  password: string;
}

/**
 * Errores de validación y de procesamiento del formulario.
 */
export interface LoginErrors {
  /** Error de validación para el campo de nombre de usuario. */
  username?: string;
  /** Error de validación para el campo de contraseña. */
  password?: string;
  /** Mensaje de error global del formulario o de la petición de autenticación. */
  form?: string;
}

/**
 * Hook de control (Controller) para la página de Login.
 * 
 * Orquesta el estado del formulario de inicio de sesión, validaciones locales en caliente,
 * estados de carga, envío de peticiones HTTP mediante {@link authService}, y despacho de notificaciones
 * usando {@link NotificationContext}.
 * 
 * Al completarse con éxito, actualiza el estado de sesión global en {@link AuthContext}.
 * 
 * @example
 * ```tsx
 * import { useLoginController } from '../hooks/useLoginController';
 * 
 * const LoginForm = () => {
 *   const { formData, errors, isLoading, handlers } = useLoginController();
 *   return (
 *     <form onSubmit={handlers.handleSubmit}>
 *       <input name="username" value={formData.username} onChange={handlers.handleChange} />
 *       {errors.username && <span>{errors.username}</span>}
 *       <button type="submit" disabled={isLoading}>Ingresar</button>
 *     </form>
 *   );
 * };
 * ```
 * 
 * @returns Objeto con estado del formulario, errores de validación, indicador de carga, manejadores de eventos y traductor.
 */
export const useLoginController = () => {
  const { t } = useLanguage();
  const auth = use(AuthContext);
  const notification = use(NotificationContext);

  if (!auth || !notification) {
    throw new Error('useLoginController must be used within correct providers');
  }
  
  const [formData, setFormData] = useState<LoginState>({ username: '', password: '' });
  const [errors, setErrors] = useState<LoginErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: undefined, form: undefined }));
  }, []);

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    const newErrors: LoginErrors = {};

    if (!formData.username) {
      newErrors.username = 'auth.error.required';
    }
    
    if (!formData.password) {
      newErrors.password = 'auth.error.required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await authService.login(formData.username, formData.password);
      auth.login(response.token, response.user);
      notification.showNotification(t('auth.success.login'), 'success');
    } catch (error: unknown) {
      console.error('Login failed:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      const isNetworkError = errorMessage === 'Failed to fetch';
      const errorKey = isNetworkError ? 'auth.error.server' : errorMessage;
      
      setErrors({ form: errorKey });
      notification.showNotification(t(errorKey), 'danger', t('auth.error.title'));
    } finally {
      setIsLoading(false);
    }
  }, [formData, auth, notification, t]);

  const fillCredentials = useCallback((username: string, password: string) => {
    setFormData({ username, password });
    setErrors({});
  }, []);

  const handlers = {
    handleChange,
    handleSubmit,
    fillCredentials
  };

  return {
    formData,
    errors,
    isLoading,
    handlers,
    t
  };
};
