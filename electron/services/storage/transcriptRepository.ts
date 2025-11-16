/**
 * Transcript repository for database operations
 */

import { getDatabase } from '../../db/connection';
import { generateId } from '../../utils/uuid';
import type {
  TranscriptSegment,
  CreateTranscriptSegmentInput,
  UpdateTranscriptSegmentInput,
} from '../../../src/models/Transcript';

export function createTranscriptSegment(
  input: CreateTranscriptSegmentInput
): TranscriptSegment {
  const db = getDatabase();
  const now = new Date().toISOString();
  const id = generateId();

  const segment: TranscriptSegment = {
    id,
    meetingId: input.meetingId,
    createdAt: now,
    startTimeOffsetSec: input.startTimeOffsetSec,
    endTimeOffsetSec: input.endTimeOffsetSec,
    speaker: input.speaker,
    text: input.text,
    isFinal: input.isFinal,
    confidence: input.confidence || null,
  };

  const stmt = db.prepare(`
    INSERT INTO transcript_segments (
      id, meeting_id, created_at, start_time_offset_sec, end_time_offset_sec,
      speaker, text, is_final, confidence
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    segment.id,
    segment.meetingId,
    segment.createdAt,
    segment.startTimeOffsetSec,
    segment.endTimeOffsetSec,
    segment.speaker,
    segment.text,
    segment.isFinal ? 1 : 0,
    segment.confidence
  );

  return segment;
}

export function getTranscriptSegmentsByMeeting(meetingId: string): TranscriptSegment[] {
  const db = getDatabase();
  const stmt = db.prepare(`
    SELECT * FROM transcript_segments
    WHERE meeting_id = ?
    ORDER BY start_time_offset_sec ASC
  `);
  const rows = stmt.all(meetingId) as any[];

  return rows.map(rowToSegment);
}

export function getRecentTranscriptSegments(
  meetingId: string,
  windowMinutes: number
): TranscriptSegment[] {
  const db = getDatabase();
  const windowSeconds = windowMinutes * 60;

  const stmt = db.prepare(`
    SELECT * FROM transcript_segments
    WHERE meeting_id = ?
    AND start_time_offset_sec >= (
      SELECT MAX(start_time_offset_sec) - ? FROM transcript_segments WHERE meeting_id = ?
    )
    ORDER BY start_time_offset_sec ASC
  `);

  const rows = stmt.all(meetingId, windowSeconds, meetingId) as any[];

  return rows.map(rowToSegment);
}

export function updateTranscriptSegment(
  id: string,
  input: UpdateTranscriptSegmentInput
): TranscriptSegment | null {
  const db = getDatabase();
  const existing = getTranscriptSegmentById(id);
  if (!existing) return null;

  const updated: TranscriptSegment = {
    ...existing,
    ...input,
  };

  const stmt = db.prepare(`
    UPDATE transcript_segments SET
      text = ?, end_time_offset_sec = ?, is_final = ?, confidence = ?
    WHERE id = ?
  `);

  stmt.run(
    updated.text,
    updated.endTimeOffsetSec,
    updated.isFinal ? 1 : 0,
    updated.confidence,
    id
  );

  return updated;
}

export function getTranscriptSegmentById(id: string): TranscriptSegment | null {
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM transcript_segments WHERE id = ?');
  const row = stmt.get(id) as any;

  if (!row) return null;

  return rowToSegment(row);
}

export function deleteTranscriptSegmentsByMeeting(meetingId: string): boolean {
  const db = getDatabase();
  const stmt = db.prepare('DELETE FROM transcript_segments WHERE meeting_id = ?');
  const result = stmt.run(meetingId);

  return result.changes > 0;
}

function rowToSegment(row: any): TranscriptSegment {
  return {
    id: row.id,
    meetingId: row.meeting_id,
    createdAt: row.created_at,
    startTimeOffsetSec: row.start_time_offset_sec,
    endTimeOffsetSec: row.end_time_offset_sec,
    speaker: row.speaker,
    text: row.text,
    isFinal: row.is_final === 1,
    confidence: row.confidence,
  };
}
