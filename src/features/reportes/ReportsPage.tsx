import { FC, useEffect, useState, useCallback } from 'react';
import PageHeader from '@/components/organisms/layout/PageHeader';;
import StatCard from '@/components/organisms/display/StatCard';;
import { RentabilidadTable } from './components/RentabilidadTable';
import { reportsService, RentabilidadItem } from './api/reportsService';
import { useNotify } from '@/hooks/useNotify';
import { useAuth } from '@/hooks/useAuth';
import './ReportsPage.css';

/**
 * Página de Feature: Reportes
 * Integra múltiples reportes analíticos basados en la lógica del backend.
 */
const ReportsPage: FC = () => {
  const [rentabilidad, setRentabilidad] = useState<RentabilidadItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const showNotification = useNotify();
  const { token } = useAuth();

  const fetchData = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const rentData = await reportsService.getRentabilidad(token);
      setRentabilidad(rentData);
    } catch (error) {
      showNotification('No se pudo cargar la información analítica', 'danger');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [token, showNotification]);

  useEffect(() => {
    let isMounted = true;
    const run = async () => {
      await Promise.resolve();
      if (isMounted) fetchData();
    };
    run();
    return () => { isMounted = false; };
  }, [fetchData]);

  // Cálculos para StatCards
  const totalGanancia = rentabilidad.reduce((acc, item) => acc + item.margen_bruto, 0);
  const margenPromedio = rentabilidad.length > 0 
    ? (rentabilidad.reduce((acc, item) => acc + item.porcentaje_margen, 0) / rentabilidad.length).toFixed(1)
    : 0;

  return (
    <div className="reports-page">
      <PageHeader 
        title="Reportes y Análisis" 
        subtitle="Métricas de rentabilidad y rendimiento en tiempo real"
      />

      <div className="reports-page__stats">
        <StatCard 
          title="Ganancia Acumulada" 
          value={`$${totalGanancia.toLocaleString()}`} 
          iconName="DollarSign" 
          trend={{ value: 12, isPositive: true }}
          description="Basado en maniquíes vendidos"
        />
        <StatCard 
          title="Margen Promedio" 
          value={`${margenPromedio}%`} 
          iconName="Percent" 
          description="Rendimiento por unidad"
        />
      </div>

      <div className="reports-page__grid">
        <div className="reports-page__main">
          <RentabilidadTable data={rentabilidad} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
