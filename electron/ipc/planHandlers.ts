/**
 * IPC handlers for plan management
 */

import { ipcMain } from 'electron';
import { getCurrentPlan, updatePlan } from '../services/storage/planRepository';
import { logger } from '../utils/logger';

export function registerPlanHandlers(): void {
  ipcMain.handle('plan:getCurrent', async () => {
    try {
      return getCurrentPlan();
    } catch (error) {
      logger.error('Error getting current plan:', error);
      throw error;
    }
  });

  ipcMain.handle('plan:update', async (_event, input) => {
    try {
      // TODO: Validate activation key
      return updatePlan(input);
    } catch (error) {
      logger.error('Error updating plan:', error);
      throw error;
    }
  });
}
