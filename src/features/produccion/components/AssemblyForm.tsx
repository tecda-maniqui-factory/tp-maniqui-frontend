import { FC } from 'react';
import FormField from '@/components/molecules/form/FormField';;
import Select from '@/components/atoms/form/Select';
import Input from '@/components/atoms/form/Input';
import Button from '@/components/atoms/form/Button';
import Spinner from '@/components/atoms/feedback/Spinner';;
import { useAssemblyController } from '../hooks/useAssemblyController';
import { Modelo } from '../api/productionService';
import './AssemblyForm.css';

/**
 * Propiedades del componente {@link AssemblyForm}.
 */
export interface AssemblyFormProps {
  /** Callback opcional que se ejecuta cuando el maniquí se ensambla y registra con éxito. */
  onSuccess?: () => void;
  /** Callback opcional que se ejecuta al cancelar el proceso de ensamblaje. */
  onCancel?: () => void;
}

/**
 * Componente Organismo: `AssemblyForm`
 * 
 * Formulario técnico de la línea de montaje que permite registrar el ensamblaje de un nuevo maniquí.
 * Facilita la selección del modelo del catálogo técnico y la especificación del número de serie único.
 * 
 * Delega su lógica de control y validaciones en el hook {@link useAssemblyController}.
 * 
 * @example
 * ```tsx
 * import { AssemblyForm } from './components/AssemblyForm';
 * 
 * <AssemblyForm 
 *   onSuccess={() => console.log('¡Ensamblaje registrado!')} 
 *   onCancel={() => console.log('Proceso cancelado')} 
 * />
 * ```
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
