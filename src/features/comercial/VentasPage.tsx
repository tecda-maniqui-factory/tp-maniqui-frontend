import { FC, useMemo } from 'react';
import { PageHeader, Modal } from '@/components/organisms';
import { Spinner, Button, Select, Input, Badge } from '@/components/atoms';
import { FormField, Card } from '@/components/molecules';
import { VentasRecientesTable } from './components/VentasRecientesTable';
import { useSalesController } from './hooks/useSalesController';
import { Maniqui } from './api/comercialService';
import './VentasPage.css';

/**
 * VentasPage Component
 * Vista principal del Módulo Comercial para registrar y consultar transacciones de venta.
 */
export const VentasPage: FC = () => {
  const {
    clientes,
    maniquiesDisponibles,
    ventas,
    isLoading,
    isSubmitting,
    isCreatingCliente,
    isClienteModalOpen,
    selectedClienteId,
    selectedManiquiIds,
    quantitiesByModel,
    metodoPago,
    moneda,
    tipoCambio,
    totalSale,
    newClienteNombre,
    newClienteCuit,
    newClienteEmail,
    clienteError,
    setNewClienteNombre,
    setNewClienteCuit,
    setNewClienteEmail,
    setSelectedClienteId,
    setMetodoPago,
    setMoneda,
    setTipoCambio,
    setIsClienteModalOpen,
    handleModelQuantityChange,
    handleCreateCliente,
    handleRegisterSale,
    handleRefresh,
    t,
    // Detalle de Venta
    selectedVentaDetalle,
    isDetailModalOpen,
    isDetailLoading,
    handleViewDetail,
    handleCloseDetailModal
  } = useSalesController();

  // Agrupar stock disponible por modelo
  const modelsWithStock = useMemo(() => {
    const map: Record<number, { id: number; nombre: string; precio_venta: number; mannequins: Maniqui[] }> = {};
    maniquiesDisponibles.forEach(m => {
      if (!m.Modelo) return;
      if (!map[m.modelo_id]) {
        map[m.modelo_id] = {
          id: m.modelo_id,
          nombre: m.Modelo.nombre,
          precio_venta: Number(m.Modelo.precio_venta || 0),
          mannequins: []
        };
      }
      map[m.modelo_id].mannequins.push(m);
    });
    return Object.values(map);
  }, [maniquiesDisponibles]);

  const clientOptions = clientes.map(c => ({
    value: String(c.id),
    label: `${c.nombre} (CUIT: ${c.cuit_cuil})`
  }));

  const paymentOptions = [
    { value: 'Transferencia', label: 'Transferencia Bancaria' },
    { value: 'Efectivo', label: 'Efectivo' },
    { value: 'Tarjeta', label: 'Tarjeta de Crédito/Débito' },
    { value: 'Mercado Pago', label: 'Mercado Pago' },
    { value: 'Otros', label: 'Otros' }
  ];

  const currencyOptions = [
    { value: 'ARS', label: 'ARS (Pesos)' },
    { value: 'USD', label: 'USD (Dólares)' }
  ];

  const headerActions = (
    <Button
      variant="secondary"
      iconName="RefreshCw"
      onClick={handleRefresh}
      isDisabled={isLoading}
    >
      {t('common.refresh')}
    </Button>
  );

  return (
    <div className="sales-page">
      <PageHeader
        title={t('commercial.title')}
        description={t('commercial.description')}
        actions={headerActions}
      />

      {isLoading ? (
        <div className="sales-page__loading">
          <Spinner size={40} variant="primary" />
          <p>{t('common.loading')}</p>
        </div>
      ) : (
        <div className="sales-page__layout">
          {/* Columna Izquierda: Formulario de Registro de Venta */}
          <div className="sales-page__form-container">
            <Card title={t('commercial.new_sale')}>
              <form onSubmit={handleRegisterSale} className="sales-form">
                
                {/* Cliente */}
                <div className="sales-form__client-field">
                  <FormField label={t('commercial.select_client')} required>
                    <div className="sales-form__client-row">
                      <div className="sales-form__client-select-wrapper">
                        <Select
                          options={clientOptions}
                          value={selectedClienteId}
                          onChange={(e) => setSelectedClienteId(e.target.value)}
                          placeholder="Seleccionar cliente registrado"
                          disabled={isSubmitting}
                          iconName="User"
                          required
                        />
                      </div>
                      <Button
                        type="button"
                        variant="secondary"
                        iconName="Plus"
                        onClick={() => setIsClienteModalOpen(true)}
                        disabled={isSubmitting}
                        className="sales-form__new-client-btn"
                      >
                        {t('commercial.new_client_btn')}
                      </Button>
                    </div>
                  </FormField>
                </div>

                {/* Forma de Pago y Moneda */}
                <div className={`sales-form__options-row ${moneda === 'USD' ? 'sales-form__options-row--three-cols' : ''}`}>
                  <FormField label={t('commercial.payment_method')} required>
                    <Select
                      options={paymentOptions}
                      value={metodoPago}
                      onChange={(e) => setMetodoPago(e.target.value)}
                      disabled={isSubmitting}
                      iconName="CreditCard"
                    />
                  </FormField>

                  <FormField label={t('commercial.currency')} required>
                    <Select
                      options={currencyOptions}
                      value={moneda}
                      onChange={(e) => setMoneda(e.target.value as 'ARS' | 'USD')}
                      disabled={isSubmitting}
                      iconName="DollarSign"
                    />
                  </FormField>

                  {moneda === 'USD' && (
                    <FormField label="Cotización (ARS/USD)" required>
                      <Input
                        type="number"
                        name="tipo-cambio"
                        placeholder="Ej: 1000"
                        value={tipoCambio || ''}
                        onChange={(e) => setTipoCambio(Number(e.target.value))}
                        disabled={isSubmitting}
                        iconName="TrendingUp"
                        required
                        min={1}
                      />
                    </FormField>
                  )}
                </div>

                {/* Selección de Maniquíes por Modelo y Cantidad */}
                <div className="sales-form__mannequins-section">
                  <h3 className="sales-form__section-title">
                    {t('commercial.available_mannequins')}
                  </h3>
                  
                  {modelsWithStock.length === 0 ? (
                    <div className="sales-form__no-mannequins">
                      <p>⚠️ No hay maniquíes con estado 'Disponible' para la venta.</p>
                      <p className="sales-form__no-mannequins-sub text-muted">
                        Vaya a la sección de producción para ensamblar nuevos maniquíes.
                      </p>
                    </div>
                  ) : (
                    <div className="sales-form__mannequins-list">
                      {modelsWithStock.map((model) => {
                        const qtySelected = quantitiesByModel[model.id] || 0;
                        const subList = model.mannequins;
                        const selectedSerials = subList.slice(0, qtySelected).map(mq => mq.numero_serie);
                        const isChecked = qtySelected > 0;

                        return (
                          <div 
                            key={model.id} 
                            className={`sales-form__mannequin-card ${isChecked ? 'sales-form__mannequin-card--selected' : ''}`}
                            style={{ cursor: 'default' }}
                          >
                            <div className="sales-form__mannequin-info">
                              <div>
                                <span className="sales-form__mannequin-serial">{model.nombre}</span>
                                <span className="sales-form__mannequin-model">
                                  {subList.length} disponibles en stock
                                </span>
                                {isChecked && (
                                  <span className="sales-form__mannequin-serial-list">
                                    Seleccionados: {selectedSerials.join(', ')}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="sales-form__mannequin-qty-price-row">
                              <div className="sales-form__mannequin-price-display">
                                <span>
                                  {(() => {
                                    const basePrice = model.precio_venta;
                                    const price = moneda === 'USD' ? Number((basePrice / tipoCambio).toFixed(2)) : basePrice;
                                    return price.toLocaleString();
                                  })()} {moneda}
                                </span>
                              </div>

                              <div className="sales-form__mannequin-qty-input">
                                <Input
                                  type="number"
                                  name={`qty-${model.id}`}
                                  placeholder="0"
                                  min={0}
                                  max={subList.length}
                                  value={qtySelected || ''}
                                  onChange={(e) => handleModelQuantityChange(model.id, Number(e.target.value))}
                                  disabled={isSubmitting}
                                  iconName="Layers"
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Resumen y Envío */}
                <div className="sales-form__summary">
                  <div className="sales-form__summary-item">
                    <span>Maniquíes seleccionados:</span>
                    <strong>{selectedManiquiIds.length}</strong>
                  </div>
                  <div className="sales-form__summary-total">
                    <span>{t('commercial.total')}:</span>
                    <span className="sales-form__total-val">
                      {totalSale.toLocaleString()} {moneda}
                    </span>
                  </div>
                </div>

                <div className="sales-form__actions">
                  <Button
                    type="submit"
                    variant="primary"
                    iconName={!isSubmitting ? "ShoppingCart" : undefined}
                    isDisabled={isSubmitting || selectedManiquiIds.length === 0 || !selectedClienteId}
                    className="sales-form__submit-btn"
                  >
                    {isSubmitting ? <Spinner size={20} variant="info" /> : t('commercial.register_sale_btn')}
                  </Button>
                </div>
              </form>
            </Card>
          </div>

          {/* Columna Derecha: Tabla de Historial Comercial */}
          <div className="sales-page__history-container">
            <VentasRecientesTable 
              data={ventas.map(v => ({
                id: v.id,
                cliente: v.cliente || `Cliente #${v.cliente_id}`,
                fecha: v.fecha_venta,
                total: v.total,
                nro_factura: v.nro_factura || `FAC-${v.id}`,
                cae: v.cae,
                moneda: v.moneda,
                metodo_pago: v.metodo_pago
              }))} 
              onViewDetail={handleViewDetail}
            />
          </div>
        </div>
      )}

      {/* Modal para Registrar Cliente */}
      <Modal
        isOpen={isClienteModalOpen}
        onClose={() => setIsClienteModalOpen(false)}
        title={t('commercial.new_client_title')}
      >
        <form onSubmit={handleCreateCliente} className="client-modal-form">
          <div className="client-modal-form__content">
            {clienteError && (
              <div className="client-modal-form__error">
                {clienteError}
              </div>
            )}

            <FormField label={t('commercial.client_name')} required>
              <Input
                name="client-name"
                placeholder="Ej: Tienda Galerías S.A."
                value={newClienteNombre}
                onChange={(e) => setNewClienteNombre(e.target.value)}
                disabled={isCreatingCliente}
                iconName="User"
                required
              />
            </FormField>

            <FormField label={t('commercial.client_cuit')} helperText="Formato: XX-XXXXXXXX-X" required>
              <Input
                name="client-cuit"
                placeholder="Ej: 30-74859201-4"
                value={newClienteCuit}
                onChange={(e) => setNewClienteCuit(e.target.value)}
                disabled={isCreatingCliente}
                iconName="Hash"
                required
              />
            </FormField>

            <FormField label={t('commercial.client_email')} required>
              <Input
                type="email"
                name="client-email"
                placeholder="Ej: contacto@tiendagalerias.com"
                value={newClienteEmail}
                onChange={(e) => setNewClienteEmail(e.target.value)}
                disabled={isCreatingCliente}
                iconName="Mail"
                required
              />
            </FormField>
          </div>

          <div className="client-modal-form__actions">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsClienteModalOpen(false)}
              disabled={isCreatingCliente}
            >
              {t('common.cancel')}
            </Button>
            <Button
              type="submit"
              variant="primary"
              iconName={!isCreatingCliente ? "Save" : undefined}
              isDisabled={isCreatingCliente || !newClienteNombre || !newClienteCuit || !newClienteEmail}
            >
              {isCreatingCliente ? <Spinner size={20} variant="info" /> : t('common.save')}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal para Mostrar Detalle de Venta */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        title={`Detalle de Venta: ${selectedVentaDetalle?.nro_factura || 'Comprobante'}`}
      >
        <div className="sale-detail-modal">
          {isDetailLoading ? (
            <div className="sale-detail-modal__loading">
              <Spinner size={30} variant="primary" />
              <p>Cargando información detallada...</p>
            </div>
          ) : selectedVentaDetalle ? (
            <div className="sale-detail-modal__content">
              {/* Resumen del Comprobante */}
              <div className="sale-detail-modal__summary-grid">
                <div className="sale-detail-modal__info-item">
                  <span className="sale-detail-modal__info-label">Cliente:</span>
                  <span className="sale-detail-modal__info-value">
                    {clientes.find(c => c.id === selectedVentaDetalle.cliente_id)?.nombre || 
                     `Cliente #${selectedVentaDetalle.cliente_id}`}
                  </span>
                </div>
                <div className="sale-detail-modal__info-item">
                  <span className="sale-detail-modal__info-label">Fecha:</span>
                  <span className="sale-detail-modal__info-value">
                    {new Date(selectedVentaDetalle.fecha_venta).toLocaleString()}
                  </span>
                </div>
                <div className="sale-detail-modal__info-item">
                  <span className="sale-detail-modal__info-label">Método de Pago:</span>
                  <span className="sale-detail-modal__info-value">
                    {selectedVentaDetalle.metodo_pago}
                  </span>
                </div>
                <div className="sale-detail-modal__info-item">
                  <span className="sale-detail-modal__info-label">Estado AFIP:</span>
                  <span className="sale-detail-modal__info-value">
                    {selectedVentaDetalle.cae ? (
                      <Badge variant="success">Validado (CAE: {selectedVentaDetalle.cae})</Badge>
                    ) : (
                      <Badge variant="warning">Pendiente</Badge>
                    )}
                  </span>
                </div>
              </div>

              {/* Items Vendidos */}
              <div className="sale-detail-modal__items-section">
                <h4 className="sale-detail-modal__items-title">Productos / Maniquíes Vendidos</h4>
                <div className="sale-detail-modal__items-list">
                  {selectedVentaDetalle.Detalle_Ventas?.map((detalle: any, idx: number) => {
                    const modelName = detalle.maniqui?.Modelo?.nombre || 'Maniquí Ensamblado';
                    const serial = detalle.maniqui?.numero_serie || `ID: ${detalle.maniqui_id}`;
                    return (
                      <div key={detalle.id || idx} className="sale-detail-modal__item-row">
                        <div className="sale-detail-modal__item-desc">
                          <span className="sale-detail-modal__item-name">{modelName}</span>
                          <span className="sale-detail-modal__item-serial text-muted">S/N: {serial}</span>
                        </div>
                        <div className="sale-detail-modal__item-price">
                          {Number(detalle.precio_final).toLocaleString()} {selectedVentaDetalle.moneda}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Total */}
              <div className="sale-detail-modal__total-container">
                <span className="sale-detail-modal__total-label">Total Facturado:</span>
                <span className="sale-detail-modal__total-value">
                  {Number(selectedVentaDetalle.total).toLocaleString()} {selectedVentaDetalle.moneda}
                </span>
              </div>

              <div className="sale-detail-modal__actions">
                <Button variant="secondary" onClick={handleCloseDetailModal}>
                  Cerrar
                </Button>
              </div>
            </div>
          ) : (
            <p>No se pudo cargar el detalle.</p>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default VentasPage;
