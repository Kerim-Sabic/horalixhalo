/**
 * OpenAI LLM provider
 * GPT-4 and GPT-3.5-turbo support
 */

import { LLMProvider } from '../types';
import { logger } from '../../../utils/logger';
import fetch from 'node-fetch';
import * as prompts from '../llmPromptTemplates';

const OPENAI_API_BASE = 'https://api.openai.com/v1';

export const openaiProvider: LLMProvider = {
  id: 'openai',
  displayName: 'OpenAI (GPT-4)',
  isOnlineService: true,

  async generateSummary(input) {
    const prompt = prompts.buildSummaryPrompt(input);
    const response = await callOpenAI(prompt, input.useCaseProfile);
    return parseJSONResponse(response);
  },

  async suggestReply(input) {
    const prompt = prompts.buildReplySuggestionPrompt(input);
    const response = await callOpenAI(prompt, 'custom');
    return parseJSONResponse(response);
  },

  async generateFollowup(input) {
    const prompt = prompts.buildFollowupQuestionsPrompt(input);
    const response = await callOpenAI(prompt, 'custom');
    return parseJSONResponse(response);
  },

  async extractActionItems(input) {
    const prompt = prompts.buildActionItemsPrompt(input);
    const response = await callOpenAI(prompt, 'custom');
    return parseJSONResponse(response);
  },

  async analyzeRisks(input) {
    const prompt = prompts.buildRiskAnalysisPrompt(input);
    const response = await callOpenAI(prompt, 'custom');
    return parseJSONResponse(response);
  },

  async transformTone(input) {
    const prompt = prompts.buildToneTransformPrompt(input);
    const response = await callOpenAI(prompt, 'custom');
    return parseJSONResponse(response);
  },
};

async function callOpenAI(prompt: string, useCaseProfile: string): Promise<string> {
  const { getSettings } = require('../../storage/settingsRepository');
  const settings = getSettings();

  if (!settings.openaiApiKey) {
    throw new Error('OpenAI API key not configured');
  }

  const systemPrompt = prompts.USE_CASE_SYSTEM_PROMPTS[useCaseProfile as keyof typeof prompts.USE_CASE_SYSTEM_PROMPTS] || prompts.USE_CASE_SYSTEM_PROMPTS.custom;

  try {
    const response = await fetch(`${OPENAI_API_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${settings.openaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview', // or 'gpt-3.5-turbo' for cheaper option
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt },
        ],
        temperature: settings.llmTemperature || 0.7,
        max_tokens: settings.llmMaxTokens || 2048,
        response_format: { type: 'json_object' }, // Force JSON mode
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      logger.error('OpenAI API error:', error);
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data: any = await response.json();
    const content = data.choices?.[0]?.message?.content || '';

    // Track token usage
    const tokensUsed = data.usage?.total_tokens || estimateTokens(prompt + content);
    trackTokenUsage(tokensUsed);

    return content;
  } catch (error) {
    logger.error('OpenAI request failed:', error);
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
    logger.error('Failed to parse OpenAI JSON response:', error);
    logger.error('Raw response:', response);
    return {
      error: 'Failed to parse AI response',
      raw: response,
    };
  }
}

function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
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
