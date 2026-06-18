import { FC } from 'react';
import FormField from '@/components/molecules/form/FormField';;
import Select from '@/components/atoms/form/Select';
import Input from '@/components/atoms/form/Input';
import Button from '@/components/atoms/form/Button';
import Spinner from '@/components/atoms/feedback/Spinner';;
import { useAssemblyController } from '../hooks/useAssemblyController';
import { Modelo } from '../api/productionService';
import './AssemblyForm.css';

export interface AssemblyFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

/**
 * Organismo: AssemblyForm
 * Formulario para el registro técnico de ensamblaje (Línea de Montaje).
 */
export const AssemblyForm: FC<AssemblyFormProps> = ({ onSuccess, onCancel }) => {
  const { 
    modelos = [], 
    selectedModelo, 
    numeroSerie,
    isSubmitting, 
    isLoadingModels, 
    handlers, 
    t 
  } = useAssemblyController(onSuccess);

  const modelOptions = (modelos || []).map((m: Modelo) => ({
    value: String(m.id),
    label: m.nombre || `Modelo ${m.id}`
  }));

  return (
    <form className="assembly-form" onSubmit={handlers.handleSubmit}>
      <div className="assembly-form__content">
        <FormField 
          label={t('production.assembly.model_label')}
          helperText={t('production.assembly.model_help')}
        >
          <Select 
            options={modelOptions}
            iconName="Package"
            variant="info"
            value={selectedModelo}
            onChange={handlers.handleModelChange}
            disabled={isSubmitting || isLoadingModels}
            placeholder={isLoadingModels ? t('common.loading') : t('production.assembly.model_placeholder')}
          />
        </FormField>

        <FormField 
          label={t('production.assembly.serie_label')}
          helperText={t('production.assembly.serie_help')}
        >
          <Input 
            name="numero_serie"
            iconName="Hash"
            placeholder={t('production.assembly.serie_placeholder')}
            value={numeroSerie}
            onChange={handlers.handleSerieChange}
            disabled={isSubmitting}
            required
          />
        </FormField>
      </div>

      <div className="assembly-form__actions">
        <Button 
          type="button" 
          variant="secondary" 
          onClick={onCancel}
          isDisabled={isSubmitting}
        >
          {t('common.cancel')}
        </Button>
        <Button 
          type="submit" 
          variant="primary" 
          iconName={!isSubmitting ? "Plus" : undefined}
          isDisabled={isSubmitting || !selectedModelo || !numeroSerie}
        >
          {isSubmitting ? <Spinner size={20} variant="info" /> : t('production.assembly.submit')}
        </Button>
      </div>
    </form>
  );
};
