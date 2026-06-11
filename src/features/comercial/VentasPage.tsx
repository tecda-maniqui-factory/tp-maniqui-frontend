import { FC } from 'react';
import { PageHeader, Modal } from '@/components/organisms';
import { Spinner, Button, Select, Input, Checkbox } from '@/components/atoms';
import { FormField, Card } from '@/components/molecules';
import { VentasRecientesTable } from './components/VentasRecientesTable';
import { useSalesController } from './hooks/useSalesController';
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
    maniquiesPrecios,
    metodoPago,
    moneda,
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
    setIsClienteModalOpen,
    handleToggleManiqui,
    handlePriceChange,
    handleCreateCliente,
    handleRegisterSale,
    handleRefresh,
    t
  } = useSalesController();

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
                <div className="sales-form__options-row">
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
                </div>

                {/* Selección de Maniquíes */}
                <div className="sales-form__mannequins-section">
                  <h3 className="sales-form__section-title">
                    {t('commercial.available_mannequins')}
                  </h3>
                  
                  {maniquiesDisponibles.length === 0 ? (
                    <div className="sales-form__no-mannequins">
                      <p>⚠️ No hay maniquíes con estado 'Disponible' para la venta.</p>
                      <p className="sales-form__no-mannequins-sub text-muted">
                        Vaya a la sección de producción para ensamblar nuevos maniquíes.
                      </p>
                    </div>
                  ) : (
                    <div className="sales-form__mannequins-list">
                      {maniquiesDisponibles.map((maniqui) => {
                        const isChecked = selectedManiquiIds.includes(maniqui.id);
                        return (
                          <div 
                            key={maniqui.id} 
                            className={`sales-form__mannequin-card ${isChecked ? 'sales-form__mannequin-card--selected' : ''}`}
                            onClick={() => handleToggleManiqui(maniqui.id)}
                          >
                            <div className="sales-form__mannequin-info">
                              <div onClick={(e) => e.stopPropagation()}>
                                <Checkbox
                                  checked={isChecked}
                                  onChange={() => handleToggleManiqui(maniqui.id)}
                                  disabled={isSubmitting}
                                />
                              </div>
                              <div>
                                <span className="sales-form__mannequin-serial">{maniqui.numero_serie}</span>
                                <span className="sales-form__mannequin-model">{maniqui.Modelo?.nombre || 'Modelo s/n'}</span>
                              </div>
                            </div>

                            <div 
                              className="sales-form__mannequin-price"
                              onClick={(e) => e.stopPropagation()} // Evitar deseleccionar al editar precio
                            >
                              <Input
                                type="number"
                                name={`price-${maniqui.id}`}
                                placeholder={t('commercial.unit_price')}
                                value={maniquiesPrecios[maniqui.id] ?? ''}
                                onChange={(e) => handlePriceChange(maniqui.id, Number(e.target.value))}
                                disabled={!isChecked || isSubmitting}
                                iconName="Tag"
                                required={isChecked}
                              />
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
                moneda: v.moneda
              }))} 
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
    </div>
  );
};

export default VentasPage;
