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
  const { token, logout } = useAuth();
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
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      
      if (errorMessage === 'auth.error.session_expired') {
        logout();
        return;
      }

      const msg = t(errorMessage);
      setError(msg);
      notify(msg, 'danger', t('production.error.title'));
    } finally {
      setIsLoading(false);
    }
  }, [token, logout, notify, t]);

  useEffect(() => {
    let isMounted = true;
    
    const loadData = async () => {
      if (isMounted) {
        await fetchManiquies();
      }
    };

    loadData();
    
    return () => {
      isMounted = false;
    };
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
