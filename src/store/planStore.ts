/**
 * Plan and usage store using Zustand
 */

import { create } from 'zustand';
import type { Plan } from '../models/Plan';
import type { AIUsage } from '../models/AIUsage';
import { PlanTier } from '../config/featureFlags';

interface PlanState {
  plan: Plan | null;
  usage: AIUsage | null;
  setPlan: (plan: Plan) => void;
  setUsage: (usage: AIUsage) => void;
  isPro: () => boolean;
}

export const usePlanStore = create<PlanState>((set, get) => ({
  plan: null,
  usage: null,
  setPlan: (plan) => set({ plan }),
  setUsage: (usage) => set({ usage }),
  isPro: () => get().plan?.tier === 'pro',
}));
