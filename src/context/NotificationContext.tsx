import { createContext, useState, useCallback, ReactNode, FC, useMemo } from 'react';

/**
 * Supported notification visual styles.
 */
export type NotificationType = 'success' | 'danger' | 'warning' | 'info';

/**
 * Structure of a notification object.
 */
export interface Notification {
  /** Unique identifier of the notification. */
  id: string;
  /** Message body of the notification. */
  message: string;
  /** Type of the notification affecting its styling. */
  type: NotificationType;
  /** Optional title of the notification. */
  title?: string;
}

/**
 * Shape of the notification context state and functions.
 */
export interface NotificationContextType {
  /** List of currently active notifications. */
  notifications: Notification[];
  /** Shows a new notification with specified parameters. */
  showNotification: (message: string, type?: NotificationType, title?: string) => void;
  /** Dismisses a notification by its ID. */
  hideNotification: (id: string) => void;
}

/**
 * Context for managing and triggering notifications.
 */
export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

/**
 * NotificationProvider component that manages the list of active notifications.
 *
 * @param props - Component props containing children elements.
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
