/**
 * Meeting repository for database operations
 */

import { getDatabase } from '../../db/connection';
import { generateId } from '../../utils/uuid';
import type { Meeting, CreateMeetingInput, UpdateMeetingInput } from '../../../src/models/Meeting';

export function createMeeting(input: CreateMeetingInput): Meeting {
  const db = getDatabase();
  const now = new Date().toISOString();
  const id = generateId();

  const meeting: Meeting = {
    id,
    title: input.title,
    createdAt: now,
    updatedAt: now,
    startTime: now,
    endTime: null,
    durationSeconds: 0,
    source: input.source || 'manual',
    calendarEventId: input.calendarEventId || null,
    participants: input.participants || [],
    tags: input.tags || [],
    status: 'ongoing',
    summaryShort: null,
    summaryDetailed: null,
    decisions: null,
    risks: null,
    followUpQuestions: null,
    useCaseProfile: input.useCaseProfile || null,
    isInPerson: input.isInPerson || false,
  };

  const stmt = db.prepare(`
    INSERT INTO meetings (
      id, title, created_at, updated_at, start_time, end_time, duration_seconds,
      source, calendar_event_id, participants_json, tags_json, status,
      summary_short, summary_detailed, decisions_json, risks_json,
      follow_up_questions_json, use_case_profile, is_in_person
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    meeting.id,
    meeting.title,
    meeting.createdAt,
    meeting.updatedAt,
    meeting.startTime,
    meeting.endTime,
    meeting.durationSeconds,
    meeting.source,
    meeting.calendarEventId,
    JSON.stringify(meeting.participants),
    JSON.stringify(meeting.tags),
    meeting.status,
    meeting.summaryShort,
    meeting.summaryDetailed,
    meeting.decisions ? JSON.stringify(meeting.decisions) : null,
    meeting.risks ? JSON.stringify(meeting.risks) : null,
    meeting.followUpQuestions ? JSON.stringify(meeting.followUpQuestions) : null,
    meeting.useCaseProfile,
    meeting.isInPerson ? 1 : 0
  );

  return meeting;
}

export function getMeetingById(id: string): Meeting | null {
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM meetings WHERE id = ?');
  const row = stmt.get(id) as any;

  if (!row) return null;

  return rowToMeeting(row);
}

export function getAllMeetings(limit = 100, offset = 0): Meeting[] {
  const db = getDatabase();
  const stmt = db.prepare(`
    SELECT * FROM meetings
    ORDER BY start_time DESC
    LIMIT ? OFFSET ?
  `);
  const rows = stmt.all(limit, offset) as any[];

  return rows.map(rowToMeeting);
}

export function getMeetingsByStatus(status: string): Meeting[] {
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM meetings WHERE status = ? ORDER BY start_time DESC');
  const rows = stmt.all(status) as any[];

  return rows.map(rowToMeeting);
}

export function updateMeeting(id: string, input: UpdateMeetingInput): Meeting | null {
  const db = getDatabase();
  const existing = getMeetingById(id);
  if (!existing) return null;

  const updated: Meeting = {
    ...existing,
    ...input,
    updatedAt: new Date().toISOString(),
  };

  const stmt = db.prepare(`
    UPDATE meetings SET
      title = ?, updated_at = ?, end_time = ?, duration_seconds = ?,
      participants_json = ?, tags_json = ?, status = ?,
      summary_short = ?, summary_detailed = ?, decisions_json = ?,
      risks_json = ?, follow_up_questions_json = ?, is_in_person = ?
    WHERE id = ?
  `);

  stmt.run(
    updated.title,
    updated.updatedAt,
    updated.endTime,
    updated.durationSeconds,
    JSON.stringify(updated.participants),
    JSON.stringify(updated.tags),
    updated.status,
    updated.summaryShort,
    updated.summaryDetailed,
    updated.decisions ? JSON.stringify(updated.decisions) : null,
    updated.risks ? JSON.stringify(updated.risks) : null,
    updated.followUpQuestions ? JSON.stringify(updated.followUpQuestions) : null,
    updated.isInPerson ? 1 : 0,
    id
  );

  return updated;
}

export function deleteMeeting(id: string): boolean {
  const db = getDatabase();
  const stmt = db.prepare('DELETE FROM meetings WHERE id = ?');
  const result = stmt.run(id);

  return result.changes > 0;
}

export function countMeetingsInPeriod(startDate: string, endDate: string): number {
  const db = getDatabase();
  const stmt = db.prepare(`
    SELECT COUNT(*) as count
    FROM meetings
    WHERE created_at >= ? AND created_at < ?
  `);
  const row = stmt.get(startDate, endDate) as any;

  return row?.count || 0;
}

function rowToMeeting(row: any): Meeting {
  return {
    id: row.id,
    title: row.title,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    startTime: row.start_time,
    endTime: row.end_time,
    durationSeconds: row.duration_seconds,
    source: row.source,
    calendarEventId: row.calendar_event_id,
    participants: JSON.parse(row.participants_json || '[]'),
    tags: JSON.parse(row.tags_json || '[]'),
    status: row.status,
    summaryShort: row.summary_short,
    summaryDetailed: row.summary_detailed,
    decisions: row.decisions_json ? JSON.parse(row.decisions_json) : null,
    risks: row.risks_json ? JSON.parse(row.risks_json) : null,
    followUpQuestions: row.follow_up_questions_json
      ? JSON.parse(row.follow_up_questions_json)
      : null,
    useCaseProfile: row.use_case_profile,
    isInPerson: row.is_in_person === 1,
  };
}
