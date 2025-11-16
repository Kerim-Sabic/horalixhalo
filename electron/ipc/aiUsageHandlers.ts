/**
 * IPC handlers for AI usage tracking
 */

import { ipcMain } from 'electron';
import { getOrCreateCurrentUsage } from '../services/storage/aiUsageRepository';
import { getCurrentPlan } from '../services/storage/planRepository';
import { logger } from '../utils/logger';

export function registerAIUsageHandlers(): void {
  ipcMain.handle('usage:getCurrent', async () => {
    try {
      const plan = getCurrentPlan();
      return getOrCreateCurrentUsage(plan.tier);
    } catch (error) {
      logger.error('Error getting current usage:', error);
      throw error;
    }
  });
}
