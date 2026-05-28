import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNotify } from '@/hooks/useNotify';
import { useLanguage } from '@/hooks/useLanguage';
import { productionService, Maniqui } from '../api/productionService';

/**
 * Controlador para la Feature de Producción.
 * Gestiona el estado de los maniquíes y la sincronización con el servidor.
 */
export const useProductionController = () => {
  const { token } = useAuth();
  const notify = useNotify();
  const { t } = useLanguage();

  const [maniquies, setManiquies] = useState<Maniqui[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchManiquies = useCallback(async () => {
    if (!token) return;
    
    setIsLoading(true);
    try {
      const data = await productionService.getManiquies(token);
      
      // Normalización: Soportar respuesta directa [array] o envuelta { maniquies: [] }
      const list = Array.isArray(data) ? data : (data.maniquies || []);
      
      setManiquies(list);
      setError(null);
    } catch (err: any) {
      const msg = t(err.message);
      setError(msg);
      notify(msg, 'danger', t('production.error.title'));
    } finally {
      setIsLoading(false);
    }
  }, [token, notify, t]);

  useEffect(() => {
    fetchManiquies();
  }, [fetchManiquies]);

  const handlers = {
    handleRefresh: fetchManiquies,
  };

  return {
    maniquies,
    isLoading,
    error,
    handlers,
    t
  };
};
