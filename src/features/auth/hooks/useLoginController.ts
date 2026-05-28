import { useState, useCallback, ChangeEvent, FormEvent, use } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { AuthContext } from '@/context/AuthContext';
import { NotificationContext } from '@/context/NotificationContext';
import { authService } from '../api/authService';

interface LoginState {
  username: string;
  password: string;
}

interface LoginErrors {
  username?: string;
  password?: string;
  form?: string;
}

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
    } catch (error: any) {
      console.error('Login failed:', error);
      const isNetworkError = error.message === 'Failed to fetch';
      const errorKey = isNetworkError ? 'auth.error.server' : error.message;
      
      setErrors({ form: errorKey });
      notification.showNotification(t(errorKey), 'danger', t('auth.error.title'));
    } finally {
      setIsLoading(false);
    }
  }, [formData, auth]);

  const handlers = {
    handleChange,
    handleSubmit
  };

  return {
    formData,
    errors,
    isLoading,
    handlers,
    t
  };
};
