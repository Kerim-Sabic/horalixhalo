/**
 * Connectivity state store using Zustand
 */

import { create } from 'zustand';

type ConnectivityStatus = 'online' | 'offline' | 'degraded';

interface ConnectivityState {
  status: ConnectivityStatus;
  lastChecked: string | null;
  setStatus: (status: ConnectivityStatus) => void;
  setLastChecked: (timestamp: string) => void;
  isOnline: () => boolean;
  isOffline: () => boolean;
}

export const useConnectivityStore = create<ConnectivityState>((set, get) => ({
  status: 'online',
  lastChecked: null,
  setStatus: (status) => set({ status, lastChecked: new Date().toISOString() }),
  setLastChecked: (lastChecked) => set({ lastChecked }),
  isOnline: () => get().status === 'online',
  isOffline: () => get().status === 'offline',
}));
