import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';

export type Notification = {
    id: string;
    type: 'success' | 'error';
    title: string;
    children?: React.ReactNode;
};

type NotificationsStore = {
    notifications: Notification[];
    addNotification: (notification: Omit<Notification, 'id'>) => void;
    dismissNotification: (id: string) => void;
};

export const useNotificationStore = create<NotificationsStore>((set) => ({
    notifications: [],
    addNotification: (notification) =>
        set((state) => ({
            notifications: [...state.notifications, { id: uuidv4(), ...notification }],
        })),
    dismissNotification: (id) =>
        set((state) => ({
            notifications: state.notifications.filter((notification) => notification.id !== id),
        })),
}));
