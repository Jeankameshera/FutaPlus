// src/stores/notificationStore.ts
import { create } from "zustand";

type NotificationStore = {
  emailEnabled: boolean;
  smsEnabled: boolean;
  toggleEmail: () => void;
  toggleSMS: () => void;
};

export const useNotificationStore = create<NotificationStore>((set) => ({
  emailEnabled: true,
  smsEnabled: false,
  toggleEmail: () => set((state) => ({ emailEnabled: !state.emailEnabled })),
  toggleSMS: () => set((state) => ({ smsEnabled: !state.smsEnabled })),
}));
