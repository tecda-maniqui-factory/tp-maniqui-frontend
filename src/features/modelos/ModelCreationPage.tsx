import { FC, useState } from 'react';
import { PageHeader } from '@/components/organisms';
import { FormField } from '@/components/molecules';
import { Input, Button, Spinner, Select } from '@/components/atoms';
import { SkeletonPadPanel, SkeletonPart } from './components/SkeletonPadPanel';
import { useLanguage } from '@/hooks/useLanguage';
import { useNotify } from '@/hooks/useNotify';

/**
 * ModelCreationPage: Página para diseñar y registrar nuevos modelos de maniquíes.
 */
export const ModelCreationPage: FC = () => {
  const { t } = useLanguage();
  const notify = useNotify();

  const [nombre, setNombre] = useState('');
  const [sexo, setSexo] = useState('');
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
    if (!nombre || !sexo || selectedParts.length === 0) return;

    setIsSubmitting(true);
    // Simular llamada a API para crear el modelo
    setTimeout(() => {
      notify(`Modelo "${nombre}" creado exitosamente con ${selectedParts.length} piezas.`, 'success');
      setNombre('');
      setSexo('');
      setSelectedParts(['CAB', 'TOR', 'BRA-I', 'BRA-D', 'PIE-I', 'PIE-D']);
      setIsSubmitting(false);
    }, 1000);
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

          <Button 
            type="submit" 
            variant="primary" 
            isDisabled={isSubmitting || !nombre || !sexo || selectedParts.length === 0}
          >
            {isSubmitting ? <Spinner size={20} /> : 'Guardar Nuevo Modelo'}
          </Button>
        </form>
      </section>
    </div>
  );
};
