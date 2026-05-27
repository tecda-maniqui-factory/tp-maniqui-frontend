import { useState, useCallback, ChangeEvent, FormEvent } from 'react';
import { useLanguage } from '@/hooks/useLanguage';

/**
 * Interfaz que define la estructura del estado del formulario de login.
 */
interface LoginState {
  email: string;
  password: string;
}

/**
 * Interfaz que define los posibles errores de validación del formulario.
 */
interface LoginErrors {
  email?: string;
  password?: string;
}

/**
 * Controlador (Custom Hook) para el caso de uso de Iniciar Sesión.
 * Encapsula la lógica de estado, validación y envío (simulación API),
 * manteniendo la vista (LoginForm) 100% libre de lógica de negocio.
 *
 * @returns {Object} Estado actual, errores, estado de carga y funciones manejadoras.
 */
export const useLoginController = () => {
  const { t } = useLanguage();
  
  const [formData, setFormData] = useState<LoginState>({ email: '', password: '' });
  const [errors, setErrors] = useState<LoginErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Manejador de cambios en los inputs.
   * Actualiza el estado del formulario y, cumpliendo las reglas de arquitectura,
   * limpia el error del campo específico apenas el usuario interactúa con él.
   *
   * @param {ChangeEvent<HTMLInputElement>} e - Evento de cambio del input nativo.
   */
  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
  }, []);

  /**
   * Manejador del envío del formulario.
   * Ejecuta validaciones síncronas antes de simular la llamada a la API.
   *
   * @param {FormEvent} e - Evento de envío del formulario.
   */
  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    const newErrors: LoginErrors = {};

    // Validaciones
    if (!formData.email) {
      newErrors.email = 'auth.error.required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'auth.error.invalid_email';
    }
    
    if (!formData.password) {
      newErrors.password = 'auth.error.required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    // Simulación de API
    setTimeout(() => {
      alert(`Login exitoso con: ${formData.email}`);
      setIsLoading(false);
    }, 1500);
  }, [formData]);

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
