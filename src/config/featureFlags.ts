/**
 * Feature flags registry for Free vs Pro tiers
 */

export type PlanTier = 'free' | 'pro';

export interface FeatureFlag {
  key: string;
  displayName: string;
  description: string;
  requiredTier: PlanTier;
  softLimit?: {
    free?: number;
    pro?: number;
  };
}

export const FEATURES: Record<string, FeatureFlag> = {
  // Calendar integration
  CALENDAR_INTEGRATION: {
    key: 'calendar.integration',
    displayName: 'Calendar Integration',
    description: 'Link meetings to Google Calendar events',
    requiredTier: 'pro',
  },

  // Overlay AI actions
  OVERLAY_SAY: {
    key: 'overlay.say',
    displayName: 'AI Reply Suggestions',
    description: 'Get AI-powered reply suggestions during meetings',
    requiredTier: 'free',
    softLimit: {
      free: 100, // per day
      pro: undefined, // unlimited
    },
  },

  OVERLAY_FOLLOWUP: {
    key: 'overlay.followup',
    displayName: 'Follow-up Questions',
    description: 'Generate smart follow-up questions',
    requiredTier: 'free',
    softLimit: {
      free: 50,
      pro: undefined,
    },
  },

  OVERLAY_RECAP: {
    key: 'overlay.recap',
    displayName: 'Live Recap',
    description: 'Get real-time meeting recaps',
    requiredTier: 'free',
    softLimit: {
      free: 50,
      pro: undefined,
    },
  },

  OVERLAY_ACTIONS: {
    key: 'overlay.actions',
    displayName: 'Action Item Extraction',
    description: 'Extract action items from conversations',
    requiredTier: 'free',
    softLimit: {
      free: 50,
      pro: undefined,
    },
  },

  OVERLAY_FACTCHECK: {
    key: 'overlay.factcheck',
    displayName: 'Fact Checking',
    description: 'Verify statements and claims in real-time',
    requiredTier: 'pro',
  },

  OVERLAY_TONE_TRANSFORM: {
    key: 'overlay.toneTransform',
    displayName: 'Tone Transformation',
    description: 'Transform text to different tones (politer, direct, etc.)',
    requiredTier: 'free',
    softLimit: {
      free: 30,
      pro: undefined,
    },
  },

  // Advanced AI features
  ADVANCED_PROMPTS: {
    key: 'ai.advancedPrompts',
    displayName: 'Advanced AI Prompts',
    description: 'Access to premium prompt templates',
    requiredTier: 'pro',
  },

  RISK_ANALYSIS: {
    key: 'ai.riskAnalysis',
    displayName: 'Risk Analysis',
    description: 'Identify risks and concerns in conversations',
    requiredTier: 'free',
    softLimit: {
      free: 20,
      pro: undefined,
    },
  },

  CONVERSATION_COACH: {
    key: 'ai.conversationCoach',
    displayName: 'Conversation Coach',
    description: 'Real-time coaching and guidance',
    requiredTier: 'pro',
  },

  // Data & export
  UNLIMITED_HISTORY: {
    key: 'data.unlimitedHistory',
    displayName: 'Unlimited Meeting History',
    description: 'Store unlimited meetings',
    requiredTier: 'pro',
  },

  ADVANCED_SEARCH: {
    key: 'data.advancedSearch',
    displayName: 'Advanced Search',
    description: 'Semantic search across all meetings',
    requiredTier: 'pro',
  },
};

/**
 * Check if a feature is available for a given tier
 */
export function isFeatureAvailable(featureKey: string, tier: PlanTier): boolean {
  const feature = FEATURES[featureKey];
  if (!feature) return false;

  if (feature.requiredTier === 'free') return true;
  if (feature.requiredTier === 'pro') return tier === 'pro';

  return false;
}

/**
 * Get soft limit for a feature and tier
 */
export function getFeatureLimit(
  featureKey: string,
  tier: PlanTier
): number | undefined {
  const feature = FEATURES[featureKey];
  if (!feature || !feature.softLimit) return undefined;

  return feature.softLimit[tier];
}
