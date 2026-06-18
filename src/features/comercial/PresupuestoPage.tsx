import { FC, useState, useMemo, useCallback, useEffect } from 'react';
import PageHeader from '@/components/organisms/layout/PageHeader';;
import Card from '@/components/molecules/display/Card';
import FormField from '@/components/molecules/form/FormField';
import Table from '@/components/molecules/display/Table';;
import Input from '@/components/atoms/form/Input';
import Button from '@/components/atoms/form/Button';
import Select from '@/components/atoms/form/Select';
import Badge from '@/components/atoms/display/Badge';
import Icon from '@/components/atoms/display/Icon';
import Spinner from '@/components/atoms/feedback/Spinner';;
import { useAuth } from '@/hooks/useAuth';
import { useNotify } from '@/hooks/useNotify';
import { useLanguage } from '@/hooks/useLanguage';
import { productionService, Modelo } from '../produccion/api/productionService';
import { comercialService, Cliente } from './api/comercialService';
import './PresupuestoPage.css';

/**
 * Representa un artículo cotizado en el presupuesto.
 */
export interface QuoteItem {
  /** Referencia del identificador único del modelo. */
  id: number;
  /** Nombre del modelo de maniquí. */
  nombre: string;
  /** Cantidad de maniquíes presupuestados. */
  cantidad: number;
  /** Precio de venta unitario del modelo. */
  precioUnitario: number;
  /** Subtotal acumulado para este ítem (cantidad * precioUnitario). */
  subtotal: number;
}

/**
 * Página del Cotizador de Presupuestos (`PresupuestoPage`).
 * 
 * Permite simular transacciones comerciales, añadir modelos al borrador de facturación,
 * efectuar conversiones automáticas de moneda (ARS/USD), y emitir presupuestos en formato imprimible
 * sin afectar el inventario real.
 * 
 * @example
 * ```tsx
 * import PresupuestoPage from './features/comercial/PresupuestoPage';
 * 
 * const Router = () => (
 *   <Route path="/comercial/presupuesto" element={<PresupuestoPage />} />
 * );
 * ```
 */
