import { FC } from 'react';
import Icon from '@/components/atoms/display/Icon';
import styles from './SkeletonPadPanel.module.css';
import { icons } from 'lucide-react';

/**
 * Códigos admitidos para las partes físicas o del esqueleto de un maniquí.
 */
export type SkeletonPart = 'CAB' | 'TOR' | 'BRA-D' | 'BRA-I' | 'PIE-D' | 'PIE-I';

/**
 * Propiedades del componente {@link SkeletonPadPanel}.
 */
export interface SkeletonPadPanelProps {
  /** Colección de partes actualmente seleccionadas/activas del maniquí. */
  selectedParts?: SkeletonPart[];
  /** Callback ejecutado al alternar (seleccionar/deseleccionar) una parte del panel. */
  onPartSelect?: (part: SkeletonPart) => void;
  /** Utilidad de traducción para localizar los nombres de las partes. */
  t: (key: string) => string;
}

/**
 * Configuración visual y de traducción para un botón de parte del esqueleto.
 */
export interface PadConfig {
  /** Código único de la parte física del esqueleto. */
  id: SkeletonPart;
  /** Nombre de icono Lucide a renderizar en el botón. */
  icon: keyof typeof icons;
  /** Clave de traducción para localizar el texto del botón. */
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
 * Componente: `SkeletonPadPanel`
 * 
 * Herramienta de diseño interactiva e ilustrada que permite seleccionar qué partes físicas (receta)
 * componen un modelo específico de maniquí (cabeza, torso, extremidades).
 * 
 * @example
 * ```tsx
 * import { SkeletonPadPanel, SkeletonPart } from './components/SkeletonPadPanel';
 * 
 * const MyEditor = () => {
 *   const [parts, setParts] = useState<SkeletonPart[]>(['CAB', 'TOR']);
 *   const handleToggle = (part: SkeletonPart) => {
 *     setParts(prev => prev.includes(part) ? prev.filter(p => p !== part) : [...prev, part]);
 *   };
 *   return (
 *     <SkeletonPadPanel selectedParts={parts} onPartSelect={handleToggle} t={(k) => k} />
 *   );
 * };
 * ```
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
