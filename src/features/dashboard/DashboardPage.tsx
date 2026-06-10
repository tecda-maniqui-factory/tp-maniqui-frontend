import { FC } from 'react';
import { PageHeader } from '@/components/organisms';
import { StockCriticoWidget } from './components/StockCriticoWidget';
import { useDashboardController } from './hooks/useDashboardController';
import './DashboardPage.css';

/**
 * DashboardPage: Orquestador de la feature de Dashboard.
 * Proporciona una vista general del estado del sistema y alertas críticas.
 */
const DashboardPage: FC = () => {
  const { stockCritico, isLoading, handlers, t } = useDashboardController();

  return (
    <div className="dashboard-page">
      <PageHeader 
        title={t('dashboard.title')} 
        description={t('dashboard.description')}
      />
      
      <section className="app__section">
        <div className="dashboard-grid">
          <div className="dashboard-grid__item dashboard-grid__item--full">
            <StockCriticoWidget 
              data={stockCritico}
              isLoading={isLoading}
              onPedir={handlers.handlePedirPieza}
              t={t}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
