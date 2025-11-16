/**
 * Central application configuration
 * All app-wide constants and settings
 */

export const APP_NAME = 'Horalix Halo';
export const APP_VERSION = '1.0.0';
export const APP_DESCRIPTION = 'Invisible AI meeting assistant with offline-first architecture';

export const DEV_MODE = process.env.NODE_ENV === 'development';

export const DB_NAME = 'horalix-halo.db';

export const CONNECTIVITY_CHECK_INTERVAL_MS = 30000; // 30 seconds
export const CONNECTIVITY_PING_URL = 'https://www.google.com/generate_204';

export const DEFAULT_SETTINGS = {
  theme: 'system' as const,
  language: 'en',
  useCaseProfile: 'sales' as const,
  asrProvider: 'dummy' as const,
  llmPrimary: 'localHttp' as const,
  llmFallback: null,
  autoStartOnBoot: false,
  autoDetectMeetings: true,
  dataRetentionDays: null, // null = forever
  telemetryEnabled: false,
  llmTemperature: 0.7,
  llmMaxTokens: 2048,
  asrPartialDebounceMs: 500,
  maxMeetingDurationMinutes: 480, // 8 hours
  hasCompletedOnboarding: false,
};

export const GLOBAL_HOTKEYS = {
  TOGGLE_OVERLAY: 'CommandOrControl+Alt+H',
  TRIGGER_SAY: 'CommandOrControl+Alt+S',
  TRIGGER_FOLLOWUP: 'CommandOrControl+Alt+F',
  TRIGGER_RECAP: 'CommandOrControl+Alt+R',
  TRIGGER_ACTIONS: 'CommandOrControl+Alt+A',
};

export const OVERLAY_CONFIG = {
  DOT_SIZE: 12,
  DOT_POSITION: 'top-right' as const,
  AUTO_HIDE_DELAY_MS: 5000,
  ANIMATION_DURATION_MS: 200,
};

export const AI_CONFIG = {
  SUMMARIZATION_INTERVAL_SEC: 120, // Every 2 minutes
  RECAP_WINDOW_MINUTES: 5,
  MIN_TRANSCRIPT_LENGTH_FOR_AI: 50, // chars
};
