import { FC } from 'react';
import { PageHeader } from '@/components/organisms';
import { FormField } from '@/components/molecules';
import { Input, Button, Spinner, Select } from '@/components/atoms';
import { useSupplyController } from './hooks/useSupplyController';
import { Modelo } from '../produccion/api/productionService';

export const SupplyPage: FC = () => {
  const {
    modelos,
    proveedor,
    tipoPieza,
    modeloId,
    cantidad,
    ordenesActivas,
    isSubmitting,
    isLoadingModels,
    handlers,
    proveedorOptions
  } = useSupplyController();

  const modelOptions = modelos.map((m: Modelo) => ({
    value: String(m.id),
    label: m.nombre || `Modelo ${m.id}`
  }));

  return (
    <div className="supply-page">
      <PageHeader 
        title="Recepción de Suministros" 
        description="Registra el ingreso de piezas desde proveedores externos o la planta principal."
      />
      <section className="app__section" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        
        <div>
          <h3>Órdenes Pendientes (En Vivo)</h3>
          {ordenesActivas.length === 0 ? (
            <p>No hay órdenes pendientes en este momento.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {ordenesActivas.map(orden => (
                <li key={orden.id} style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
                  <strong>Pieza:</strong> {orden.tipo_parte} <br/>
                  <strong>Modelo:</strong> {orden.modelo_nombre} <br/>
                  <Button 
                    variant="info" 
                    size="small" 
                    style={{ marginTop: '0.5rem' }}
                    onClick={() => handlers.handleCompletarOrden(orden)}
                  >
                    Preparar Ingreso
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <form onSubmit={handlers.handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h3>Formulario de Ingreso</h3>
          <FormField label="Proveedor / Origen">
            <Select 
              options={proveedorOptions}
              iconName="Truck"
              value={proveedor}
              onChange={handlers.handleProveedorChange}
              disabled={isSubmitting}
            />
          </FormField>

          <FormField label="Modelo Destino">
            <Select 
              options={modelOptions}
              iconName="PackageSearch"
              value={modeloId}
              onChange={handlers.handleModeloChange}
              disabled={isSubmitting || isLoadingModels}
              placeholder={isLoadingModels ? 'Cargando modelos...' : 'Seleccione el modelo'}
            />
          </FormField>

          <FormField label="Tipo de Pieza Recibida">
            <Select 
              options={[
                { value: 'CAB', label: 'Cabeza' },
                { value: 'TOR', label: 'Torso' },
                { value: 'BRI', label: 'Brazo Izquierdo' },
                { value: 'BRD', label: 'Brazo Derecho' },
                { value: 'PII', label: 'Pierna Izquierda' },
                { value: 'PID', label: 'Pierna Derecha' }
              ]}
              iconName="Package"
              value={tipoPieza}
              onChange={handlers.handleTipoPiezaChange}
              disabled={isSubmitting}
            />
          </FormField>

          <FormField label="Cantidad">
            <Input 
              type="number"
              min="1"
              iconName="Hash"
              value={cantidad}
              onChange={handlers.handleCantidadChange}
              disabled={isSubmitting}
              required
            />
          </FormField>

          <Button 
            type="submit" 
            variant="success" 
            iconName="Download"
            isDisabled={isSubmitting || !proveedor || !tipoPieza || !modeloId}
          >
            {isSubmitting ? <Spinner size={20} /> : 'Registrar Ingreso de Stock'}
          </Button>
        </form>
      </section>
    </div>
  );
};
