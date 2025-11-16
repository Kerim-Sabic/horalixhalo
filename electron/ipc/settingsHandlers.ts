/**
 * IPC handlers for settings
 */

import { ipcMain } from 'electron';
import { getSettings, updateSettings } from '../services/storage/settingsRepository';
import { logger } from '../utils/logger';

export function registerSettingsHandlers(): void {
  ipcMain.handle('settings:get', async () => {
    try {
      return getSettings();
    } catch (error) {
      logger.error('Error getting settings:', error);
      throw error;
    }
  });

  ipcMain.handle('settings:update', async (_event, input) => {
    try {
      return updateSettings(input);
    } catch (error) {
      logger.error('Error updating settings:', error);
      throw error;
    }
  });
}
