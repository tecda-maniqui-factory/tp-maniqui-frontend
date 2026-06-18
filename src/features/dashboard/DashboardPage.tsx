import { FC } from 'react';
import PageHeader from '@/components/organisms/layout/PageHeader';;
import { StockCriticoWidget } from './components/StockCriticoWidget';
import { useDashboardController } from './hooks/useDashboardController';
import './DashboardPage.css';

/**
 * Página del Panel de Control (`DashboardPage`).
 * 
 * Vista centralizada que provee un resumen operativo de la aplicación.
 * Integra widgets críticos como el listado de existencias bajo mínimo ({@link StockCriticoWidget})
 * y orquesta la actualización y solicitudes de stock en base al rol de usuario logueado.
 * 
 * Delega el control de estado en el hook {@link useDashboardController}.
 * 
 * @example
 * ```tsx
 * import DashboardPage from './features/dashboard/DashboardPage';
 * 
 * const AppRoutes = () => (
 *   <Route path="/dashboard" element={<DashboardPage />} />
 * );
 * ```
 */
const DashboardPage: FC = () => {
  const { stockCritico, ordenesActivas, isLoading, handlers, t, user } = useDashboardController();

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
              userRole={user?.rol}
              ordenesActivas={ordenesActivas}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
