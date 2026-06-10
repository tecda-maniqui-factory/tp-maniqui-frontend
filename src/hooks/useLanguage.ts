import { useState, useCallback } from 'react';
import { translations } from '@/locales/es';

/**
 * Hook para gestionar las traducciones y el lenguaje de la aplicación.
 */
export const useLanguage = () => {
  const [lang] = useState('es');

  const t = useCallback((key: string) => {
    return translations[key] || key;
  }, []);

  return { t, lang };
};
