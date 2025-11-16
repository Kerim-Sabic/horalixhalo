/**
 * Settings store using Zustand
 */

import { create } from 'zustand';
import type { Settings } from '../models/Settings';

interface SettingsState {
  settings: Settings | null;
  isLoading: boolean;
  error: string | null;
  setSettings: (settings: Settings) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: null,
  isLoading: false,
  error: null,
  setSettings: (settings) => set({ settings, error: null }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
