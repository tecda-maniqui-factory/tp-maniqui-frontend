import { useState, useCallback, ChangeEvent, FormEvent, use } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { AuthContext } from '@/context/AuthContext';
import { NotificationContext } from '@/context/NotificationContext';;
import { authService } from '../api/authService';

/**
 * Holds the login form input values.
 */
export interface LoginState {
  /** The username inputted by the user. */
  username: string;
  /** The password inputted by the user. */
  password: string;
}

/**
 * Structure for representing form validation or processing errors.
 */
export interface LoginErrors {
  /** Validation error for the username field. */
  username?: string;
  /** Validation error for the password field. */
  password?: string;
  /** Global form or authentication request error message. */
  form?: string;
}

/**
 * Controller hook for the Login Page.
 * Orchestrates login form state, validations, loading states, API request triggers, and alerts.
 *
 * @returns Object containing form state, errors, loading indicators, event handlers, and translator.
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
