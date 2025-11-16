/**
 * UI state store using Zustand
 */

import { create } from 'zustand';

interface UIState {
  theme: 'light' | 'dark' | 'system';
  sidebarCollapsed: boolean;
  activeModal: string | null;
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  openModal: (modalId: string) => void;
  closeModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  theme: 'system',
  sidebarCollapsed: false,
  activeModal: null,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setTheme: (theme) => set({ theme }),
  openModal: (modalId) => set({ activeModal: modalId }),
  closeModal: () => set({ activeModal: null }),
}));
