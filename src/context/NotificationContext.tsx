import { createContext, useState, useCallback, ReactNode, FC, useMemo } from 'react';

/**
 * Estilos visuales soportados para las notificaciones.
 */
export type NotificationType = 'success' | 'danger' | 'warning' | 'info';

/**
 * Estructura de un objeto de notificación.
 */
export interface Notification {
  /** Identificador único de la notificación. */
  id: string;
  /** Cuerpo del mensaje a mostrar. */
  message: string;
  /** Tipo de notificación que afecta al color y al icono. */
  type: NotificationType;
  /** Título opcional de la notificación. */
  title?: string;
}

/**
 * Representa el estado y las funciones provistas por el contexto de notificaciones.
 */
export interface NotificationContextType {
  /** Lista de notificaciones activas en pantalla. */
  notifications: Notification[];
  /** Registra y muestra una nueva notificación. */
  showNotification: (message: string, type?: NotificationType, title?: string) => void;
  /** Remueve y cierra una notificación activa. */
  hideNotification: (id: string) => void;
}

/**
 * Contexto de React para gestionar y disparar notificaciones de banner.
 * 
 * Se consume convenientemente mediante el hook {@link useNotify}.
 */
export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

/**
 * Proveedor de contexto (Provider) que gestiona la lista de notificaciones activas.
 * 
 * Expone métodos para agregar nuevas notificaciones con auto-cerrado programado
 * a los 5 segundos de su creación.
 * 
 * @example
 * ```tsx
 * import { NotificationProvider } from './context/NotificationContext';
 * 
 * const App = () => (
 *   <NotificationProvider>
 *     <MyLayout />
 *   </NotificationProvider>
 * );
 * ```
 * 
 * @param props - Props de componente que contiene los nodos hijos.
 * @returns Elemento proveedor de React.
 */
export const NotificationProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const hideNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const showNotification = useCallback((message: string, type: NotificationType = 'info', title?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    
    setNotifications((prev) => [...prev, { id, message, type, title }]);

    // Auto-cerrado después de 5 segundos
    setTimeout(() => {
      hideNotification(id);
    }, 5000);
  }, [hideNotification]);

  const value = useMemo(() => ({
    notifications,
    showNotification,
    hideNotification
  }), [notifications, showNotification, hideNotification]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
