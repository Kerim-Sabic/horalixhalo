/**
 * LLM Router - manages LLM provider selection and fallback
 */

import { LLMProvider } from './types';
import { localHttpProvider } from './providers/localHttpProvider';
import { deepseekProvider } from './providers/deepseekProvider';
import { openaiProvider } from './providers/openaiProvider';
import { anthropicProvider } from './providers/anthropicProvider';
import { logger } from '../../utils/logger';
import { getSettings } from '../storage/settingsRepository';
import { getCurrentPlan } from '../storage/planRepository';
import { getOrCreateCurrentUsage, incrementAiRequestCount } from '../storage/aiUsageRepository';
import { getLimitsForTier, isWithinLimit } from '../../../src/config/limitsConfig';

const providers: Record<string, LLMProvider> = {
  localHttp: localHttpProvider,
  deepseek: deepseekProvider,
  openai: openaiProvider,
  anthropic: anthropicProvider,
};

export class LLMRouter {
  private getProvider(): { primary: LLMProvider | null; fallback: LLMProvider | null } {
    const settings = getSettings();

    const primary = providers[settings.llmPrimary] || null;
    const fallback = settings.llmFallback ? providers[settings.llmFallback] || null : null;

    return { primary, fallback };
  }

  private async checkUsageLimits(): Promise<{ allowed: boolean; reason?: string }> {
    try {
      const plan = getCurrentPlan();
      const usage = getOrCreateCurrentUsage(plan.tier);
      const limits = getLimitsForTier(plan.tier);

      // Check AI requests per day limit
      if (!isWithinLimit(usage.aiRequestsToday, limits.maxAiRequestsPerDay)) {
        return {
          allowed: false,
          reason: `Daily AI request limit reached (${limits.maxAiRequestsPerDay} requests)`,
        };
      }

      return { allowed: true };
    } catch (error) {
      logger.error('Error checking usage limits:', error);
      // Allow request on error to avoid blocking
      return { allowed: true };
    }
  }

  private async trackRequest(): Promise<void> {
    try {
      const plan = getCurrentPlan();
      const usage = getOrCreateCurrentUsage(plan.tier);
      incrementAiRequestCount(usage.id);
    } catch (error) {
      logger.error('Error tracking AI request:', error);
    }
  }

  private async executeWithRetry<T>(
    fn: () => Promise<T>,
    providerName: string,
    maxRetries = 2
  ): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        if (attempt > 0) {
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
          logger.info(`Retrying ${providerName} after ${delay}ms (attempt ${attempt + 1}/${maxRetries + 1})`);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }

        return await fn();
      } catch (error) {
        lastError = error as Error;
        logger.warn(`${providerName} attempt ${attempt + 1} failed:`, error);
      }
    }

    throw lastError || new Error(`Failed after ${maxRetries + 1} attempts`);
  }

  async generateSummary(input: any): Promise<any> {
    // Check usage limits
    const limitCheck = await this.checkUsageLimits();
    if (!limitCheck.allowed) {
      throw new Error(limitCheck.reason);
    }

    const { primary, fallback } = this.getProvider();

    if (!primary) {
      throw new Error('No LLM provider configured');
    }

    try {
      const result = await this.executeWithRetry(
        () => primary.generateSummary(input),
        primary.displayName
      );
      await this.trackRequest();
      return result;
    } catch (primaryError) {
      logger.error(`Primary provider (${primary.displayName}) failed:`, primaryError);

      if (fallback) {
        logger.info(`Trying fallback provider: ${fallback.displayName}`);
        try {
          const result = await this.executeWithRetry(
            () => fallback.generateSummary(input),
            fallback.displayName
          );
          await this.trackRequest();
          return result;
        } catch (fallbackError) {
          logger.error(`Fallback provider (${fallback.displayName}) also failed:`, fallbackError);
          throw fallbackError;
        }
      }

      throw primaryError;
    }
  }

  async suggestReply(input: any): Promise<any> {
    const limitCheck = await this.checkUsageLimits();
    if (!limitCheck.allowed) {
      throw new Error(limitCheck.reason);
    }

    const { primary, fallback } = this.getProvider();
    if (!primary) throw new Error('No LLM provider configured');

    try {
      const result = await this.executeWithRetry(
        () => primary.suggestReply(input),
        primary.displayName
      );
      await this.trackRequest();
      return result;
    } catch (error) {
      if (fallback) {
        const result = await this.executeWithRetry(
          () => fallback.suggestReply(input),
          fallback.displayName
        );
        await this.trackRequest();
        return result;
      }
      throw error;
    }
  }

  async generateFollowup(input: any): Promise<any> {
    const limitCheck = await this.checkUsageLimits();
    if (!limitCheck.allowed) {
      throw new Error(limitCheck.reason);
    }

    const { primary, fallback } = this.getProvider();
    if (!primary) throw new Error('No LLM provider configured');

    try {
      const result = await this.executeWithRetry(
        () => primary.generateFollowup(input),
        primary.displayName
      );
      await this.trackRequest();
      return result;
    } catch (error) {
      if (fallback) {
        const result = await this.executeWithRetry(
          () => fallback.generateFollowup(input),
          fallback.displayName
        );
        await this.trackRequest();
        return result;
      }
      throw error;
    }
  }

  async extractActionItems(input: any): Promise<any> {
    const limitCheck = await this.checkUsageLimits();
    if (!limitCheck.allowed) {
      throw new Error(limitCheck.reason);
    }

    const { primary, fallback } = this.getProvider();
    if (!primary) throw new Error('No LLM provider configured');

    try {
      const result = await this.executeWithRetry(
        () => primary.extractActionItems(input),
        primary.displayName
      );
      await this.trackRequest();
      return result;
    } catch (error) {
      if (fallback) {
        const result = await this.executeWithRetry(
          () => fallback.extractActionItems(input),
          fallback.displayName
        );
        await this.trackRequest();
        return result;
      }
      throw error;
    }
  }

  async analyzeRisks(input: any): Promise<any> {
    const limitCheck = await this.checkUsageLimits();
    if (!limitCheck.allowed) {
      throw new Error(limitCheck.reason);
    }

    const { primary, fallback } = this.getProvider();
    if (!primary) throw new Error('No LLM provider configured');

    try {
      const result = await this.executeWithRetry(
        () => primary.analyzeRisks(input),
        primary.displayName
      );
      await this.trackRequest();
      return result;
    } catch (error) {
      if (fallback) {
        const result = await this.executeWithRetry(
          () => fallback.analyzeRisks(input),
          fallback.displayName
        );
        await this.trackRequest();
        return result;
      }
      throw error;
    }
  }

  async transformTone(input: any): Promise<any> {
    const limitCheck = await this.checkUsageLimits();
    if (!limitCheck.allowed) {
      throw new Error(limitCheck.reason);
    }

    const { primary, fallback } = this.getProvider();
    if (!primary) throw new Error('No LLM provider configured');

    try {
      const result = await this.executeWithRetry(
        () => primary.transformTone(input),
        primary.displayName
      );
      await this.trackRequest();
      return result;
    } catch (error) {
      if (fallback) {
        const result = await this.executeWithRetry(
          () => fallback.transformTone(input),
          fallback.displayName
        );
        await this.trackRequest();
        return result;
      }
      throw error;
    }
  }
}

// Singleton instance
export const llmRouter = new LLMRouter();
