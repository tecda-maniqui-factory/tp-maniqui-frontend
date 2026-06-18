import React, { FC, ReactNode, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Icon from '@/components/atoms/display/Icon';;
import './Modal.css';

/**
 * Props for the Modal component.
 */
export interface ModalProps {
  /** Indicates whether the modal window is currently open. */
  isOpen: boolean;
  /** Callback triggered to request closing the modal. */
  onClose: () => void;
  /** Header title text displayed at the top of the modal. */
  title: string;
  /** Main body content to render inside the modal. */
  children: ReactNode;
  /** Optional actions/buttons component to show in the footer area. */
  footer?: ReactNode;
  /** Optional additional CSS class for custom container styling. */
  className?: string;
  /** Toggles overlay backdrop click dismissal (default: true). */
  closeOnOverlayClick?: boolean;
}

/**
 * Componente Organismo: Modal
 * Ventana emergente renderizada mediante un Portal de React al final del body.
 */
const Modal: FC<ModalProps> = ({
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
