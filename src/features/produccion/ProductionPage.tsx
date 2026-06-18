import { FC, useState } from 'react';
import PageHeader from '@/components/organisms/layout/PageHeader';
import Modal from '@/components/organisms/feedback/Modal';;
import Spinner from '@/components/atoms/feedback/Spinner';
import Button from '@/components/atoms/form/Button';;
import { AssemblyForm } from './components/AssemblyForm';
import { ProductionTable } from './components/ProductionTable';
import { useProductionController } from './hooks/useProductionController';
import { useAuth } from '@/hooks/useAuth';
import './ProductionPage.css';

/**
 * ProductionPage: Orquestador de la feature de Producción.
 * Consume el controlador para mostrar datos reales del inventario.
 */
const ProductionPage: FC = () => {
  const { user } = useAuth();
  const { maniquies, isLoading, handlers, t } = useProductionController();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const puedeEnsamblar = user?.rol === 'gerente_prod' || user?.rol === 'operario';

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleAssemblySuccess = () => {
    handleCloseModal();
    handlers.handleRefresh();
  };

  const headerActions = (
    <div className="production-page__actions">
      {puedeEnsamblar && (
        <Button 
          variant="primary" 
          iconName="Plus" 
          onClick={handleOpenModal}
        >
          {t('production.assembly.open_modal')}
        </Button>
      )}
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
          <ProductionTable data={maniquies} t={t} />
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
