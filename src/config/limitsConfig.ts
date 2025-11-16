/**
 * Usage limits configuration and enforcement
 */

import { PlanTier } from './featureFlags';

export interface UsageLimits {
  maxMeetingsPerMonth: number | null;
  maxAsrMinutesPerMonth: number | null;
  maxAiRequestsPerDay: number | null;
}

export const LIMITS: Record<PlanTier, UsageLimits> = {
  free: {
    maxMeetingsPerMonth: 50,
    maxAsrMinutesPerMonth: 300,
    maxAiRequestsPerDay: 100,
  },
  pro: {
    maxMeetingsPerMonth: null, // unlimited
    maxAsrMinutesPerMonth: null,
    maxAiRequestsPerDay: null,
  },
};

export function getLimitsForTier(tier: PlanTier): UsageLimits {
  return LIMITS[tier];
}

/**
 * Check if usage is within limits
 */
export function isWithinLimit(
  current: number,
  limit: number | null
): boolean {
  if (limit === null) return true; // unlimited
  return current < limit;
}

/**
 * Calculate usage percentage (0-100)
 */
export function getUsagePercentage(
  current: number,
  limit: number | null
): number {
  if (limit === null) return 0; // unlimited, no percentage
  if (limit === 0) return 100;
  return Math.min(100, (current / limit) * 100);
}

/**
 * Get human-readable usage string
 */
export function getUsageString(
  current: number,
  limit: number | null
): string {
  if (limit === null) return `${current} (unlimited)`;
  return `${current} / ${limit}`;
}
