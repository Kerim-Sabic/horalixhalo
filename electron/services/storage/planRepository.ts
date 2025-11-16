/**
 * Plan repository for database operations
 */

import { getDatabase } from '../../db/connection';
import type { Plan, UpdatePlanInput } from '../../../src/models/Plan';

const PLAN_ID = 'current';

export function getCurrentPlan(): Plan {
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM plan WHERE id = ?');
  const row = stmt.get(PLAN_ID) as any;

  if (!row) {
    throw new Error('Plan not found - database may not be initialized');
  }

  return {
    id: row.id,
    tier: row.tier,
    activatedAt: row.activated_at,
    activationKeyLast4: row.activation_key_last4,
  };
}

export function updatePlan(input: UpdatePlanInput): Plan {
  const db = getDatabase();
  const now = new Date().toISOString();

  let activationKeyLast4: string | null = null;
  if (input.activationKey) {
    // Extract last 4 characters of activation key
    activationKeyLast4 = input.activationKey.slice(-4);
  }

  const stmt = db.prepare(`
    UPDATE plan SET
      tier = ?,
      activated_at = ?,
      activation_key_last4 = ?
    WHERE id = ?
  `);

  stmt.run(input.tier, now, activationKeyLast4, PLAN_ID);

  return getCurrentPlan();
}
