/**
 * AI Usage repository for database operations
 */

import { getDatabase } from '../../db/connection';
import { generateId } from '../../utils/uuid';
import type {
  AIUsage,
  CreateAIUsageInput,
  UpdateAIUsageInput,
} from '../../../src/models/AIUsage';
import { getCurrentPeriod } from '../../../src/models/AIUsage';

export function getOrCreateCurrentUsage(tier: string): AIUsage {
  const db = getDatabase();
  const { start, end } = getCurrentPeriod();

  // Try to get existing usage for current period
  const stmt = db.prepare(`
    SELECT * FROM ai_usage
    WHERE period_start = ? AND period_end = ?
    ORDER BY last_updated DESC
    LIMIT 1
  `);

  const row = stmt.get(start, end) as any;

  if (row) {
    return rowToUsage(row);
  }

  // Create new usage record for current period
  const usage: AIUsage = {
    id: generateId(),
    periodStart: start,
    periodEnd: end,
    tier: tier as any,
    asrMinutesUsed: 0,
    llmTokensUsedApprox: 0,
    meetingsCreated: 0,
    aiRequestsToday: 0,
    lastUpdated: new Date().toISOString(),
  };

  const insertStmt = db.prepare(`
    INSERT INTO ai_usage (
      id, period_start, period_end, tier, asr_minutes_used,
      llm_tokens_used_approx, meetings_created, ai_requests_today, last_updated
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertStmt.run(
    usage.id,
    usage.periodStart,
    usage.periodEnd,
    usage.tier,
    usage.asrMinutesUsed,
    usage.llmTokensUsedApprox,
    usage.meetingsCreated,
    usage.aiRequestsToday,
    usage.lastUpdated
  );

  return usage;
}

export function updateUsage(id: string, input: UpdateAIUsageInput): AIUsage | null {
  const db = getDatabase();
  const existing = getUsageById(id);
  if (!existing) return null;

  const updated: AIUsage = {
    ...existing,
    ...input,
    lastUpdated: new Date().toISOString(),
  };

  const stmt = db.prepare(`
    UPDATE ai_usage SET
      asr_minutes_used = ?,
      llm_tokens_used_approx = ?,
      meetings_created = ?,
      ai_requests_today = ?,
      last_updated = ?
    WHERE id = ?
  `);

  stmt.run(
    updated.asrMinutesUsed,
    updated.llmTokensUsedApprox,
    updated.meetingsCreated,
    updated.aiRequestsToday,
    updated.lastUpdated,
    id
  );

  return updated;
}

export function incrementAsrUsage(id: string, minutes: number): AIUsage | null {
  const existing = getUsageById(id);
  if (!existing) return null;

  return updateUsage(id, {
    asrMinutesUsed: existing.asrMinutesUsed + minutes,
  });
}

export function incrementLlmUsage(id: string, tokens: number): AIUsage | null {
  const existing = getUsageById(id);
  if (!existing) return null;

  return updateUsage(id, {
    llmTokensUsedApprox: existing.llmTokensUsedApprox + tokens,
  });
}

export function incrementMeetingCount(id: string): AIUsage | null {
  const existing = getUsageById(id);
  if (!existing) return null;

  return updateUsage(id, {
    meetingsCreated: existing.meetingsCreated + 1,
  });
}

export function incrementAiRequestCount(id: string): AIUsage | null {
  const existing = getUsageById(id);
  if (!existing) return null;

  return updateUsage(id, {
    aiRequestsToday: existing.aiRequestsToday + 1,
  });
}

export function resetDailyAiRequests(id: string): AIUsage | null {
  return updateUsage(id, { aiRequestsToday: 0 });
}

export function getUsageById(id: string): AIUsage | null {
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM ai_usage WHERE id = ?');
  const row = stmt.get(id) as any;

  if (!row) return null;

  return rowToUsage(row);
}

function rowToUsage(row: any): AIUsage {
  return {
    id: row.id,
    periodStart: row.period_start,
    periodEnd: row.period_end,
    tier: row.tier,
    asrMinutesUsed: row.asr_minutes_used,
    llmTokensUsedApprox: row.llm_tokens_used_approx,
    meetingsCreated: row.meetings_created,
    aiRequestsToday: row.ai_requests_today,
    lastUpdated: row.last_updated,
  };
}
