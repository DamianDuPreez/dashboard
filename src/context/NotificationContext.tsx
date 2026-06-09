import { createContext, useContext, useState, useCallback, type ReactNode, type FC } from 'react';

export interface AppNotification {
  id: string;
  icon: string;
  title: string;
  body: string;
  details?: string;
  time: Date;
  unread: boolean;
}

interface NotificationContextType {
  notifications: AppNotification[];
  addNotification: (notification: Omit<AppNotification, 'id' | 'time' | 'unread'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: FC<{ children: ReactNode }> = ({ children }) => {
  // Start with some initial mock notifications just to show the UI
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: '1',
      icon: '💸',
      title: 'Transfer Complete',
      body: 'Your $500 transfer to Savings Vault is done.',
      details: 'Transfer ID: TRX-889102\nFrom: Primary Account\nTo: Savings Vault\nAmount: $500.00\nStatus: Completed',
      time: new Date(Date.now() - 2 * 60000), // 2 mins ago
      unread: true,
    },
    {
      id: '2',
      icon: '📈',
      title: 'Portfolio Up 4.2%',
      body: 'Your Savings Vault grew by $350 this week.',
      details: 'Your recent investments and high-yield savings contributed to a 4.2% overall growth in the last 7 days. Keep it up!',
      time: new Date(Date.now() - 60 * 60000), // 1 hour ago
      unread: true,
    },
    {
      id: '3',
      icon: '⚠️',
      title: 'Unusual Activity',
      body: 'A large charge was declined on Business Credit.',
      details: 'Attempted Charge: $850.00 at Delta Airlines.\nReason: Exceeds daily travel limit.\nIf this was you, please update your limits in Settings.',
      time: new Date(Date.now() - 3 * 3600000), // 3 hours ago
      unread: false,
    },
  ]);

  const addNotification = useCallback((notification: Omit<AppNotification, 'id' | 'time' | 'unread'>) => {
    const newNotif: AppNotification = {
      ...notification,
      id: Math.random().toString(36).substring(2, 9),
      time: new Date(),
      unread: true,
    };
    setNotifications(prev => [newNotif, ...prev]);
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  }, []);

  const deleteNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, markAsRead, markAllAsRead, deleteNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification must be used within NotificationProvider');
  return context;
};
