import { FC } from 'react';
import Icon from '@/components/atoms/display/Icon';
import { icons } from 'lucide-react';
import './StatCard.css';

/**
 * Propiedades del componente {@link StatCard}.
 */
export interface StatCardProps {
  /** El título o etiqueta de la estadística (ej: "Ventas Totales"). */
  title: string;
  /** El valor numérico o texto principal a mostrar (ej: 15000 o "$12,450"). */
  value: string | number;
  /** Nombre del icono de la librería Lucide que se mostrará en la tarjeta. */
  iconName: keyof typeof icons;
  /** Datos opcionales de tendencia que muestran crecimiento o decrecimiento. */
  trend?: {
    /** El valor porcentual de la tendencia (ej: 12.5). */
    value: number;
    /** Si es true indica tendencia ascendente (verde), de lo contrario descendente (rojo). */
    isUpward: boolean;
  };
  /** 
   * Variante visual que determina el color temático de la tarjeta (Flat UI).
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
}

/**
 * Componente Organismo: StatCard
 * 
 * Tarjeta de estadísticas diseñada para tableros de control (Dashboard).
 * Muestra una métrica clave, un icono representativo y un indicador opcional de tendencia porcentual.
 * 
 * @param props - Propiedades definidas en {@link StatCardProps}.
 * 
 * @example
 * ```tsx
 * // Tarjeta de estadísticas simple
 * <StatCard
 *   title="Productos Activos"
 *   value={120}
 *   iconName="Package"
 *   variant="info"
 * />
 * 
 * // Tarjeta de estadísticas con tendencia ascendente
 * <StatCard
 *   title="Ingresos Mensuales"
 *   value="$245,000"
 *   iconName="DollarSign"
 *   variant="success"
 *   trend={{ value: 15.4, isUpward: true }}
 * />
 * ```
 */
export const StatCard: FC<StatCardProps> = ({
  title,
  value,
  iconName,
  trend,
  variant = 'primary'
}) => {
  const baseClass = 'stat-card';
  const variantClass = `${baseClass}--${variant}`;

  return (
    <div className={`${baseClass} ${variantClass}`}>
      <div className={`${baseClass}__content`}>
        <span className={`${baseClass}__title`}>{title}</span>
        <h3 className={`${baseClass}__value`}>{value}</h3>
        {trend && (
          <div className={`${baseClass}__trend ${trend.isUpward ? 'is-up' : 'is-down'}`}>
            <Icon name={trend.isUpward ? 'TrendingUp' : 'TrendingDown'} size={14} />
            <span>{trend.value}%</span>
          </div>
        )}
      </div>
      <div className={`${baseClass}__icon-wrapper`}>
        <Icon name={iconName} className={`${baseClass}__icon`} />
      </div>
    </div>
  );
};

export default StatCard;
