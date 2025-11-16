/**
 * Application settings model
 */

export type Theme = 'system' | 'light' | 'dark';
export type UseCaseProfile = 'sales' | 'internal' | 'standup' | 'support' | 'custom';
export type AsrProvider = 'deepgram' | 'openaiWhisper' | 'localWhisper' | 'dummy';
export type LlmProvider = 'deepseek' | 'openai' | 'anthropic' | 'localHttp';

export interface Settings {
  id: string;
  theme: Theme;
  language: string;
  useCaseProfile: UseCaseProfile;

  // ASR Configuration
  asrProvider: AsrProvider;
  deepgramApiKey: string | null;
  openaiWhisperApiKey: string | null;
  localWhisperUrl: string | null;

  // LLM Configuration
  llmPrimary: LlmProvider;
  llmFallback: LlmProvider | null;
  deepseekApiKey: string | null;
  openaiApiKey: string | null;
  anthropicApiKey: string | null;
  localLlmBaseUrl: string | null;
  localLlmModelName: string | null;

  // Calendar Integration
  googleClientId: string | null;
  googleRefreshToken: string | null;

  // Behavior
  autoStartOnBoot: boolean;
  autoDetectMeetings: boolean;
  dataRetentionDays: number | null;
  telemetryEnabled: boolean;

  // Advanced
  llmTemperature: number;
  llmMaxTokens: number;
  asrPartialDebounceMs: number;
  maxMeetingDurationMinutes: number;

  // Onboarding
  hasCompletedOnboarding: boolean;
}

export type UpdateSettingsInput = Partial<Omit<Settings, 'id'>>;
