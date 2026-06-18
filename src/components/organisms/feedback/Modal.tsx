import React, { FC, ReactNode, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Icon from '@/components/atoms/display/Icon';
import './Modal.css';

/**
 * Propiedades del componente {@link Modal}.
 */
export interface ModalProps {
  /** Indica si la ventana modal se encuentra abierta y visible. */
  isOpen: boolean;
  /** Función callback que se ejecuta al solicitar el cierre de la ventana modal. */
  onClose: () => void;
  /** Título o encabezado que se muestra en la parte superior del modal. */
  title: string;
  /** Contenido principal que se renderizará en el cuerpo del modal. */
  children: ReactNode;
  /** Contenido opcional (ej: botones de acción) a mostrar en el pie (footer) del modal. */
  footer?: ReactNode;
  /** Clase CSS adicional para personalizar los estilos del contenedor del modal. */
  className?: string;
  /** 
   * Determina si el modal debe cerrarse al hacer clic fuera del mismo en la capa de overlay.
   * @default true
   */
  closeOnOverlayClick?: boolean;
}

/**
 * Componente Organismo: Modal
 * 
 * Ventana emergente (overlay/dialog) renderizada de forma accesible en el final de `<body>` 
 * utilizando `createPortal` de React. Maneja automáticamente el bloqueo de scroll del cuerpo del
 * documento y el atajo de teclado ESC para mejorar la experiencia de usuario.
 * 
 * @param props - Propiedades definidas en {@link ModalProps}.
 * 
 * @example
 * ```tsx
 * const [abierto, setAbierto] = useState(false);
 * 
 * <Modal
 *   isOpen={abierto}
 *   onClose={() => setAbierto(false)}
 *   title="Confirmar eliminación"
 *   footer={
 *     <>
 *       <Button variant="secondary" onClick={() => setAbierto(false)}>Cancelar</Button>
 *       <Button variant="danger" onClick={confirmDelete}>Eliminar</Button>
 *     </>
 *   }
 * >
 *   <p>¿Estás seguro de que deseas eliminar este producto permanentemente?</p>
 * </Modal>
 * ```
 */
export const Modal: FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  className = '',
  closeOnOverlayClick = true
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Cerrar con la tecla ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Evitar el scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && e.target === overlayRef.current) {
      onClose();
    }
  };

  if (!isOpen) return null;

  // Usamos createPortal para renderizar el modal fuera del DOM de su componente padre
  return createPortal(
    <div 
      className="modal-overlay" 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="modal-title"
      ref={overlayRef}
      onClick={handleOverlayClick}
    >
      <div className={`modal ${className}`}>
        <div className="modal__header">
          <h2 id="modal-title" className="modal__title">{title}</h2>
          <button className="modal__close-btn" onClick={onClose} aria-label="Cerrar modal">
            <Icon name="X" />
          </button>
        </div>
        
        <div className="modal__body">
          {children}
        </div>
 
        {footer && (
          <div className="modal__footer">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
