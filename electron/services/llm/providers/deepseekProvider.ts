/**
 * DeepSeek LLM provider
 * Cost-effective AI with OpenAI-compatible API
 */

import { LLMProvider } from '../types';
import { logger } from '../../../utils/logger';
import fetch from 'node-fetch';
import * as prompts from '../llmPromptTemplates';

const DEEPSEEK_API_BASE = 'https://api.deepseek.com/v1';

export const deepseekProvider: LLMProvider = {
  id: 'deepseek',
  displayName: 'DeepSeek',
  isOnlineService: true,

  async generateSummary(input) {
    const prompt = prompts.buildSummaryPrompt(input);
    const response = await callDeepSeek(prompt, input.useCaseProfile);
    return parseJSONResponse(response);
  },

  async suggestReply(input) {
    const prompt = prompts.buildReplySuggestionPrompt(input);
    const response = await callDeepSeek(prompt, 'custom');
    return parseJSONResponse(response);
  },

  async generateFollowup(input) {
    const prompt = prompts.buildFollowupQuestionsPrompt(input);
    const response = await callDeepSeek(prompt, 'custom');
    return parseJSONResponse(response);
  },

  async extractActionItems(input) {
    const prompt = prompts.buildActionItemsPrompt(input);
    const response = await callDeepSeek(prompt, 'custom');
    return parseJSONResponse(response);
  },

  async analyzeRisks(input) {
    const prompt = prompts.buildRiskAnalysisPrompt(input);
    const response = await callDeepSeek(prompt, 'custom');
    return parseJSONResponse(response);
  },

  async transformTone(input) {
    const prompt = prompts.buildToneTransformPrompt(input);
    const response = await callDeepSeek(prompt, 'custom');
    return parseJSONResponse(response);
  },
};

async function callDeepSeek(prompt: string, useCaseProfile: string): Promise<string> {
  // Get API key from settings (would be passed through config)
  const { getSettings } = require('../../storage/settingsRepository');
  const settings = getSettings();

  if (!settings.deepseekApiKey) {
    throw new Error('DeepSeek API key not configured');
  }

  const systemPrompt = prompts.USE_CASE_SYSTEM_PROMPTS[useCaseProfile as keyof typeof prompts.USE_CASE_SYSTEM_PROMPTS] || prompts.USE_CASE_SYSTEM_PROMPTS.custom;

  try {
    const response = await fetch(`${DEEPSEEK_API_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${settings.deepseekApiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt },
        ],
        temperature: settings.llmTemperature || 0.7,
        max_tokens: settings.llmMaxTokens || 2048,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      logger.error('DeepSeek API error:', error);
      throw new Error(`DeepSeek API error: ${response.statusText}`);
    }

    const data: any = await response.json();
    const content = data.choices?.[0]?.message?.content || '';

    // Track token usage (approximate)
    const tokensUsed = data.usage?.total_tokens || estimateTokens(prompt + content);
    trackTokenUsage(tokensUsed);

    return content;
  } catch (error) {
    logger.error('DeepSeek request failed:', error);
    throw error;
  }
}

function parseJSONResponse(response: string): any {
  try {
    // Extract JSON from response (handle markdown code blocks)
    let jsonStr = response.trim();

    // Remove markdown code block if present
    if (jsonStr.startsWith('```json')) {
      jsonStr = jsonStr.replace(/```json\n?/g, '').replace(/```\n?$/g, '');
    } else if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/```\n?/g, '');
    }

    return JSON.parse(jsonStr);
  } catch (error) {
    logger.error('Failed to parse LLM JSON response:', error);
    logger.error('Raw response:', response);
    // Return a fallback structure
    return {
      error: 'Failed to parse AI response',
      raw: response,
    };
  }
}

function estimateTokens(text: string): number {
  // Rough estimate: 1 token ≈ 4 characters
  return Math.ceil(text.length / 4);
}

function trackTokenUsage(tokens: number): void {
  // Track in AI usage table
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
