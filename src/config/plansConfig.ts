/**
 * Plan tier definitions and feature sets
 */

import { PlanTier } from './featureFlags';

export interface PlanDefinition {
  tier: PlanTier;
  displayName: string;
  description: string;
  price: string;
  features: string[];
  limits: {
    meetingsPerMonth: number | null; // null = unlimited
    asrMinutesPerMonth: number | null;
    aiRequestsPerDay: number | null;
  };
}

export const PLANS: Record<PlanTier, PlanDefinition> = {
  free: {
    tier: 'free',
    displayName: 'Free',
    description: 'Perfect for getting started with AI meeting assistance',
    price: 'Always free',
    features: [
      '50 meetings per month',
      '300 minutes of transcription per month',
      '100 AI requests per day',
      'Basic overlay tools',
      'Local AI support (unlimited)',
      'All core features',
      'Offline mode',
    ],
    limits: {
      meetingsPerMonth: 50,
      asrMinutesPerMonth: 300,
      aiRequestsPerDay: 100,
    },
  },
  pro: {
    tier: 'pro',
    displayName: 'Pro',
    description: 'For professionals who need unlimited power and advanced features',
    price: '$29/month',
    features: [
      'Unlimited meetings',
      'Unlimited transcription',
      'Unlimited AI requests',
      'All overlay tools',
      'Calendar integration',
      'Advanced AI prompts',
      'Risk analysis',
      'Conversation coach',
      'Advanced search',
      'Priority support',
    ],
    limits: {
      meetingsPerMonth: null,
      asrMinutesPerMonth: null,
      aiRequestsPerDay: null,
    },
  },
};

export function getPlanDefinition(tier: PlanTier): PlanDefinition {
  return PLANS[tier];
}
