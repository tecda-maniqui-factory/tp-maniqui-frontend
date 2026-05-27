import { useCallback } from 'react';

// Diccionario temporal (mock) para cumplir con la regla de i18n
const translations: Record<string, string> = {
  'auth.login.title': 'Iniciar Sesión',
  'auth.login.email': 'Correo Electrónico',
  'auth.login.email_placeholder': 'ejemplo@correo.com',
  'auth.login.password': 'Contraseña',
  'auth.login.password_placeholder': 'Ingresa tu contraseña',
  'auth.login.submit': 'Entrar',
  'auth.error.required': 'Este campo es obligatorio',
  'auth.error.invalid_email': 'Correo no válido'
};

export const useLanguage = () => {
  const t = useCallback((key: string): string => {
    // Retorna la traducción o la misma clave si no existe (cumpliendo la regla sin fallbacks hardcodeados en los componentes)
    return translations[key] || key; 
  }, []);

  return { t };
};
