/**
 * AI usage tracking model
 */

import { PlanTier } from '../config/featureFlags';

export interface AIUsage {
  id: string;
  periodStart: string; // ISO timestamp
  periodEnd: string;
  tier: PlanTier;

  // ASR usage
  asrMinutesUsed: number;

  // LLM usage (approximate)
  llmTokensUsedApprox: number;

  // Request counts
  meetingsCreated: number;
  aiRequestsToday: number;

  lastUpdated: string;
}

export interface CreateAIUsageInput {
  periodStart: string;
  periodEnd: string;
  tier: PlanTier;
}

export interface UpdateAIUsageInput {
  asrMinutesUsed?: number;
  llmTokensUsedApprox?: number;
  meetingsCreated?: number;
  aiRequestsToday?: number;
}

/**
 * Calculate current period dates (monthly)
 */
export function getCurrentPeriod(): { start: string; end: string } {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  return {
    start: start.toISOString(),
    end: end.toISOString(),
  };
}

/**
 * Check if a date is in the current period
 */
export function isInCurrentPeriod(dateStr: string): boolean {
  const date = new Date(dateStr);
  const { start, end } = getCurrentPeriod();
  return date >= new Date(start) && date <= new Date(end);
}
