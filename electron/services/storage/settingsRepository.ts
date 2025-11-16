/**
 * Settings repository for database operations
 */

import { getDatabase } from '../../db/connection';
import type { Settings, UpdateSettingsInput } from '../../../src/models/Settings';

const SETTINGS_ID = 'default';

export function getSettings(): Settings {
  const db = getDatabase();
  const stmt = db.prepare('SELECT data_json FROM settings WHERE id = ?');
  const row = stmt.get(SETTINGS_ID) as any;

  if (!row) {
    throw new Error('Settings not found - database may not be initialized');
  }

  return JSON.parse(row.data_json) as Settings;
}

export function updateSettings(input: UpdateSettingsInput): Settings {
  const db = getDatabase();
  const current = getSettings();

  const updated: Settings = {
    ...current,
    ...input,
  };

  const stmt = db.prepare('UPDATE settings SET data_json = ? WHERE id = ?');
  stmt.run(JSON.stringify(updated), SETTINGS_ID);

  return updated;
}

export function resetSettings(): Settings {
  const db = getDatabase();

  const defaultSettings: Settings = {
    id: SETTINGS_ID,
    theme: 'system',
    language: 'en',
    useCaseProfile: 'sales',
    asrProvider: 'dummy',
    llmPrimary: 'localHttp',
    llmFallback: null,
    deepseekApiKey: null,
    openaiApiKey: null,
    anthropicApiKey: null,
    deepgramApiKey: null,
    openaiWhisperApiKey: null,
    localWhisperUrl: null,
    localLlmBaseUrl: null,
    localLlmModelName: null,
    googleClientId: null,
    googleRefreshToken: null,
    autoStartOnBoot: false,
    autoDetectMeetings: true,
    dataRetentionDays: null,
    telemetryEnabled: false,
    llmTemperature: 0.7,
    llmMaxTokens: 2048,
    asrPartialDebounceMs: 500,
    maxMeetingDurationMinutes: 480,
    hasCompletedOnboarding: false,
  };

  const stmt = db.prepare('UPDATE settings SET data_json = ? WHERE id = ?');
  stmt.run(JSON.stringify(defaultSettings), SETTINGS_ID);

  return defaultSettings;
}
