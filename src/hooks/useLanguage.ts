import { useState, useCallback } from 'react';
import { translations } from '@/locales/es';

/**
 * Hook personalizado para gestionar las traducciones y la localización del ERP.
 * 
 * Actualmente provee traducción estática basada en un diccionario en español.
 * Retorna una función de traducción `t` y el idioma activo `lang`.
 * 
 * @returns Un objeto con la función de traducción `t` y el idioma activo `lang`.
 * 
 * @example
 * ```tsx
 * import { useLanguage } from '@/hooks/useLanguage';
 * 
 * const Title = () => {
 *   const { t } = useLanguage();
 *   return <h2>{t('dashboard.title')}</h2>;
 * };
 * ```
 */
export const useLanguage = () => {
  const [lang] = useState('es');

  const t = useCallback((key: string) => {
    return translations[key] || key;
  }, []);

  return { t, lang };
};
