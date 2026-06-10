import { createContext, useState, useCallback, ReactNode, FC, useMemo } from 'react';

export type NotificationType = 'success' | 'danger' | 'warning' | 'info';

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  title?: string;
}

export interface NotificationContextType {
  notifications: Notification[];
  showNotification: (message: string, type?: NotificationType, title?: string) => void;
  hideNotification: (id: string) => void;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

/**
 * Proveedor de Notificaciones: NotificationProvider
 * Gestiona el estado de las notificaciones globales.
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
