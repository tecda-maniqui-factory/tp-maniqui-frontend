import { FC } from 'react';
import PageHeader from '@/components/organisms/PageHeader';
import './DashboardPage.css';

/**
 * DashboardPage: Orquestador de la feature de Dashboard.
 * Proporciona una vista general del estado del sistema.
 */
const DashboardPage: FC = () => {
  return (
    <div className="dashboard-page">
      <PageHeader 
        title="Dashboard Principal" 
        description="Bienvenido al Sistema Maniquí. Aquí tienes un resumen del estado actual."
      />
      <section className="app__section">
        <p>Contenido del dashboard en desarrollo.</p>
      </section>
    </div>
  );
};

export default DashboardPage;
