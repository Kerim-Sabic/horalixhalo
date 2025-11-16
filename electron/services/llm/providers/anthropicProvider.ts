/**
 * Anthropic Claude LLM provider
 * Advanced reasoning and analysis
 */

import { LLMProvider } from '../types';
import { logger } from '../../../utils/logger';
import fetch from 'node-fetch';
import * as prompts from '../llmPromptTemplates';

const ANTHROPIC_API_BASE = 'https://api.anthropic.com/v1';

export const anthropicProvider: LLMProvider = {
  id: 'anthropic',
  displayName: 'Anthropic (Claude)',
  isOnlineService: true,

  async generateSummary(input) {
    const prompt = prompts.buildSummaryPrompt(input);
    const response = await callAnthropic(prompt, input.useCaseProfile);
    return parseJSONResponse(response);
  },

  async suggestReply(input) {
    const prompt = prompts.buildReplySuggestionPrompt(input);
    const response = await callAnthropic(prompt, 'custom');
    return parseJSONResponse(response);
  },

  async generateFollowup(input) {
    const prompt = prompts.buildFollowupQuestionsPrompt(input);
    const response = await callAnthropic(prompt, 'custom');
    return parseJSONResponse(response);
  },

  async extractActionItems(input) {
    const prompt = prompts.buildActionItemsPrompt(input);
    const response = await callAnthropic(prompt, 'custom');
    return parseJSONResponse(response);
  },

  async analyzeRisks(input) {
    const prompt = prompts.buildRiskAnalysisPrompt(input);
    const response = await callAnthropic(prompt, 'custom');
    return parseJSONResponse(response);
  },

  async transformTone(input) {
    const prompt = prompts.buildToneTransformPrompt(input);
    const response = await callAnthropic(prompt, 'custom');
    return parseJSONResponse(response);
  },
};

async function callAnthropic(prompt: string, useCaseProfile: string): Promise<string> {
  const { getSettings } = require('../../storage/settingsRepository');
  const settings = getSettings();

  if (!settings.anthropicApiKey) {
    throw new Error('Anthropic API key not configured');
  }

  const systemPrompt = prompts.USE_CASE_SYSTEM_PROMPTS[useCaseProfile as keyof typeof prompts.USE_CASE_SYSTEM_PROMPTS] || prompts.USE_CASE_SYSTEM_PROMPTS.custom;

  try {
    const response = await fetch(`${ANTHROPIC_API_BASE}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': settings.anthropicApiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229', // or claude-3-opus for more power
        max_tokens: settings.llmMaxTokens || 2048,
        temperature: settings.llmTemperature || 0.7,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      logger.error('Anthropic API error:', error);
      throw new Error(`Anthropic API error: ${response.statusText}`);
    }

    const data: any = await response.json();
    const content = data.content?.[0]?.text || '';

    // Track token usage (Anthropic provides input_tokens and output_tokens)
    const tokensUsed = (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0);
    trackTokenUsage(tokensUsed);

    return content;
  } catch (error) {
    logger.error('Anthropic request failed:', error);
    throw error;
  }
}

function parseJSONResponse(response: string): any {
  try {
    let jsonStr = response.trim();

    if (jsonStr.startsWith('```json')) {
      jsonStr = jsonStr.replace(/```json\n?/g, '').replace(/```\n?$/g, '');
    } else if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/```\n?/g, '');
    }

    return JSON.parse(jsonStr);
  } catch (error) {
    logger.error('Failed to parse Anthropic JSON response:', error);
    logger.error('Raw response:', response);
    return {
      error: 'Failed to parse AI response',
      raw: response,
    };
  }
}

function trackTokenUsage(tokens: number): void {
  const { getOrCreateCurrentUsage, incrementLlmUsage } = require('../../storage/aiUsageRepository');
  const { getCurrentPlan } = require('../../storage/planRepository');

  try {
    const plan = getCurrentPlan();
    const usage = getOrCreateCurrentUsage(plan.tier);
    incrementLlmUsage(usage.id, tokens);
  } catch (error) {
    logger.error('Failed to track token usage:', error);
  }
}
