/**
 * SQLite database connection and initialization
 */

import Database from 'better-sqlite3';
import { app } from 'electron';
import path from 'path';
import fs from 'fs';
import { DB_NAME } from '../../src/config/appConfig';

let db: Database.Database | null = null;

export function getDatabase(): Database.Database {
  if (!db) {
    const userDataPath = app.getPath('userData');
    const dbPath = path.join(userDataPath, DB_NAME);

    // Ensure directory exists
    const dbDir = path.dirname(dbPath);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');

    // Run migrations
    runMigrations(db);
  }

  return db;
}

export function closeDatabase(): void {
  if (db) {
    db.close();
    db = null;
  }
}

function runMigrations(database: Database.Database): void {
  // Create migrations table
  database.exec(`
    CREATE TABLE IF NOT EXISTS migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      executed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  const migrations = [
    {
      name: '001_create_tables',
      sql: getMigration001(),
    },
  ];

  for (const migration of migrations) {
    const existing = database
      .prepare('SELECT name FROM migrations WHERE name = ?')
      .get(migration.name);

    if (!existing) {
      console.log(`Running migration: ${migration.name}`);
      database.exec(migration.sql);
      database
        .prepare('INSERT INTO migrations (name) VALUES (?)')
        .run(migration.name);
      console.log(`Migration ${migration.name} completed`);
    }
  }
}

function getMigration001(): string {
  return `
    -- Meetings table
    CREATE TABLE IF NOT EXISTS meetings (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      start_time TEXT NOT NULL,
      end_time TEXT,
      duration_seconds INTEGER NOT NULL DEFAULT 0,
      source TEXT,
      calendar_event_id TEXT,
      participants_json TEXT NOT NULL DEFAULT '[]',
      tags_json TEXT NOT NULL DEFAULT '[]',
      status TEXT NOT NULL CHECK(status IN ('ongoing', 'completed', 'aborted')),
      summary_short TEXT,
      summary_detailed TEXT,
      decisions_json TEXT,
      risks_json TEXT,
      follow_up_questions_json TEXT,
      use_case_profile TEXT,
      is_in_person INTEGER NOT NULL DEFAULT 0
    );

    CREATE INDEX IF NOT EXISTS idx_meetings_status ON meetings(status);
    CREATE INDEX IF NOT EXISTS idx_meetings_created_at ON meetings(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_meetings_start_time ON meetings(start_time DESC);

    -- Transcript segments table
    CREATE TABLE IF NOT EXISTS transcript_segments (
      id TEXT PRIMARY KEY,
      meeting_id TEXT NOT NULL,
      created_at TEXT NOT NULL,
      start_time_offset_sec REAL NOT NULL,
      end_time_offset_sec REAL NOT NULL,
      speaker TEXT NOT NULL,
      text TEXT NOT NULL,
      is_final INTEGER NOT NULL DEFAULT 0,
      confidence REAL,
      FOREIGN KEY (meeting_id) REFERENCES meetings(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_transcript_meeting_id ON transcript_segments(meeting_id);
    CREATE INDEX IF NOT EXISTS idx_transcript_start_time ON transcript_segments(meeting_id, start_time_offset_sec);

    -- Action items table
    CREATE TABLE IF NOT EXISTS action_items (
      id TEXT PRIMARY KEY,
      meeting_id TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      text TEXT NOT NULL,
      owner TEXT,
      due_date TEXT,
      priority TEXT NOT NULL CHECK(priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
      status TEXT NOT NULL CHECK(status IN ('open', 'in_progress', 'done')) DEFAULT 'open',
      source TEXT NOT NULL CHECK(source IN ('ai', 'user')),
      FOREIGN KEY (meeting_id) REFERENCES meetings(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_action_items_meeting_id ON action_items(meeting_id);
    CREATE INDEX IF NOT EXISTS idx_action_items_status ON action_items(status);

    -- Settings table (single row)
    CREATE TABLE IF NOT EXISTS settings (
      id TEXT PRIMARY KEY,
      data_json TEXT NOT NULL
    );

    -- Insert default settings if not exists
    INSERT OR IGNORE INTO settings (id, data_json) VALUES (
      'default',
      '{
        "id": "default",
        "theme": "system",
        "language": "en",
        "useCaseProfile": "sales",
        "asrProvider": "dummy",
        "llmPrimary": "localHttp",
        "llmFallback": null,
        "deepseekApiKey": null,
        "openaiApiKey": null,
        "anthropicApiKey": null,
        "deepgramApiKey": null,
        "openaiWhisperApiKey": null,
        "localWhisperUrl": null,
        "localLlmBaseUrl": null,
        "localLlmModelName": null,
        "googleClientId": null,
        "googleRefreshToken": null,
        "autoStartOnBoot": false,
        "autoDetectMeetings": true,
        "dataRetentionDays": null,
        "telemetryEnabled": false,
        "llmTemperature": 0.7,
        "llmMaxTokens": 2048,
        "asrPartialDebounceMs": 500,
        "maxMeetingDurationMinutes": 480,
        "hasCompletedOnboarding": false
      }'
    );

    -- Plan table (single row)
    CREATE TABLE IF NOT EXISTS plan (
      id TEXT PRIMARY KEY,
      tier TEXT NOT NULL CHECK(tier IN ('free', 'pro')) DEFAULT 'free',
      activated_at TEXT,
      activation_key_last4 TEXT
    );

    -- Insert default plan if not exists
    INSERT OR IGNORE INTO plan (id, tier) VALUES ('current', 'free');

    -- AI Usage table
    CREATE TABLE IF NOT EXISTS ai_usage (
      id TEXT PRIMARY KEY,
      period_start TEXT NOT NULL,
      period_end TEXT NOT NULL,
      tier TEXT NOT NULL CHECK(tier IN ('free', 'pro')),
      asr_minutes_used REAL NOT NULL DEFAULT 0,
      llm_tokens_used_approx INTEGER NOT NULL DEFAULT 0,
      meetings_created INTEGER NOT NULL DEFAULT 0,
      ai_requests_today INTEGER NOT NULL DEFAULT 0,
      last_updated TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_ai_usage_period ON ai_usage(period_start, period_end);
  `;
}
