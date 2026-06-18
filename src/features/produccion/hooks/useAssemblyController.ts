import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNotify } from '@/hooks/useNotify';
import { useLanguage } from '@/hooks/useLanguage';
import { productionService, Modelo } from '../api/productionService';

/**
 * Controller hook for the Mannequin Assembly Form.
 * Handles loading available mannequin models, form state management, submission execution, and validations.
 *
 * @param onSuccess - Optional callback triggered upon successful mannequin assembly registration.
 * @returns State properties, form control methods, action handlers, and translation utility.
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
