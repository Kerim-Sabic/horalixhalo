/**
 * Overlay state store using Zustand
 */

import { create } from 'zustand';

interface OverlayState {
  isExpanded: boolean;
  currentResult: {
    title: string;
    body: string;
    timestamp: string;
  } | null;
  expand: () => void;
  collapse: () => void;
  toggle: () => void;
  setResult: (result: { title: string; body: string } | null) => void;
  clearResult: () => void;
}

export const useOverlayStore = create<OverlayState>((set) => ({
  isExpanded: false,
  currentResult: null,
  expand: () => set({ isExpanded: true }),
  collapse: () => set({ isExpanded: false }),
  toggle: () => set((state) => ({ isExpanded: !state.isExpanded })),
  setResult: (result) =>
    set({
      currentResult: result
        ? { ...result, timestamp: new Date().toISOString() }
        : null,
    }),
  clearResult: () => set({ currentResult: null }),
}));
