import { FC } from 'react';
import Icon from '../atoms/Icon';
import { icons } from 'lucide-react';
import './StatCard.css';

export interface StatCardProps {
  title: string;
  value: string | number;
  iconName: keyof typeof icons;
  trend?: {
    value: number;
    isUpward: boolean;
  };
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
}

/**
 * Componente Organismo: StatCard
 * Tarjeta de estadísticas para el Dashboard.
 */
const StatCard: FC<StatCardProps> = ({
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
