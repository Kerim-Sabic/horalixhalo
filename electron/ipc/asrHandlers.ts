/**
 * IPC handlers for ASR (Automatic Speech Recognition)
 */

import { ipcMain } from 'electron';
import { logger } from '../utils/logger';
import { startASR, stopASR, pauseASR, resumeASR } from '../services/asr/asrRouter';
import { getMainWindow } from '../windows/windowManager';

export function registerASRHandlers(): void {
  ipcMain.handle('asr:start', async (_event, meetingId) => {
    try {
      logger.info('ASR start requested for meeting:', meetingId);
      const mainWindow = getMainWindow();
      if (!mainWindow) {
        throw new Error('Main window not found');
      }
      await startASR(meetingId, mainWindow);
      return { success: true };
    } catch (error) {
      logger.error('Error starting ASR:', error);
      throw error;
    }
  });

  ipcMain.handle('asr:stop', async () => {
    try {
      logger.info('ASR stop requested');
      await stopASR();
      return { success: true };
    } catch (error) {
      logger.error('Error stopping ASR:', error);
      throw error;
    }
  });

  ipcMain.handle('asr:pause', async () => {
    try {
      logger.info('ASR pause requested');
      await pauseASR();
      return { success: true };
    } catch (error) {
      logger.error('Error pausing ASR:', error);
      throw error;
    }
  });

  ipcMain.handle('asr:resume', async () => {
    try {
      logger.info('ASR resume requested');
      await resumeASR();
      return { success: true };
    } catch (error) {
      logger.error('Error resuming ASR:', error);
      throw error;
    }
  });
}
