import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNotify } from '@/hooks/useNotify';
import { useLanguage } from '@/hooks/useLanguage';
import { productionService, Modelo } from '../api/productionService';

/**
 * Hook de control (Controller) para el formulario de ensamblaje ({@link AssemblyForm}).
 * 
 * Se encarga de cargar los modelos disponibles en el catálogo ({@link Modelo}), gestionar
 * el estado de selección de modelo y número de serie del nuevo maniquí, y orquestar el envío
 * de la petición de ensamblaje mediante el servicio {@link productionService.ensamblarManiqui}.
 * 
 * Se integra con los hooks {@link useAuth} y {@link useNotify}.
 *
 * @param onSuccess - Callback opcional ejecutado al concretarse con éxito el ensamblaje en el backend.
 * @returns Estado local, métodos de cambio y envío, y utilidad de traducción.
 * 
 * @example
 * ```tsx
 * import { useAssemblyController } from './hooks/useAssemblyController';
 * 
 * const MyForm = () => {
 *   const { modelos, selectedModelo, numeroSerie, handlers } = useAssemblyController(() => console.log('Éxito'));
 *   return (
 *     <form onSubmit={handlers.handleSubmit}>
 *       <input value={numeroSerie} onChange={handlers.handleSerieChange} />
 *     </form>
 *   );
 * };
 * ```
 */
export const useAssemblyController = (onSuccess?: () => void) => {
  const { token, logout } = useAuth();
  const notify = useNotify();
  const { t } = useLanguage();

  const [modelos, setModelos] = useState<Modelo[]>([]);
  const [selectedModeloId, setSelectedModeloId] = useState<string>('');
  const [numeroSerie, setNumeroSerie] = useState<string>('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingModels, setIsLoadingModels] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const initLine = async () => {
      if (!token) return;
      setIsLoadingModels(true);
      try {
        const modelsData = await productionService.getModelos(token);
        if (isMounted) setModelos(modelsData.modelos || []);
      } catch (err: unknown) {
        if (String(err) === 'auth.error.session_expired') logout();
      } finally {
        if (isMounted) setIsLoadingModels(false);
      }
    };
    initLine();
    return () => { isMounted = false; };
  }, [token, logout]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !selectedModeloId || !numeroSerie) return;

    setIsSubmitting(true);
    try {
      await productionService.ensamblarManiqui(token, Number(selectedModeloId), numeroSerie);
      notify(t('production.success.assembly'), 'success');
      setSelectedModeloId('');
      setNumeroSerie('');
      onSuccess?.();
    } catch (err: any) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg === 'auth.error.session_expired') {
        logout();
      } else {
        notify(t(msg), 'danger');
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [token, selectedModeloId, numeroSerie, notify, t, onSuccess]);

  const handlers = {
    handleModelChange: (e: React.ChangeEvent<HTMLSelectElement>) => setSelectedModeloId(e.target.value),
    handleSerieChange: (e: React.ChangeEvent<HTMLInputElement>) => setNumeroSerie(e.target.value),
    handleSubmit
  };

  return {
    modelos,
    selectedModelo: selectedModeloId,
    numeroSerie,
    isSubmitting,
    isLoadingModels,
    handlers,
    t
  };
};
