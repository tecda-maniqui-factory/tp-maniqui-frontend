import { FC, ReactNode } from 'react';
import Icon from '@/components/atoms/Icon';
import { icons } from 'lucide-react';
import './StatCard.css';

export interface StatCardProps {
  label: string;
  value: string | number;
  iconName: keyof typeof icons;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'default';
  trend?: {
    value: string;
    isUp: boolean;
  };
  className?: string;
}

/**
 * Organismo: StatCard
 * Muestra indicadores clave de rendimiento (KPIs).
 */
const StatCard: FC<StatCardProps> = ({
  label,
  value,
  iconName,
  variant = 'default',
  trend,
  className = ''
}) => {
  return (
    <div className={`stat-card stat-card--${variant} ${className}`}>
      <div className="stat-card__icon-container">
        <Icon name={iconName} size={24} />
      </div>
      <div className="stat-card__content">
        <span className="stat-card__label">{label}</span>
        <span className="stat-card__value">{value}</span>
        {trend && (
          <div className={`stat-card__trend stat-card__trend--${trend.isUp ? 'up' : 'down'}`}>
            <Icon name={trend.isUp ? 'TrendingUp' : 'TrendingDown'} size={14} />
            {trend.value}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
