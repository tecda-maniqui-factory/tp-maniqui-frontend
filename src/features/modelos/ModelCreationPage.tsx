import { FC, useState } from 'react';
import PageHeader from '@/components/organisms/layout/PageHeader';;
import FormField from '@/components/molecules/form/FormField';;
import Input from '@/components/atoms/form/Input';
import Button from '@/components/atoms/form/Button';
import Spinner from '@/components/atoms/feedback/Spinner';
import Select from '@/components/atoms/form/Select';;
import { SkeletonPadPanel, SkeletonPart } from './components/SkeletonPadPanel';
import { useLanguage } from '@/hooks/useLanguage';
import { useNotify } from '@/hooks/useNotify';
import { useAuth } from '@/hooks/useAuth';
import { productionService } from '../produccion/api/productionService';

/**
 * Página de Diseño y Registro de Modelos (`ModelCreationPage`).
 * 
 * Permite a los usuarios diseñar nuevos modelos de maniquíes seleccionando de forma interactiva
 * e ilustrada (mediante {@link SkeletonPadPanel}) qué partes físicas o piezas componen la receta técnica.
 * Adicionalmente, recopila el nombre, género, costo unitario de producción y precio sugerido de venta.
 * 
 * Invoca el servicio {@link productionService.createModelo} al confirmar el envío.
 * 
 * @example
 * ```tsx
 * import { ModelCreationPage } from './features/modelos/ModelCreationPage';
 * 
 * const Router = () => (
 *   <Route path="/modelos/nuevo" element={<ModelCreationPage />} />
 * );
 * ```
 */
export const ModelCreationPage: FC = () => {
  const { t } = useLanguage();
  const notify = useNotify();
  const { token, logout } = useAuth();

  const [nombre, setNombre] = useState('');
  const [sexo, setSexo] = useState('');
  const [costoUnitario, setCostoUnitario] = useState('');
  const [precioVenta, setPrecioVenta] = useState('');
  const [selectedParts, setSelectedParts] = useState<SkeletonPart[]>(['CAB', 'TOR', 'BRA-I', 'BRA-D', 'PIE-I', 'PIE-D']);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const togglePart = (part: SkeletonPart) => {
    setSelectedParts(prev => 
      prev.includes(part) 
        ? prev.filter(p => p !== part) 
        : [...prev, part]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !sexo || !costoUnitario || !precioVenta || selectedParts.length === 0 || !token) return;

    setIsSubmitting(true);
    try {
      await productionService.createModelo(token, {
        nombre,
        partes: selectedParts,
        sexo_id: Number(sexo),
        costo_unitario: Number(costoUnitario),
        precio_venta: Number(precioVenta)
      });
      notify(`Modelo "${nombre}" creado exitosamente con ${selectedParts.length} piezas.`, 'success');
      setNombre('');
      setSexo('');
      setCostoUnitario('');
      setPrecioVenta('');
      setSelectedParts(['CAB', 'TOR', 'BRA-I', 'BRA-D', 'PIE-I', 'PIE-D']);
    } catch (err: any) {
      if (err.message === 'auth.error.session_expired') {
        logout();
      } else {
        notify(err.message || 'Error al guardar el modelo', 'danger');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modelos-page">
      <PageHeader 
        title="Diseñador de Modelos" 
        description="Crea la receta técnica (partes requeridas) para nuevos modelos."
      />
      <section className="app__section">
        <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--gray-800)' }}>Estructura del Modelo</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', marginBottom: '1.5rem' }}>
              Selecciona qué piezas físicas se requieren para armar este modelo.
            </p>
            <SkeletonPadPanel 
              selectedParts={selectedParts}
              onPartSelect={togglePart}
              t={t}
            />
          </div>

          <FormField label="Nombre del Modelo">
            <Input 
              placeholder="Ej: Busto Deportivo Femenino"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </FormField>

          <FormField label="Género / Sexo">
            <Select 
              options={[
                { value: '1', label: 'Masculino' },
                { value: '2', label: 'Femenino' },
                { value: '3', label: 'Unisex' }
              ]}
              value={sexo}
              onChange={(e) => setSexo(e.target.value)}
              disabled={isSubmitting}
            />
          </FormField>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <FormField label={t('production.model.cost_label')}>
              <Input 
                type="number"
                min="0.01"
                step="0.01"
                placeholder="Ej: 5000.00"
                value={costoUnitario}
                onChange={(e) => setCostoUnitario(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </FormField>

            <FormField label={t('production.model.price_label')}>
              <Input 
                type="number"
                min="0.01"
                step="0.01"
                placeholder="Ej: 18500.00"
                value={precioVenta}
                onChange={(e) => setPrecioVenta(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </FormField>
          </div>

          <Button 
            type="submit" 
            variant="primary" 
            isDisabled={isSubmitting || !nombre || !sexo || !costoUnitario || !precioVenta || selectedParts.length === 0}
          >
            {isSubmitting ? <Spinner size={20} /> : 'Guardar Nuevo Modelo'}
          </Button>
        </form>
      </section>
    </div>
  );
};
