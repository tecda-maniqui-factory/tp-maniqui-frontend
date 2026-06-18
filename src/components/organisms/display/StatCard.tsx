import { FC } from 'react';
import Icon from '@/components/atoms/display/Icon';;
import { icons } from 'lucide-react';
import './StatCard.css';

/**
 * Props for the StatCard component.
 */
export interface StatCardProps {
  /** The title label of the statistic. */
  title: string;
  /** The value/number to display. */
  value: string | number;
  /** Lucide icon name for the display icon. */
  iconName: keyof typeof icons;
  /** Optional trend data showing percentage growth/decline. */
  trend?: {
    /** The percentage value. */
    value: number;
    /** If true, indicates upward trend, otherwise downward. */
    isUpward: boolean;
  };
  /** Color styling variant. */
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
