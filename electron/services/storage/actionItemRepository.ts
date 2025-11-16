/**
 * Action item repository for database operations
 */

import { getDatabase } from '../../db/connection';
import { generateId } from '../../utils/uuid';
import type {
  ActionItem,
  CreateActionItemInput,
  UpdateActionItemInput,
} from '../../../src/models/ActionItem';

export function createActionItem(input: CreateActionItemInput): ActionItem {
  const db = getDatabase();
  const now = new Date().toISOString();
  const id = generateId();

  const actionItem: ActionItem = {
    id,
    meetingId: input.meetingId,
    createdAt: now,
    updatedAt: now,
    text: input.text,
    owner: input.owner || null,
    dueDate: input.dueDate || null,
    priority: input.priority || 'medium',
    status: input.status || 'open',
    source: input.source,
  };

  const stmt = db.prepare(`
    INSERT INTO action_items (
      id, meeting_id, created_at, updated_at, text, owner, due_date,
      priority, status, source
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    actionItem.id,
    actionItem.meetingId,
    actionItem.createdAt,
    actionItem.updatedAt,
    actionItem.text,
    actionItem.owner,
    actionItem.dueDate,
    actionItem.priority,
    actionItem.status,
    actionItem.source
  );

  return actionItem;
}

export function getActionItemsByMeeting(meetingId: string): ActionItem[] {
  const db = getDatabase();
  const stmt = db.prepare(`
    SELECT * FROM action_items
    WHERE meeting_id = ?
    ORDER BY created_at DESC
  `);
  const rows = stmt.all(meetingId) as any[];

  return rows.map(rowToActionItem);
}

export function getActionItemsByStatus(status: string): ActionItem[] {
  const db = getDatabase();
  const stmt = db.prepare(`
    SELECT * FROM action_items
    WHERE status = ?
    ORDER BY due_date ASC, created_at DESC
  `);
  const rows = stmt.all(status) as any[];

  return rows.map(rowToActionItem);
}

export function updateActionItem(
  id: string,
  input: UpdateActionItemInput
): ActionItem | null {
  const db = getDatabase();
  const existing = getActionItemById(id);
  if (!existing) return null;

  const updated: ActionItem = {
    ...existing,
    ...input,
    updatedAt: new Date().toISOString(),
  };

  const stmt = db.prepare(`
    UPDATE action_items SET
      text = ?, owner = ?, due_date = ?, priority = ?, status = ?, updated_at = ?
    WHERE id = ?
  `);

  stmt.run(
    updated.text,
    updated.owner,
    updated.dueDate,
    updated.priority,
    updated.status,
    updated.updatedAt,
    id
  );

  return updated;
}

export function getActionItemById(id: string): ActionItem | null {
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM action_items WHERE id = ?');
  const row = stmt.get(id) as any;

  if (!row) return null;

  return rowToActionItem(row);
}

export function deleteActionItem(id: string): boolean {
  const db = getDatabase();
  const stmt = db.prepare('DELETE FROM action_items WHERE id = ?');
  const result = stmt.run(id);

  return result.changes > 0;
}

function rowToActionItem(row: any): ActionItem {
  return {
    id: row.id,
    meetingId: row.meeting_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    text: row.text,
    owner: row.owner,
    dueDate: row.due_date,
    priority: row.priority,
    status: row.status,
    source: row.source,
  };
}
