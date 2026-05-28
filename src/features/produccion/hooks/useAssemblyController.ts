import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNotify } from '@/hooks/useNotify';
import { useLanguage } from '@/hooks/useLanguage';
import { productionService, Modelo } from '../api/productionService';

/**
 * Controlador para el formulario de ensamblaje.
 */
export const useAssemblyController = (onSuccess?: () => void) => {
  const { token } = useAuth();
  const notify = useNotify();
  const { t } = useLanguage();

  const [modelos, setModelos] = useState<Modelo[]>([]);
  const [selectedModelo, setSelectedModelo] = useState<string>('');
  const [numeroSerie, setNumeroSerie] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingModels, setIsLoadingModels] = useState(false);

  // Cargar modelos al montar el componente
  useEffect(() => {
    const fetchModels = async () => {
      if (!token) return;
      setIsLoadingModels(true);
      try {
        const data = await productionService.getModelos(token);
        setModelos(data.modelos || []); // Garantizamos array
      } catch (err: any) {
        notify(t(err.message), 'danger');
      } finally {
        setIsLoadingModels(false);
      }
    };
    fetchModels();
  }, [token, notify, t]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !selectedModelo || !numeroSerie) return;

    setIsSubmitting(true);
    try {
      await productionService.ensamblarManiqui(token, Number(selectedModelo), numeroSerie);
      notify(t('production.success.assembly'), 'success');
      setSelectedModelo('');
      setNumeroSerie('');
      onSuccess?.();
    } catch (err: any) {
      notify(t(err.message), 'danger', t('production.error.title'));
    } finally {
      setIsSubmitting(false);
    }
  }, [token, selectedModelo, numeroSerie, notify, t, onSuccess]);

  const handlers = {
    handleModelChange: (e: React.ChangeEvent<HTMLSelectElement>) => setSelectedModelo(e.target.value),
    handleSerieChange: (e: React.ChangeEvent<HTMLInputElement>) => setNumeroSerie(e.target.value),
    handleSubmit
  };

  return {
    modelos,
    selectedModelo,
    numeroSerie,
    isSubmitting,
    isLoadingModels,
    handlers,
    t
  };
};