export const PresupuestoPage: FC = () => {
  const { token, logout } = useAuth();
  const notify = useNotify();
  const { t } = useLanguage();

  const [modelos, setModelos] = useState<Modelo[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [selectedModeloId, setSelectedModeloId] = useState('');
  const [selectedClienteId, setSelectedClienteId] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([]);
  
  const [moneda, setMoneda] = useState<'ARS' | 'USD'>('ARS');
  const [tipoCambio, setTipoCambio] = useState(1000);

  const selectedCliente = useMemo(() => {
    return clientes.find(c => String(c.id) === selectedClienteId);
  }, [clientes, selectedClienteId]);

  useEffect(() => {
    const loadData = async () => {
      if (!token) return;
      setIsLoading(true);
      try {
        const [modelosData, clientesData] = await Promise.all([
          productionService.getModelos(token),
          comercialService.getClientes(token)
        ]);
        setModelos(modelosData.modelos || []);
        setClientes(clientesData || []);
      } catch (err: any) {
        if (err.message === 'auth.error.session_expired') logout();
        else notify('Error al cargar datos', 'danger');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [token, logout, notify]);

  const handleAddItem = () => {
    if (!selectedModeloId) return;
    
    const modelo = modelos.find(m => String(m.id) === selectedModeloId);
    if (!modelo) return;

    const precio = Number(modelo.precio_venta || 0);
    
    setQuoteItems(prev => {
      const existing = prev.find(item => item.id === modelo.id);
      if (existing) {
        return prev.map(item => 
          item.id === modelo.id 
            ? { ...item, cantidad: item.cantidad + cantidad, subtotal: (item.cantidad + cantidad) * precio }
            : item
        );
      }
      return [...prev, {
        id: modelo.id,
        nombre: modelo.nombre,
        cantidad: cantidad,
        precioUnitario: precio,
        subtotal: cantidad * precio
      }];
    });

    setSelectedModeloId('');
    setCantidad(1);
    notify('Producto añadido al presupuesto', 'success');
  };

  const handleRemoveItem = (id: number) => {
    setQuoteItems(prev => prev.filter(item => item.id !== id));
  };

  const totalARS = useMemo(() => {
    return quoteItems.reduce((acc, item) => acc + item.subtotal, 0);
  }, [quoteItems]);

  const totalConverted = useMemo(() => {
    if (moneda === 'ARS') return totalARS;
    return totalARS / tipoCambio;
  }, [totalARS, moneda, tipoCambio]);

  const columns = [
    { key: 'nombre', header: 'Modelo' },
    { key: 'precioUnitario', header: 'Precio Unitario', align: 'right' as const },
    { key: 'cantidad', header: 'Cant.', align: 'center' as const },
    { key: 'subtotal', header: 'Subtotal', align: 'right' as const },
    { key: 'acciones', header: '', align: 'center' as const }
  ];

  const renderCell = (item: QuoteItem, col: any) => {
    if (col.key === 'precioUnitario') return `$${item.precioUnitario.toLocaleString()}`;
    if (col.key === 'subtotal') return `$${item.subtotal.toLocaleString()}`;
    if (col.key === 'acciones') {
      return (
        <Button variant="danger" size="compact" iconName="Trash2" onClick={() => handleRemoveItem(item.id)} />
      );
    }
    return (item as any)[col.key];
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="app__loading-container">
        <Spinner size={40} />
        <p>Cargando catálogo...</p>
      </div>
    );
  }

  return (
    <div className="presupuesto-page">
      <PageHeader 
        title="Cotizador de Presupuestos" 
        description="Genera estimaciones de costos para clientes sin afectar el inventario físico."
      />

      <div className="presupuesto-page__layout" style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem', alignItems: 'start' }}>
        
        <Card title="Datos de la Cotización">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <FormField label="Seleccionar Cliente">
              <Select 
                options={clientes.map(c => ({ value: String(c.id), label: c.nombre }))}
                value={selectedClienteId}
                onChange={(e) => setSelectedClienteId(e.target.value)}
                placeholder="Elija un cliente..."
              />
            </FormField>

            <hr style={{ border: '0', borderTop: '1px solid var(--border-light)', margin: '0.5rem 0' }} />

            <FormField label="Seleccionar Modelo">
              <Select 
                options={modelos.map(m => ({ value: String(m.id), label: m.nombre }))}
                value={selectedModeloId}
                onChange={(e) => setSelectedModeloId(e.target.value)}
                placeholder="Elija un modelo..."
              />
            </FormField>

            <FormField label="Cantidad">
              <Input 
                type="number" 
                min={1} 
                value={cantidad} 
                onChange={(e) => setCantidad(Number(e.target.value))} 
              />
            </FormField>

            <Button 
              variant="primary" 
              iconName="Plus" 
              onClick={handleAddItem}
              isDisabled={!selectedModeloId}
            >
              Añadir Producto
            </Button>

            <hr style={{ border: '0', borderTop: '1px solid var(--border-light)', margin: '0.5rem 0' }} />

            <FormField label="Moneda del Presupuesto">
              <Select 
                options={[
                  { value: 'ARS', label: 'ARS (Pesos Argentinos)' },
                  { value: 'USD', label: 'USD (Dólares)' }
                ]}
                value={moneda}
                onChange={(e) => setMoneda(e.target.value as 'ARS' | 'USD')}
              />
            </FormField>

            {moneda === 'USD' && (
              <FormField label="Tipo de Cambio (ARS/USD)">
                <Input 
                  type="number" 
                  value={tipoCambio} 
                  onChange={(e) => setTipoCambio(Number(e.target.value))} 
                />
              </FormField>
            )}
          </div>
        </Card>

        <Card title="Vista Previa del Presupuesto" className="printable-area">
          <div className="quote-header" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid var(--border-light)', paddingBottom: '1.5rem' }}>
            <div>
              <h2 style={{ color: 'var(--color-primary)', margin: 0, fontWeight: 800 }}>TECDA MANIQUÍES</h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>Av. del Libertador 4500, CABA | Tel: +54 11 4555-0199</p>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>Email: contacto@tecdamaniquies.com</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
              <Badge variant="info">PRESUPUESTO VÁLIDO POR 30 DÍAS</Badge>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>Fecha: {new Date().toLocaleDateString()}</p>
            </div>
          </div>

          {selectedCliente ? (
            <div className="quote-client-info" style={{ marginBottom: '1.5rem', padding: '1rem', border: '1px solid var(--border-light)', borderRadius: '6px', backgroundColor: 'var(--bg-card-header)' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-secondary)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cliente Destinatario</h4>
              <p style={{ margin: '0.2rem 0', fontSize: '1rem', fontWeight: 600 }}>{selectedCliente.nombre}</p>
              <p style={{ margin: '0.2rem 0', fontSize: '0.875rem', color: 'var(--text-muted)' }}>CUIT/CUIL: {selectedCliente.cuit_cuil}</p>
              {selectedCliente.email && (
                <p style={{ margin: '0.2rem 0', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Email: {selectedCliente.email}</p>
              )}
            </div>
          ) : (
            <div className="quote-client-info no-print" style={{ marginBottom: '1.5rem', padding: '1rem', border: '1px dashed var(--border-light)', borderRadius: '6px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              Ningún cliente seleccionado. Seleccione un cliente a la izquierda para agregarlo al presupuesto.
            </div>
          )}

          <Table 
            columns={columns}
            data={quoteItems}
            renderCell={renderCell}
          />

          {quoteItems.length === 0 && (
            <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
              No hay productos añadidos aún.
            </p>
          )}

          <div className="quote-footer" style={{ marginTop: '2rem', borderTop: '2px solid var(--border-base)', paddingTop: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
              <div style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
                Subtotal ARS: <strong>${totalARS.toLocaleString()}</strong>
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                TOTAL FINAL: {moneda === 'USD' ? `U$D ${totalConverted.toLocaleString()}` : `$${totalConverted.toLocaleString()}`}
              </div>
            </div>
          </div>

          <div className="no-print" style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <Button variant="secondary" iconName="Printer" onClick={handlePrint} isDisabled={quoteItems.length === 0}>
              Imprimir Presupuesto
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PresupuestoPage;
