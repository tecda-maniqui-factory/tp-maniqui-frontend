import { FC } from 'react';
import Icon from '@/components/atoms/display/Icon';
import styles from './SkeletonPadPanel.module.css';
import { icons } from 'lucide-react';

export type SkeletonPart = 'CAB' | 'TOR' | 'BRA-D' | 'BRA-I' | 'PIE-D' | 'PIE-I';

export interface SkeletonPadPanelProps {
  /** Partes seleccionadas para este diseño de modelo */
  selectedParts?: SkeletonPart[];
  /** Callback al seleccionar una parte */
  onPartSelect?: (part: SkeletonPart) => void;
  /** Traducciones */
  t: (key: string) => string;
}

interface PadConfig {
  id: SkeletonPart;
  icon: keyof typeof icons;
  labelKey: string;
}

const PAD_CONFIGS: PadConfig[] = [
  { id: 'CAB', icon: 'CircleUser', labelKey: 'production.parts.head' },
  { id: 'TOR', icon: 'User', labelKey: 'production.parts.torso' },
  { id: 'BRA-I', icon: 'ArrowLeft', labelKey: 'production.parts.arm_l' },
  { id: 'BRA-D', icon: 'ArrowRight', labelKey: 'production.parts.arm_r' },
  { id: 'PIE-I', icon: 'ChevronLeft', labelKey: 'production.parts.leg_l' },
  { id: 'PIE-D', icon: 'ChevronRight', labelKey: 'production.parts.leg_r' },
];

/**
 * SkeletonPadPanel: Herramienta de diseño para seleccionar qué partes componen un modelo.
 */
export const SkeletonPadPanel: FC<SkeletonPadPanelProps> = ({
  selectedParts = [],
  onPartSelect,
  t
}) => {
  return (
    <div className={styles.root}>
      {PAD_CONFIGS.map((config) => {
        const isSelected = selectedParts.includes(config.id);
        
        let padClass = styles.pad;
        if (isSelected) padClass += ` ${styles['pad--active']}`;

        return (
          <div 
            key={config.id}
            className={padClass}
            onClick={() => onPartSelect?.(config.id)}
            title={t(config.labelKey)}
          >
            <div className={`
              ${styles['status-indicator']} 
              ${isSelected ? styles['status-indicator--on'] : ''}
            `} />
            <Icon name={config.icon} size={32} />
            <span className={styles.pad__label}>{t(config.labelKey)}</span>
          </div>
        );
      })}
    </div>
  );
};
