import { FC } from 'react';
import Icon from '@/components/atoms/display/Icon';
import styles from './SkeletonPadPanel.module.css';
import { icons } from 'lucide-react';

/**
 * Supported mannequin skeleton part codes.
 */
export type SkeletonPart = 'CAB' | 'TOR' | 'BRA-D' | 'BRA-I' | 'PIE-D' | 'PIE-I';

/**
 * Props for the SkeletonPadPanel component.
 */
export interface SkeletonPadPanelProps {
  /** List of mannequin skeleton parts currently selected. */
  selectedParts?: SkeletonPart[];
  /** Callback triggered when a part is selected or toggled. */
  onPartSelect?: (part: SkeletonPart) => void;
  /** Translation helper function. */
  t: (key: string) => string;
}

/**
 * Configuration structure for a skeleton pad element.
 */
interface PadConfig {
  /** Skeleton part code. */
  id: SkeletonPart;
  /** Lucide icon name to display. */
  icon: keyof typeof icons;
  /** Localized translation key for the part label. */
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
