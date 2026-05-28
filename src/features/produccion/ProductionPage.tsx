import { FC, useState } from 'react';
import PageHeader from '@/components/organisms/PageHeader';
import Table, { TableColumn } from '@/components/molecules/Table';
import Badge from '@/components/atoms/Badge';
import Spinner from '@/components/atoms/Spinner';
import Button from '@/components/atoms/Button';
import Modal from '@/components/organisms/Modal';
import { AssemblyForm } from './components/AssemblyForm';
import { useProductionController } from './hooks/useProductionController';
import './ProductionPage.css';

/**
 * ProductionPage: Orquestador de la feature de Producción.
 * Consume el controlador para mostrar datos reales del inventario.
 */
const ProductionPage: FC = () => {
  const { maniquies, isLoading, handlers, t } = useProductionController();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleAssemblySuccess = () => {
    handleCloseModal();
    handlers.handleRefresh();
  };

  const columns: TableColumn[] = [
    { key: 'numero_serie', header: t('production.table.serie') },
    { key: 'modelo_nombre', header: t('production.table.model') },
    { key: 'status', header: t('production.table.status'), align: 'center' },
    { key: 'fecha_ensamblaje', header: t('production.table.date') },
  ];

  const renderCell = (item: any, column: TableColumn) => {
    if (column.key === 'status') {
      const variant = item.status === 'Disponible' ? 'success' : 
                      item.status === 'En Producción' ? 'warning' : 
                      item.status === 'Vendido' ? 'info' : 'danger';
      return <Badge variant={variant}>{item.status}</Badge>;
    }
    
    if (column.key === 'fecha_ensamblaje') {
      return item.fecha_ensamblaje ? new Date(item.fecha_ensamblaje).toLocaleDateString() : '-';
    }

    if (column.key === 'modelo_nombre') {
      return item.Modelo?.nombre || item.modelo_nombre || '-';
    }

    return item[column.key];
  };

  const headerActions = (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <Button 
        variant="primary" 
        iconName="Plus" 
        onClick={handleOpenModal}
      >
        {t('production.assembly.open_modal')}
      </Button>
      <Button 
        variant="secondary" 
        iconName="RefreshCw" 
        onClick={handlers.handleRefresh}
        isDisabled={isLoading}
      >
        {t('common.refresh')}
      </Button>
    </div>
  );

  return (
    <div className="production-page">
      <PageHeader 
        title={t('production.title')} 
        description={t('production.description')}
        actions={headerActions}
      />

      <section className="app__section">
        {isLoading ? (
          <div className="production-page__loading">
            <Spinner size={40} variant="primary" />
            <p>{t('common.loading')}</p>
          </div>
        ) : (
          <Table 
            columns={columns} 
            data={maniquies} 
            renderCell={renderCell}
          />
        )}
      </section>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={t('production.assembly.modal_title')}
      >
        <AssemblyForm 
          onSuccess={handleAssemblySuccess}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
};

export default ProductionPage;
