import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNotify } from '@/hooks/useNotify';
import { useLanguage } from '@/hooks/useLanguage';
import { productionService, Maniqui } from '../api/productionService';

/**
 * Hook de control (Controller) para la vista principal de Producción.
 * 
 * Se encarga de solicitar y listar los maniquíes ensamblados o en línea de montaje ({@link Maniqui}),
 * administrando de forma centralizada los estados de carga (loading) y propagación de errores.
 * 
 * Se comunica con el servicio {@link productionService} para recuperar datos,
 * {@link useAuth} para validar la sesión y {@link useNotify} para emitir alertas visuales.
 *
 * @example
 * ```tsx
 * import { useProductionController } from './hooks/useProductionController';
 * 
 * const ProduccionDashboard = () => {
 *   const { maniquies, isLoading, handlers } = useProductionController();
 * 
 *   if (isLoading) return <p>Cargando información de producción...</p>;
 * 
 *   return (
 *     <div>
 *       <button onClick={handlers.handleRefresh}>Actualizar</button>
 *       <p>Total de Maniquíes: {maniquies.length}</p>
 *     </div>
 *   );
 * };
 * ```
 * 
 * @returns Estado local de maniquíes, indicadores de carga, mensajes de error y utilidades de traducción.
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
