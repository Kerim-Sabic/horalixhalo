/**
 * Plan and subscription model
 */

import { PlanTier } from '../config/featureFlags';

export interface Plan {
  id: string; // Always 'current'
  tier: PlanTier;
  activatedAt: string | null;
  activationKeyLast4: string | null;
}

export interface UpdatePlanInput {
  tier: PlanTier;
  activationKey?: string;
}
